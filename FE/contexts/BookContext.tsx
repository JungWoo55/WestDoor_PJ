
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Alert } from 'react-native';

// Define the Book type globally for the context
interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  category: string;
  description?: string;
}

// Define the context shape
interface BookContextType {
  savedBooks: Book[];
  savedBookIds: number[];
  addToLibrary: (book: Book) => void;
  removeFromLibrary: (bookId: number) => void;
}

// Create the context
const BookContext = createContext<BookContextType | undefined>(undefined);

// Create the provider component
export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);

  const addToLibrary = (book: Book) => {
    setSavedBooks((prev) => {
      const exists = prev.find((b) => b.id === book.id);
      if (exists) {
        Alert.alert(`'${book.title}' removed from your library.`);
        return prev.filter((b) => b.id !== book.id);
      } else {
        Alert.alert(`'${book.title}' added to your library!`);
        return [...prev, book];
      }
    });
  };

  const removeFromLibrary = (bookId: number) => {
    setSavedBooks((prev) => prev.filter((book) => book.id !== bookId));
  };

  const savedBookIds = savedBooks.map((book) => book.id);

  return (
    <BookContext.Provider value={{ savedBooks, savedBookIds, addToLibrary, removeFromLibrary }}>
      {children}
    </BookContext.Provider>
  );
};

// Create a custom hook for easy context access
export const useBooks = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};
