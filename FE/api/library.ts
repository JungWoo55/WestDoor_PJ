
import api from './index';

/**
 * 내 서재 목록을 가져옵니다.
 * @param page 'isRead' 또는 'isRecom'
 */
export const getLibrary = async (page: 'isRead' | 'isRecom') => {
  try {
    const response = await api.get(`/library?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching library:', error);
    throw error;
  }
};

/**
 * 서재에 책을 추가합니다.
 * @param isbn ISBN
 * @param isRead 읽음 여부
 * @param isRecom 추천 여부
 */
export const addBookToLibrary = async (isbn: string, isRead: boolean, isRecom: boolean) => {
  try {
    const response = await api.post('/library', { isbn, isRead, isRecom });
    return response.data;
  } catch (error) {
    console.error('Error adding book to library:', error);
    throw error;
  }
};

/**
 * 서재에서 책을 제거합니다.
 * @param isbn ISBN
 * @param page 'isRead' 또는 'isRecom'
 */
export const removeBookFromLibrary = async (isbn: string, page: 'isRead' | 'isRecom') => {
    try {
      const response = await api.delete(`/library/${isbn}/${page}`);
      return response.data;
    } catch (error) {
      console.error('Error removing book from library:', error);
      throw error;
    }
};

/**
 * 책의 완독 횟수를 1 증가시킵니다.
 * @param isbn ISBN
 */
export const markBookAsRead = async (isbn: string) => {
    try {
      const response = await api.patch('/library', { isbn });
      return response.data;
    } catch (error) {
      console.error('Error marking book as read:', error);
      throw error;
    }
};
