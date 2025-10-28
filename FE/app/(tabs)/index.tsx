
import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { BookRecommendation } from '../../components/BookRecommendation';
import { BookDetailModal } from '../../components/BookDetailModal';
import { useBooks } from '../../contexts/BookContext';
import { Book } from '../../types';

export default function RecommendationScreen() {
  const { savedBookIds, addToLibrary } = useBooks();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleBookPress = useCallback((book: Book) => {
    setSelectedBook(book);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedBook(null);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <BookRecommendation 
        savedBooks={savedBookIds} 
        onAddToLibrary={addToLibrary} 
        onBookPress={handleBookPress} 
      />
      <BookDetailModal 
        visible={!!selectedBook}
        onClose={handleCloseModal}
        book={selectedBook}
        onAddToLibrary={addToLibrary}
        isSaved={selectedBook ? savedBookIds.includes(selectedBook.id) : false}
      />
    </View>
  );
}
