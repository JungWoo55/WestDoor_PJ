import api from './index';

interface ChatResponse {
  answer: string;
  books: string[];
}

/**
 * 백엔드 챗봇 API로 메시지를 전송합니다.
 * @param question 사용자의 질문
 * @returns 챗봇의 답변과 추천 도서 ISBN 배열
 */
export const sendChatMessage = async (question: string) => {
  const response = await api.post<ChatResponse>('/chat/', { question });
  return response.data;
};
