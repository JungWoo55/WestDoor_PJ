/**
 * @description 채팅 요청 DTO 변환
 */

/**
 * @description 메시지 전송 요청 검증 및 변환
 * @param {Object} body - 요청 본문
 * @returns {Object} 검증된 데이터
 */
export const bodyToChat = (body) => {
  const { question } = body;

  // 질문 필수 검증
  if (!question || typeof question !== "string") {
    const error = new Error("질문을 입력해주세요.");
    error.statusCode = 400;
    error.errorCode = "INVALID_QUESTION";
    throw error;
  }

  // 질문 길이 검증 (1자 이상 1000자 이하)
  if (question.trim().length === 0 || question.trim().length > 1000) {
    const error = new Error("질문은 1자 이상 1000자 이하여야 합니다.");
    error.statusCode = 400;
    error.errorCode = "INVALID_QUESTION_LENGTH";
    throw error;
  }

  return {
    question: question.trim(),
  };
};
