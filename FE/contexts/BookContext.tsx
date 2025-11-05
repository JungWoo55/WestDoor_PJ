
import React, { createContext, ReactNode, useContext, useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { Book, UserProfile } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMySurvey } from '@/api/survey';


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

  const loadUserProfile = useCallback(async () => {
    const storedUser = await AsyncStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const userData = parsedUser.user || parsedUser;

        if (userData.isCompleted) {
          const surveyResponse = await getMySurvey();
          const surveyData = surveyResponse.success;
          const completeProfile = {
            ...userData,
            favoriteGenres: surveyData.category || [],
            readingAmount: surveyData.amount,
            readingStyle: surveyData.style,
            readingGoal: userData.goal || 0,
          };
          setUserProfile(completeProfile);
          await AsyncStorage.setItem('user', JSON.stringify(completeProfile));
        } else {
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
        }
      } catch (error) {
        console.error('Failed to load or process user profile:', error);
        setUserProfile(null)
      }
    } else {
      setUserProfile(null);
    }
  }, []);

  const clearUserProfile = useCallback(() => {
    setUserProfile(null);
    setSavedBooks([]);
  }, []);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

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

  const removeFromLibrary = useCallback((bookId: string) => {
    setSavedBooks((prev) => prev.filter((book) => book.id !== bookId));
  }, []);

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
