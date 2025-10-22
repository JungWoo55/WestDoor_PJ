
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Alert } from 'react-native';
import { Book } from '../types';

// 프로필 정보 타입 정의
export interface UserProfile {
  email: string;
  nickname: string;
  bio: string;
  favoriteGenres: string[];
  readingGoal: number;
}

// 컨텍스트 타입 정의
interface BookContextType {
  savedBooks: Book[];
  savedBookIds: string[];
  addToLibrary: (book: Book) => void;
  removeFromLibrary: (bookId: string) => void;
  userProfile: UserProfile | null;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

// 컨텍스트 생성
const BookContext = createContext<BookContextType | undefined>(undefined);

// 가상의 초기 프로필 정보
const initialProfile: UserProfile = {
  email: 'bookworm@example.com',
  nickname: '독서광',
  bio: '책 읽는 것을 좋아합니다.',
  favoriteGenres: ['소설', '자기계발'],
  readingGoal: 50,
};

// 프로바이더 컴포넌트 생성
export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initialProfile);

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

  const removeFromLibrary = (bookId: string) => {
    setSavedBooks((prev) => prev.filter((book) => book.id !== bookId));
  };

  const updateUserProfile = (profileUpdates: Partial<UserProfile>) => {
    setUserProfile(prev => prev ? { ...prev, ...profileUpdates } : null);
  };

  const savedBookIds = savedBooks.map((book) => book.id);

  return (
    <BookContext.Provider value={{ savedBooks, savedBookIds, addToLibrary, removeFromLibrary, userProfile, updateUserProfile }}>
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
