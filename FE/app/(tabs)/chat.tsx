
import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { ChatbotRecommendation } from '../../components/ChatbotRecommendation';
import { BookDetailModal } from '../../components/BookDetailModal';
import { useBooks } from '../../contexts/BookContext';
import { Book } from '../../types';

export default function ChatScreen() {
  const { addToLibrary, removeFromLibrary, readBookIds, recomBookIds } = useBooks();
  const allSavedIds = [...(readBookIds || []), ...(recomBookIds || [])];
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleBookPress = useCallback((book: Book) => {
    setSelectedBook(book);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedBook(null);
  }, []);

  const handleToggleSave = (book: Book) => {
    const isSaved = allSavedIds.includes(book.id);
    if (isSaved) {
      const isRead = readBookIds?.includes(book.id);
      removeFromLibrary(book, isRead ? 'isRead' : 'isRecom');
    } else {
      addToLibrary(book, 'isRecom');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ChatbotRecommendation onBookPress={handleBookPress} />
      <BookDetailModal
        visible={!!selectedBook}
        onClose={handleCloseModal}
        book={selectedBook}
        onToggleSave={handleToggleSave}
        isSaved={selectedBook ? allSavedIds.includes(selectedBook.id) : false}
      />
    </View>
  );
}
