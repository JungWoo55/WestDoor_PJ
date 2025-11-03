
import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Book } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 프로필 정보 타입 정의
export interface UserProfile {
  id: number;
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

// 프로바이더 컴포넌트 생성
export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserProfile({
          bio: '',
          favoriteGenres: [],
          readingGoal: 0,
          ...parsedUser,
        });
      }
    };
    loadUserProfile();
  }, []);

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

  const updateUserProfile = async (profileUpdates: Partial<UserProfile>) => {
    setUserProfile(prevProfile => {
      const newUserProfile = { ...(prevProfile || {}), ...profileUpdates } as UserProfile;
      AsyncStorage.setItem('user', JSON.stringify(newUserProfile))
        .catch(e => console.error("Failed to save user profile to AsyncStorage", e));
      return newUserProfile;
    });
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
