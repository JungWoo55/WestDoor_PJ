
import React, { createContext, ReactNode, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { Book, UserProfile, LibraryBook, LibraryBookWithDetails } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMySurvey } from '@/api/survey';
import { getLibrary, addBookToLibrary, removeBookFromLibrary, markBookAsRead, decrementBookReadCount } from '@/api/library';
import { getBookByISBN } from '@/api/googleBooks';

// 컨텍스트 타입 정의
interface BookContextType {
  readBooks: LibraryBookWithDetails[]; // 기존 readBooks (isRead === true)
  recomBooks: LibraryBookWithDetails[]; // 기존 recomBooks (isRecom === true)
  countedBooks: LibraryBookWithDetails[]; // count >= 1 인 책
  savedBooks: LibraryBookWithDetails[]; // isRead === true 인 책 (readBooks와 동일)
  allLibraryBooksCombined: LibraryBookWithDetails[]; // 모든 라이브러리 책 (중복 제거)
  readBookIds: string[];
  recomBookIds: string[];
  addToLibrary: (book: Book, type: 'isRead' | 'isRecom') => Promise<void>;
  removeFromLibrary: (book: Book, type: 'isRead' | 'isRecom') => Promise<void>;
  markAsRead: (book: Book) => Promise<void>;
  decrementReadCount: (book: Book) => Promise<void>;
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
  const [readBooks, setReadBooks] = useState<LibraryBookWithDetails[]>([]);
  const [recomBooks, setRecomBooks] = useState<LibraryBookWithDetails[]>([]);
  const [finishedBooks, setFinishedBooks] = useState<LibraryBookWithDetails[]>([]); // 완독한 책 목록 추가
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
    return null; // Fallback to null if no ISBN is found
  };

  const fetchBooksFromLibrary = useCallback(async (list: 'isRead' | 'isRecom' | 'isFinish') => {
    try {
      const response = await getLibrary(list);
      const libraryBooks: LibraryBook[] = response.success.books;
      
      const CHUNK_SIZE = 5;
      let allDetailedBooks: LibraryBookWithDetails[] = [];

      for (let i = 0; i < libraryBooks.length; i += CHUNK_SIZE) {
        const chunk = libraryBooks.slice(i, i + CHUNK_SIZE);
        const chunkDetailedBooks: LibraryBookWithDetails[] = await Promise.all(
          chunk.map(async (libBook: LibraryBook) => {
            const book = await getBookByISBN(libBook.isbn);
            if (book) {
              return {
                ...book,
                count: libBook.count,
                isRead: libBook.isRead,
                isRecom: libBook.isRecom,
              };
            }
            return null;
          })
        );
        allDetailedBooks = allDetailedBooks.concat(chunkDetailedBooks.filter(Boolean) as LibraryBookWithDetails[]);
      }

      return allDetailedBooks;
    } catch (error) {
      console.error(`Error fetching ${list} books:`, error);
      return [];
    }
  }, []);

  const loadLibraryData = useCallback(async () => {
    if (!userProfile) return;
    setIsLoading(true);
    const [read, recom, finished] = await Promise.all([
      fetchBooksFromLibrary('isRead'),
      fetchBooksFromLibrary('isRecom'),
      fetchBooksFromLibrary('isFinish'), // 'isFinish' API 호출 추가
    ]);
    setReadBooks(read);
    setRecomBooks(recom);
    setFinishedBooks(finished); // 완독한 책 상태 업데이트
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
    setFinishedBooks([]);
  }, []);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const addToLibrary = async (book: Book, type: 'isRead' | 'isRecom') => {
    const isbn = getISBN(book);
    if (!isbn) {
      Alert.alert('오류', '이 책은 유효한 ISBN 정보가 없어 서재에 추가할 수 없습니다.');
      return;
    }
    try {
      // isRead 또는 isRecom 값만 true로 설정하고 다른 하나는 false로 설정
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
      Alert.alert('오류', '이 책은 유효한 ISBN 정보가 없어 서재에서 제거할 수 없습니다.');
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

  const markAsRead = async (book: Book) => {
    const isbn = getISBN(book);
    if (!isbn) {
      Alert.alert('오류', '이 책은 유효한 ISBN 정보가 없어 읽음 처리할 수 없습니다.');
      return;
    }
    try {
      await markBookAsRead(isbn);
      Alert.alert(`'${book.volumeInfo.title}'을(를) 읽음 처리했습니다.`);
      await loadLibraryData(); // 목록 새로고침
    } catch (error) {
      Alert.alert('오류', '책을 읽음 처리하는 데 실패했습니다.');
    }
  };

  const decrementReadCount = async (book: Book) => {
    const isbn = getISBN(book);
    if (!isbn) {
      Alert.alert('오류', '이 책은 유효한 ISBN 정보가 없어 실행할 수 없습니다.');
      return;
    }
    try {
      await decrementBookReadCount(isbn);
      Alert.alert('읽은 기록을 하나 제거했습니다.');
      await loadLibraryData(); // 목록 새로고침
    } catch (error) {
      Alert.alert('오류', '기록을 제거하는 데 실패했습니다.');
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

  // 모든 라이브러리 책을 합치고 중복 제거
  const allLibraryBooksCombined = useMemo(() => {
    const combined = [...readBooks, ...recomBooks, ...finishedBooks]; // finishedBooks 추가
    const uniqueBooks = new Map<string, LibraryBookWithDetails>();
    combined.forEach(book => {
      // book.id는 Google Books ID이므로, 이를 기준으로 중복 제거
      if (!uniqueBooks.has(book.id)) {
        uniqueBooks.set(book.id, book);
      } else {
        // 이미 책이 존재할 경우, 최신 정보로 업데이트 (예: isRead, isRecom 상태)
        const existingBook = uniqueBooks.get(book.id)!;
        uniqueBooks.set(book.id, { ...existingBook, ...book });
      }
    });
    return Array.from(uniqueBooks.values());
  }, [readBooks, recomBooks, finishedBooks]); // 의존성 배열에 finishedBooks 추가

  // 요구사항에 따른 파생 목록들
  const countedBooks = useMemo(() => {
    return allLibraryBooksCombined.filter(book => book.count && book.count >= 1);
  }, [allLibraryBooksCombined]);

  const savedBooks = useMemo(() => {
    return allLibraryBooksCombined.filter(book => book.isRead === true);
  }, [allLibraryBooksCombined]);

  const recommendedBooks = useMemo(() => {
    return allLibraryBooksCombined.filter(book => book.isRecom === true);
  }, [allLibraryBooksCombined]);

  const readBookIds = readBooks.map((book) => book.id);
  const recomBookIds = recomBooks.map((book) => book.id);

  return (
    <BookContext.Provider value={{ 
      readBooks,
      recomBooks,
      countedBooks,
      savedBooks,
      recommendedBooks,
      allLibraryBooksCombined,
      readBookIds,
      recomBookIds,
      addToLibrary, 
      removeFromLibrary, 
      markAsRead,
      decrementReadCount,
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
