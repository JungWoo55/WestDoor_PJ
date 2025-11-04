/**
 * **[Auth]**
 * **\<🧺⬇️ Request DTO\>**
 * ***bodyToSignUp***
 * '회원가입'기능의 요청 값을 서비스 레이어로 옮기기 위한 DTO
 * @param {Object} body
 * @returns {Object}
 */
export const bodyToSignUp = (body) => {
  return {
    name: body.name,
    email: body.email,
    password: body.password,
  };
};
/**
 * **[Auth]**
 * **\<🧺⬇️ Request DTO\>**
 * ***bodyToLogin***
 * '로그인'기능의 요청 값을 서비스 레이어로 옮기기 위한 DTO
 * @param {Object} body
 * @returns {Object}
 */
export const bodyToLogin = (body) => {
  return {
    email: body.email,
    password: body.password,
  };
};
/**
 * **[Auth]**
 * **\<🧺⬇️ Request DTO\>**
 * ***bodyToRefresh***
 * '리프레시 토큰 갱신'기능의 요청 값을 서비스 레이어로 옮기기 위한 DTO
 * @param {Object} cookies
 * @returns {Object}
 */
export const bodyToRefresh = (cookies) => {
  return {
    refreshToken: cookies.refreshToken,
  };
};
/**
 * **[Auth]**
 * **\<🧺⬇️ Request DTO\>**
 * ***bodyToLogout***
 * '로그아웃'기능의 요청 값을 서비스 레이어로 옮기기 위한 DTO
 * @param {Object} cookies
 * @returns {Object}
 */
export const bodyToLogout = (cookies) => {
  return {
    refreshToken: cookies.refreshToken,
  };
};
/**
 * **[Auth]**
 * **\<🧺⬇️ Request DTO\>**
 * ***bodyToLogout***
 * '로그아웃'기능의 요청 값을 서비스 레이어로 옮기기 위한 DTO
 * @param {Object} user
 * @returns {Object}
 */
export const bodyToResign = (user) => {
  return {
    userId: userId,
  };
};
/**
 * **[Auth]**
 * **\<🧺⬇️ Request DTO\>**
 * ***bodyToProfile***
 * '프로필 설정'기능의 요청 값을 서비스 레이어로 옮기기 위한 DTO
 * @param {Object} body
 * @param {Object} payload
 * @returns {Object}
 */
export const bodyToProfile = (body, payload) => {
  return {
    name: body.name,
    nickname: body.nickname,
    goal: parseInt(body.goal, 10),
    payload: payload,
  };
};
