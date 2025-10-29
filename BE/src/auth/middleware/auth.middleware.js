import { verifyAccessToken } from "../../utils/jwt.js";
import { InvalidTokenError, LoginRequiredError } from "../../error.js";
import { detectDuplicateLogin } from "../service/auth.service.js";
/**
 * **[Auth]**
 * **\<🔌 Middleware\>**
 * ***authenticateAccessToken***
 * 엑세스 토큰 검증을 위한 미들웨어입니다. 로그인이 필수인 기능에 활용 가능합니다.
 * @param {Object} req - [요청 객체]
 * @param {Object} res - [응답 객체]
 * @param {Function} next - [다음 미들웨어 함수]
 */
export const authenticateAccessToken = async (req, res, next) => {
  // 쿠키로 부터 액세스 토큰만 추출
  const { accessToken, refreshToken } = req.cookies;
  
  // 엑세스 토큰, 리프레시 토큰이 모두 존재하지 않는 경우 비로그인 상태로 간주하고 에러 throw
  if (!accessToken && !refreshToken)
    return next(new LoginRequiredError("로그인이 필요합니다."));
  // 액세스 토큰이 존재하지 않은 경우 에러를 반환합니다.
  if (!accessToken)
    return next(new InvalidTokenError("유효하지 않은 인증 토큰 입니다."));
  // 토큰을 검증하고 페이로드를 가져옵니다.
  const payload = verifyAccessToken(accessToken);
  // 토큰이 유효하지 않은 경우 에러를 반환합니다.
  if (!payload)
    return next(new InvalidTokenError("유효하지 않은 인증 토큰 입니다."));
  // 중복 로그인을 감지합니다.
  const result = await detectDuplicateLogin(payload);
  if (result !== true) {
    return next(result);
  }
  // 요청 객체에 디코딩한 페이로드를 첨부하여 다음 미들웨어로 전달합니다.
  req.payload = payload;
  req.user = { id: payload.id }; // 민호 제작
  return next();
};

/**
 * **[Auth]**
 * **\<🔌 Middleware\>**
 * ***identifyAccessToken***
 * 엑세스 토큰 검증을 위한 미들웨어입니다. 선택적 로그인이 필요한 기능에 활용 가능합니다.
 * @param {Object} req - [요청 객체]
 * @param {Object} res - [응답 객체]
 * @param {Function} next - [다음 미들웨어 함수]
 */
export const identifyAccessToken = async (req, res, next) => {
  // 쿠키로 부터 액세스 토큰만 추출
  const { accessToken, refreshToken } = req.cookies;
  // 토큰이 하나라도 존재하지 않으면 페이로드를 null값으로 반환
  if (!accessToken || !refreshToken) {
    req.payload = null;
    return next();
  }
  // 토큰을 검증하고 페이로드를 가져옵니다.
  const payload = verifyAccessToken(accessToken);
  // 토큰이 유효하지 않은 경우 페이로드를 null값으로 반환
  if (!payload) {
    req.payload = null;
    return next();
  }
  // 중복 로그인을 감지합니다.
  const result = await detectDuplicateLogin(payload);
  if (result !== true) {
    return next(result);
  }
  // 요청 객체에 디코딩한 페이로드를 첨부하여 다음 미들웨어로 전달합니다.
  req.payload = payload;
  req.user = { id: payload.id }; // 민호 제작
  return next();
};

/**
 * **[Auth]**
 * **\<🔌 Middleware\>**
 * ***verifyUserIsActive***
 * 계정의 활성화 여부를 검사하는 미들웨어 입니다.
 * @param {Object} req - [요청 객체]
 * @param {Object} res - [응답 객체]
 * @param {Function} next - [다음 미들웨어 함수]
 */
export const verifyUserIsActive = (req, res, next) => {
  // ✅ 유효성 검사 (유저 권한)
  if (!req.payload.isCompleted) {
    next(new InvalidTokenError("유효하지 않은 인증 토큰입니다.", req.body));
  }
  next();
};
