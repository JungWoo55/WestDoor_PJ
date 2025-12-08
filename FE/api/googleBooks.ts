
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

  const MAX_RETRIES = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${API_KEY}`);
      if (response.data.items && response.data.items.length > 0) {
        return response.data.items[0]; // 성공 시 즉시 반환
      }
      return null; // 책을 찾지 못한 경우, 재시도 없이 null 반환
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt}: Error fetching book data for ISBN ${isbn}:`, error.message);
      
      if (attempt < MAX_RETRIES) {
        // 다음 재시도 전 대기 (1초, 2초)
        const delay = attempt * 1000;
        console.log(`Waiting ${delay}ms before next retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // 모든 재시도 실패 시 최종 에러 throw
  console.error(`All ${MAX_RETRIES} attempts failed for ISBN ${isbn}.`);
  throw lastError;
};

