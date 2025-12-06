import { callGradioAPI, validateGradioResponse } from "./gradio.service.js";
import { responseFromChat } from "../dto/response/chat.response.dto.js";

/**
 * **[Chat]**
 * **<🛠️ Service>**
 * ***sendMessage***
 * 사용자 메시지를 받아 Gradio AI 모델에 전송하고, 응답과 책 리스트를 반환합니다.
 * @param {number} userId - 사용자 ID
 * @param {string} question - 사용자 질문
 * @returns {Object} { answer, books }
 */
export const sendMessage = async (userId, question) => {
  try {
    // 1. 입력값 검증
    if (!question || question.trim().length === 0) {
      const error = new Error("질문을 입력해주세요.");
      error.statusCode = 400;
      error.errorCode = "INVALID_QUESTION";
      throw error;
    }

    // 2. Gradio API 호출
    const gradioResponse = await callGradioAPI(question.trim());

    // 3. 응답 검증
    if (!validateGradioResponse(gradioResponse)) {
      const error = new Error("AI 서비스 응답이 올바르지 않습니다.");
      error.statusCode = 500;
      error.errorCode = "INVALID_GRADIO_RESPONSE";
      throw error;
    }

    // 4. 응답 포매팅 (DB 저장 없음)
    return responseFromChat(question, gradioResponse);
  } catch (error) {
    console.error("메시지 전송 서비스 에러:", error);
    throw error;
  }
};
