/**
 * **[Auth]**
 * **\<🧺⬆️ Response DTO\>**
 * ***responseFromSignUp***
 * '회원가입' 기능의 요청 결과값을 서비스 레이어에서 컨트롤러로 반환하기 위한 DTO
 * @param {Object} data
 * @returns {Object}
 */
export const responseFromSignUp = (data) => {
  return {
    userId: data.userId,
    email: data.body.email,
  };
};
/**
 * **[Auth]**
 * **\<🧺⬆️ Response DTO\>**
 * ***responseFromLogin***
 * '로그인' 기능의 요청 결과값을 서비스 레이어에서 컨트롤러로 반환하기 위한 DTO
 * @param {Object} data
 * @returns {Object}
 */
export const responseFromLogin = (data) => {
  return {
    accessToken: data.tokens.access,
    refreshToken: data.tokens.refresh,
    user: {
      id: data.payload.id,
      email: data.payload.email,
      name: data.payload.name,
      nickname: data.payload.nickname,
      isCompleted: data.payload.isCompleted,
    },
  };
};
/**
 * **[Auth]**
 * **\<🧺⬆️ Response DTO\>**
 * ***responseFromRefresh***
 * '리프레시 토큰 갱신' 기능의 요청 결과값을 서비스 레이어에서 컨트롤러로 반환하기 위한 DTO
 * @param {Object} data
 * @returns {Object}
 */
export const responseFromRefresh = (data) => {
  return {
    accessToken: data.tokens.access,
    refreshToken: data.tokens.refresh,
    user: {
      id: data.newPayload.id,
      email: data.newPayload.email,
      name: data.newpayload.name,
      nickname: data.newPayload.nickname,
      isCompleted: data.newPayload.isCompleted,
    },
  };
};
/**
 * **[Auth]**
 * **\<🧺⬆️ Response DTO\>**
 * ***responseFromLogout***
 * '로그아웃' 기능의 요청 결과값을 서비스 레이어에서 컨트롤러로 반환하기 위한 DTO
 * @param {Object} data
 * @returns {Object}
 */
export const responseFromLogout = (data) => {
  return null;
};
/**
 * **[Auth]**
 * **\<🧺⬆️ Response DTO\>**
 * ***responseFromProfile***
 * '프로필 설정' 기능의 요청 결과값을 서비스 레이어에서 컨트롤러로 반환하기 위한 DTO
 * @param {Object} data
 * @returns {Object}
 */
export const responseFromProfile = (data) => {
  return {
    id: data.id,
    name: data.name,
    nickname: data.nickname,
  };
};
