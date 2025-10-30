/**
 * 컨트롤러에서 받은 req.body를 서비스 계층으로 전달하기 위해 가공
 */
export const bodyToAddBook = (body) => {
  return {
    isbn: body.isbn,
    isRead: body.isRead,
    isRecom: body.isRecom,
  };
};

/**
 * 컨트롤러에서 받은 req.body를 서비스 계층으로 전달하기 위해 가공
 */
export const bodyToReadBook = (body) => {
  return {
    isbn: body.isbn
  };
};


/**
 * 컨트롤러에서 받은 req.query를 서비스 계층으로 전달하기 위해 가공
 */
export const queryToGetLibrary = (query) => {
  return {
    page: query.page,
  };
};

/**
 * 컨트롤러에서 받은 req.params를 서비스 계층으로 전달하기 위해 가공
 */
export const paramsToBook = (params) => {
  return {
    isbn: params.isbn,
    page: params.page,
  };
};