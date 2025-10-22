
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Alert } from 'react-native';
import { Book } from '../types';

// 컨텍스트 타입 정의: id 관련 타입을 string으로 변경
interface BookContextType {
  savedBooks: Book[];
  savedBookIds: string[];
  addToLibrary: (book: Book) => void;
  removeFromLibrary: (bookId: string) => void;
}

// 컨텍스트 생성
const BookContext = createContext<BookContextType | undefined>(undefined);

// 프로바이더 컴포넌트 생성
export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);

  const addToLibrary = (book: Book) => {
    setSavedBooks((prev) => {
      // book.id가 string이므로, find 로직은 그대로 작동
      const exists = prev.find((b) => b.id === book.id);
      if (exists) {
        // 책이 이미 있으면 제거 (토글 기능)
        Alert.alert(`'${book.volumeInfo.title}'을(를) 서재에서 제거했습니다.`);
        return prev.filter((b) => b.id !== book.id);
      } else {
        Alert.alert(`'${book.volumeInfo.title}'을(를) 서재에 추가했습니다!`);
        return [...prev, book];
      }
    });
  };

  // removeFromLibrary의 파라미터 타입을 string으로 변경
  const removeFromLibrary = (bookId: string) => {
    setSavedBooks((prev) => prev.filter((book) => book.id !== bookId));
  };

  // book.id가 string이므로, map의 결과는 string[]이 됨
  const savedBookIds = savedBooks.map((book) => book.id);

  return (
    <BookContext.Provider value={{ savedBooks, savedBookIds, addToLibrary, removeFromLibrary }}>
      {children}
    </BookContext.Provider>
  );
};

// 커스텀 훅
export const useBooks = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};
