//오류 응답 개선

/**
 * **\<💥 Error\>**
 * ***DuplicateUserEmailError***
 * 중복된 이메일이 입력되었을때 발생하는 에러
 */
export class DuplicateUserEmailError extends Error {
  errorCode = "U001";
  statusCode = 409;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
/**
 * **\<💥 Error\>**
 * ***DuplicateUserPhoneError***
 * 중복된 전화번호가 입력되었을때 발생하는 에러
 */
export class DuplicateUserPhoneError extends Error {
  errorCode = "U002";
  statusCode = 409;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
/**
 * **\<💥 Error\>**
 * ***LoginRequiredError***
 * 로그인이 필요한 요청에 로그인하지 않았을때 발생하는 에러
 */
export class LoginRequiredError extends Error {
  errorCode = "U003";
  statusCode = 401;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

/**
 * **\<💥 Error\>**
 * ***InvalidInputValueError***
 * 올바르지 않은 값이 입력되었을때 발생하는 에러
 */
export class InvalidInputValueError extends Error {
  errorCode = "I001";
  statusCode = 400;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

/**
 * **\<💥 Error\>**
 * ***UserNotFoundError***
 * 존재하지 않는 유저에 대한 요청이 발생했을때 발생하는 에러
 */
export class UserNotFoundError extends Error {
  errorCode = "U001";
  statusCode = 404;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

/**
 * **\<💥 Error\>**
 * ***InvalidTokenError***
 * 유효하지 않은 토큰으로 인한 요청이 발생했을때 발생하는 에러
 */
export class InvalidTokenError extends Error {
  errorCode = "I003";
  statusCode = 401;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}