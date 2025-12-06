/**
 * @description 채팅 응답 DTO 변환
 */

/**
 * @description 메시지 전송 응답 포매팅
 * @param {string} question - 사용자 질문
 * @param {Object} gradioResponse - Gradio 응답
 * @returns {Object} 포매팅된 응답
 */
export const responseFromChat = (question, gradioResponse) => {
  return {
    question: question,
    answer: gradioResponse.answer,
    books: gradioResponse.books,
  };
};
