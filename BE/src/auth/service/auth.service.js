import {
  DuplicateUserEmailError,
  InvalidInputValueError,
  InvalidTokenError,
  UserNotFoundError,
} from "../../error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import {
  responseFromLogin,
  responseFromLogout,
  responseFromProfile,
  responseFromRefresh,
  responseFromSignUp,
} from "../dto/response/auth.response.dto.js";
import {
  createAccount,
  createRefreshToken,
  deleteExpiredRefreshTokens,
  deleteRefreshToken,
  findAccount,
  findAccountById,
  findRefreshToken,
  findRefreshTokenByUserId,
  updateProfile,
  updateRefreshToken,
  deleteUncompletedUsers,
} from "../repository/auth.repository.js";
/**
 * **[Auth]**
 * **\<🛠️ Service\>**
 * ***signUp***
 * '회원가입' 기능의 서비스 레이어 입니다. 새로운 계정을 생성하고, 해당 계정의 정보를 반환합니다.
 * @param {Object} body
 * @returns {Object}
 */
export const signUp = async (body) => {
  const userId = await createAccount(body);
  // ✅ 유효성 검사 (이메일)
  if (userId == -1) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일 입니다.", body);
  }
  return responseFromSignUp({ body, userId });
};
/**
 * **[Auth]**
 * **\<🛠️ Service\>**
 * ***login***
 * '로그인' 기능의 서비스 레이어 입니다. 계정을 검증하고, 엑세스 토큰과 리프레시 토큰을 발급합니다.
 * @param {Object} body
 * @returns {Object}
 */
export const login = async (body) => {
  const user = await findAccount(body);
  // ✅ 유효성 검사 (계정 존재 여부)
  if (user == -1) {
    throw new UserNotFoundError("존재하지 않는 계정 입니다.", body);
  }
  // ✅ 유효성 검사 (비밀번호)
  if (user == -2) {
    throw new InvalidInputValueError("비밀번호가 일치하지 않습니다.", body);
  }
  // ✉️ 페이로드 생성
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    nickname: user.nickname,
    isCompleted: user.isCompleted,
  };
  // 🪙 리프레시 토큰 생성
  const tokens = {};
  tokens.refresh = generateRefreshToken(payload);
  // 🪙 리프레시 토큰 저장 / 업데이트
  const oldToken = await findRefreshTokenByUserId(user.id);
  if (oldToken == -1) {
    payload.refreshTokenId = await createRefreshToken(tokens.refresh, user.id);
  } else {
    deleteRefreshToken(oldToken.token);
    payload.refreshTokenId = await createRefreshToken(tokens.refresh, user.id);
  }
  // 🪙 엑세스 토큰 생성
  tokens.access = generateAccessToken(payload);
  // ⬆️ 토큰과 유저정보 페이로드를 반환합니다.
  const result = {
    tokens,
    payload,
  };
  return responseFromLogin(result);
};

/**
 * **[Auth]**
 * **\<🛠️ Service\>**
 * ***refresh***
 * '리프레시 토큰 갱신' 기능의 서비스 레이어 입니다. 새로운 리프레시 토큰을 발급합니다.
 * @param {Object} cookies
 * @returns {Object}
 */
export const refresh = async (cookies) => {
  // 리프레시 토큰을 검증후 페이로드를 가져옵니다.
  const payload = verifyRefreshToken(cookies.refreshToken);
  // 리프레사 토큰이 활성화 되어있는지 검증합니다.
  const activeToken = await findRefreshToken(cookies.refreshToken);
  // 토큰 검증 실패시 에러를 반환합니다.
  if (!payload || activeToken === -1) {
    throw new InvalidTokenError("유효하지 않은 인증 토큰입니다.");
  }
  // 해당 토큰의 유저정보가 유효한지 검증합니다.
  const user = await findAccountById(payload.id);
  // 유저가 존재하지 않는 경우 에러를 반환합니다.
  if (!user) {
    throw new UserNotFoundError("존재하지 않는 사용자입니다.");
  }
  const newPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    nickname: user.nickname,
    isCompleted: user.isCompleted,
  };
  const tokens = {
    refresh: generateRefreshToken(newPayload),
  };
  newPayload.refreshTokenId = activeToken.id;
  tokens.access = generateAccessToken(newPayload);

  if ((await updateRefreshToken(cookies.refreshToken, tokens.refresh)) === -1)
    throw new InvalidTokenError("유효하지 않은 인증 토큰입니다.");
  return responseFromRefresh({ tokens, newPayload });
};
/**
 * **[Auth]**
 * **\<🛠️ Service\>**
 * ***logout***
 * '로그아웃' 기능의 서비스 레이어 입니다. 리프레시 토큰을 삭제합니다.
 * @param {Object} cookies
 * @returns {Object}
 */
export const logout = async (cookies) => {
  const refreshToken = cookies.refreshToken;
  if (!refreshToken) {
    throw new InvalidTokenError("유효하지 않은 인증 토큰입니다.");
  }
  await deleteRefreshToken(refreshToken);
  return responseFromLogout(null);
};
/**
 * **[Auth]**
 * **\<🛠️ Service\>**
 * ***detectDuplicateLogin***
 * JWT 미들웨어에서 사용하는 함수입니다. 사용자가 이미 로그인 중인지 확인합니다.
 * @param {Object} payload
 * @returns {InvalidTokenError|boolean}
 */
export const detectDuplicateLogin = async (payload) => {
  const refreshToken = await findRefreshTokenByUserId(payload.id);
  if (refreshToken === -1 || refreshToken.id !== payload.refreshTokenId) {
    return new InvalidTokenError("유효하지 않은 인증 토큰입니다.");
  }
  return true;
};
/**
 * **[Auth]**
 * **\<🛠️ Service\>**
 * ***setProfile***
 * '프로필 설정' 기능의 서비스 레이어 입니다. 사용자 정보를 업데이트합니다.
 * @param {Object} data
 * @returns {Object}
 */
export const setProfile = async (data) => {
  const user = await findAccountById(data.payload.id);
  const { payload, ...restBody } = data;
  // 존재하는 유저인지 검사
  if (!user) {
    throw new UserNotFoundError("존재하지 않는 사용자입니다.", restBody);
  }
  const updatedUser = await updateProfile(data);
  return responseFromProfile(updatedUser);
};
/**
 * **[Auth]**
 * **\<🛠️ Service\>**
 * ***cleanExpiredRefreshTokens***
 * '만료된 리프레시 토큰 삭제 스케줄러' 기능 서비스 레이어 입니다. 만료된 리프레시 토큰을 삭제합니다.
 */
export const cleanExpiredRefreshTokens = async () => {
  await deleteExpiredRefreshTokens();
};
/**
 * **[Auth]**
 * **\<🛠️ Service\>**
 * ***cleanUncompletedUsers***
 * '가입 미 완료 사용자 삭제 스케줄러' 기능 서비스 레이어 입니다. 가입이 완료되지 않은체 하루가 지난 사용자를 삭제합니다.
 */
export const cleanUncompletedUsers = async () => {
  await deleteUncompletedUsers();
};
/**
 * **[Auth]**
 * **\<🛠️ Service\>**
 * ***validateUserIsExist***
 * 다른 도메인에서 유저가 존재하는지 여부를 확인하기 위한 함수 입니다.
 */
export const validateUserIsExist = async (userId) => {
  const user = await findAccountById(userId);
  return user != -1;
};
