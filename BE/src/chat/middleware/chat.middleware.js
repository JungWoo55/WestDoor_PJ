/**
 * @description 채팅 관련 미들웨어
 */

/**
 * @description 질문 길이 제한 미들웨어 (선택사항)
 * @param {number} maxLength - 최대 길이 (기본값: 1000)
 */
export const limitQuestionLength = (maxLength = 1000) => {
  return (req, res, next) => {
    const { question } = req.body;

    if (question && question.length > maxLength) {
      return res.status(400).json({
        statusCode: 400,
        errorCode: "QUESTION_TOO_LONG",
        reason: `질문은 ${maxLength}자 이하여야 합니다.`,
      });
    }

    next();
  };
};

/**
 * @description 채팅 요청 레이트 제한 미들웨어 (선택사항)
 * 실제 구현 시에는 redis 등을 사용하여 구현할 수 있습니다.
 */
export const chatRateLimit = (req, res, next) => {
  // TODO: Redis를 사용한 레이트 제한 구현
  next();
};
