
import React, { createContext, ReactNode, useContext, useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { Book, UserProfile, LibraryBook } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMySurvey } from '@/api/survey';
import { getLibrary, addBookToLibrary, removeBookFromLibrary } from '@/api/library';
import { getBookByISBN } from '@/api/googleBooks';

// 컨텍스트 타입 정의
interface BookContextType {
  readBooks: Book[];
  recomBooks: Book[];
  readBookIds: string[];
  recomBookIds: string[];
  addToLibrary: (book: Book, type: 'isRead' | 'isRecom') => Promise<void>;
  removeFromLibrary: (book: Book, type: 'isRead' | 'isRecom') => Promise<void>;
  userProfile: UserProfile | null;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  reloadUserProfile: () => Promise<void>;
  clearUserProfile: () => void;
  isLoading: boolean;
  login: () => void;
}

// 컨텍스트 생성
const BookContext = createContext<BookContextType | undefined>(undefined);

// 프로바이더 컴포넌트 생성
export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [readBooks, setReadBooks] = useState<Book[]>([]);
  const [recomBooks, setRecomBooks] = useState<Book[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);

  const getISBN = (book: Book): string | null => {
    if (!book || !book.volumeInfo) {
      return null;
    }
    const industryIdentifiers = book.volumeInfo.industryIdentifiers;
    if (industryIdentifiers) {
      const isbn13 = industryIdentifiers.find(id => id.type === 'ISBN_13');
      if (isbn13) return isbn13.identifier;
      const isbn10 = industryIdentifiers.find(id => id.type === 'ISBN_10');
      if (isbn10) return isbn10.identifier;
    }
    return book.id; // Fallback to book.id if no ISBN is found
  };

  const fetchBooksFromLibrary = useCallback(async (list: 'isRead' | 'isRecom') => {
    try {
      const response = await getLibrary(list);
      const libraryBooks = response.success.books;
      const detailedBooks = await Promise.all(
        libraryBooks.map(async (libBook: LibraryBook) => {
          const book = await getBookByISBN(libBook.isbn);
          return book;
        })
      );
      // API에서 null을 반환할 수 있으므로 필터링
      return detailedBooks.filter((book): book is Book => book !== null);
    } catch (error) {
      console.error(`Error fetching ${list} books:`, error);
      return [];
    }
  }, []);

  const loadLibraryData = useCallback(async () => {
    if (!userProfile) return;
    setIsLoading(true);
    const [read, recom] = await Promise.all([
      fetchBooksFromLibrary('isRead'),
      fetchBooksFromLibrary('isRecom'),
    ]);
    setReadBooks(read);
    setRecomBooks(recom);
    setIsLoading(false);
  }, [userProfile, fetchBooksFromLibrary]);

  useEffect(() => {
    if (isAuthenticated) {
      loadLibraryData();
    }
  }, [isAuthenticated, loadLibraryData]);

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
    setReadBooks([]);
    setRecomBooks([]);
  }, []);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const addToLibrary = async (book: Book, type: 'isRead' | 'isRecom') => {
    const isbn = getISBN(book);
    if (!isbn) {
      Alert.alert('오류', '책의 ISBN 정보를 찾을 수 없어 추가할 수 없습니다.');
      return;
    }
    try {
      await addBookToLibrary(isbn, type === 'isRead', type === 'isRecom');
      Alert.alert(`'${book.volumeInfo.title}'을(를) 서재에 추가했습니다!`);
      await loadLibraryData(); // 목록 새로고침
    } catch (error) {
      Alert.alert('오류', '책을 추가하는 데 실패했습니다.');
    }
  };

  const removeFromLibrary = async (book: Book, type: 'isRead' | 'isRecom') => {
    const isbn = getISBN(book);
    if (!isbn) {
      Alert.alert('오류', '책의 ISBN 정보를 찾을 수 없어 제거할 수 없습니다.');
      return;
    }
    try {
      await removeBookFromLibrary(isbn, type);
      Alert.alert('책을 서재에서 제거했습니다.');
      await loadLibraryData(); // 목록 새로고침
    } catch (error) {
      Alert.alert('오류', '책을 제거하는 데 실패했습니다.');
    }
  };

  const updateUserProfile = async (profileUpdates: Partial<UserProfile>) => {
    setUserProfile(prevProfile => {
      const newUserProfile = { ...(prevProfile || {}), ...profileUpdates } as UserProfile;
      AsyncStorage.setItem('user', JSON.stringify(newUserProfile))
        .catch(e => console.error("Failed to save user profile to AsyncStorage", e));
      return newUserProfile;
    });
  };

  const readBookIds = readBooks.map((book) => book.id);
  const recomBookIds = recomBooks.map((book) => book.id);

  return (
    <BookContext.Provider value={{ 
      readBooks,
      recomBooks,
      readBookIds,
      recomBookIds,
      addToLibrary, 
      removeFromLibrary, 
      userProfile, 
      updateUserProfile,
      reloadUserProfile: loadUserProfile,
      clearUserProfile,
      isLoading,
      login,
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
