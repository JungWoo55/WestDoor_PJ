import axios from 'axios';

// .env 파일에 정의된 API 키를 사용합니다.                                                                                                                       │
// Expo 프로젝트에서는 추가 설정 없이 process.env.GOOGLE_BOOKS_API_KEY로 접근할 수 있습니다.                                                                     │
const API_KEY = process.env.EXPO_PUBLIC_BOOKS_API_KEY;

export const searchBooks = async (query: string) => {
  if (!API_KEY) {
    console.error("API key is missing. Make sure it's set in your .env and app.json.");
    // 사용자에게 보여줄 에러 메시지를 반환하거나 throw 할 수 있습니다.
    throw new Error("API 키가 설정되지 않았습니다.");
  }
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`);
    return response.data.items;
  } catch (error) {
    console.error('Error fetching books:', error);
    // 실제 앱에서는 사용자에게 친화적인 에러 메시지를 보여주는 것이 좋습니다.
    throw error;
  }
};

export const getBookByISBN = async (isbn: string) => {
  if (!API_KEY) {
    console.error("API key is missing. Make sure it's set in your .env and app.json.");
    throw new Error("API 키가 설정되지 않았습니다.");
  }
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${API_KEY}`);
    if (response.data.items && response.data.items.length > 0) {
      return response.data.items[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching book data by ISBN:', error);
    throw error;
  }
};
