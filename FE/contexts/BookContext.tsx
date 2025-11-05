
import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Book, UserProfile } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';


// 컨텍스트 타입 정의
interface BookContextType {
  savedBooks: Book[];
  savedBookIds: string[];
  addToLibrary: (book: Book) => void;
  removeFromLibrary: (bookId: string) => void;
  userProfile: UserProfile | null;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  reloadUserProfile: () => Promise<void>;
  clearUserProfile: () => void;
}

// 컨텍스트 생성
const BookContext = createContext<BookContextType | undefined>(undefined);

// 프로바이더 컴포넌트 생성
export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const loadUserProfile = async () => {
    const storedUser = await AsyncStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // 백엔드 응답 구조에 맞게 user 객체에서 데이터 추출 (중첩된 경우 대비)
        const userData = parsedUser.user || parsedUser;
          setUserProfile({
            id: userData.id || 0,
            email: userData.email || '',
            nickname: userData.nickname || userData.name || '',
            name: userData.name,
            bio: userData.bio || '',
            favoriteGenres: userData.favoriteGenres || [],
            readingGoal: userData.readingGoal || 0,
            readingAmount: userData.readingAmount || 0,
            readingStyle: userData.readingStyle || '',
          });
      } catch (error) {
        console.error('Failed to parse user profile:', error);
      }
    } else {
      // 저장된 사용자 정보가 없으면 프로필 초기화
      setUserProfile(null);
    }
  };

  const clearUserProfile = () => {
    setUserProfile(null);
    setSavedBooks([]);
  };

  useEffect(() => {
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
    <BookContext.Provider value={{ 
      savedBooks, 
      savedBookIds, 
      addToLibrary, 
      removeFromLibrary, 
      userProfile, 
      updateUserProfile,
      reloadUserProfile: loadUserProfile,
      clearUserProfile,
    }}>
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
