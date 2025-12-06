import { prisma } from "../../db.config.js";

/**
 * @description 채팅 히스토리 저장
 * @param {number} userId - 사용자 ID
 * @param {string} question - 사용자 질문
 * @param {string} response - AI 응답
 * @param {Array} books - 추천 책 ISBN 리스트
 * @returns {Object} 생성된 채팅 레코드
 */
export const saveChatHistory = async (userId, question, response, books) => {
  try {
    const chatHistory = await prisma.chatHistory.create({
      data: {
        userId,
        question,
        response,
        recommendedBooks: books,
        createdAt: new Date(),
      },
    });
    return chatHistory;
  } catch (error) {
    console.error("채팅 히스토리 저장 에러:", error);
    throw error;
  }
};

/**
 * @description 사용자별 채팅 히스토리 조회
 * @param {number} userId - 사용자 ID
 * @param {number} limit - 조회할 메시지 수
 * @param {number} offset - 시작 위치
 * @returns {Array} 채팅 히스토리 배열
 */
export const getChatHistoryByUserId = async (userId, limit = 20, offset = 0) => {
  try {
    const chatHistories = await prisma.chatHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });
    return chatHistories;
  } catch (error) {
    console.error("채팅 히스토리 조회 에러:", error);
    throw error;
  }
};

/**
 * @description 특정 채팅 조회
 * @param {number} chatId - 채팅 ID
 * @returns {Object} 채팅 정보
 */
export const getChatById = async (chatId) => {
  try {
    const chat = await prisma.chatHistory.findUnique({
      where: { id: chatId },
    });
    return chat;
  } catch (error) {
    console.error("채팅 조회 에러:", error);
    throw error;
  }
};

/**
 * @description 채팅 삭제
 * @param {number} chatId - 채팅 ID
 * @returns {Object} 삭제된 채팅
 */
export const deleteChatById = async (chatId) => {
  try {
    const deletedChat = await prisma.chatHistory.delete({
      where: { id: chatId },
    });
    return deletedChat;
  } catch (error) {
    console.error("채팅 삭제 에러:", error);
    throw error;
  }
};
