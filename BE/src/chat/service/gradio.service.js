import { Client } from "@gradio/client";

/**
 * @description Gradio 클라이언트를 통해 AI 모델과 통신하는 서비스
 */

let gradioClient = null;

/**
 * @description Gradio 클라이언트 초기화
 */
const initGradioClient = async () => {
  if (!gradioClient) {
    const gradioUrl = process.env.GRADIO_URL ||"https://0b15b9752d21735785.gradio.live/";
    gradioClient = await Client.connect(gradioUrl);
  }
  return gradioClient;
};

/**
 * @description Gradio API 호출
 * @param {string} question - 사용자 질문
 * @returns {Promise<Object>} { answer, books }
 */
export const callGradioAPI = async (question) => { 
  try {
    const client = await initGradioClient();

    // Gradio /predict 엔드포인트 호출
    const result = await client.predict("/predict", {
      question: question,
    });

    // Gradio 응답 형식에 따라 파싱
    // result.data[0] = 답변, result.data[1] = 책 리스트 (ISBN)
    const answer = result.data[0];
    
    // 책 리스트에서 [ 와 ] 를 제거하고 파싱
    let books = [];
    if (result.data[1]) {
      const booksStr = result.data[1]
        .replace(/\[/g, "")  // [ 제거
        .replace(/\]/g, "")  // ] 제거
        .trim();
      
      if (booksStr) {
        books = booksStr.split(",").map((isbn) => isbn.trim()).filter((isbn) => isbn);
      }
    }

    return {
      answer,
      books,
    };
  } catch (error) {
    console.error("Gradio API 호출 에러:", error);
    throw new Error(`AI 서비스 연결 실패: ${error.message}`);
  }
};

/**
 * @description Gradio 응답 검증
 * @param {Object} gradioResponse - Gradio 응답
 * @returns {boolean} 유효 여부
 */
export const validateGradioResponse = (gradioResponse) => {
  if (!gradioResponse || typeof gradioResponse !== "object") {
    return false;
  }

  if (!gradioResponse.answer || typeof gradioResponse.answer !== "string") {
    return false;
  }

  if (!Array.isArray(gradioResponse.books)) {
    return false;
  }

  return true;
};
