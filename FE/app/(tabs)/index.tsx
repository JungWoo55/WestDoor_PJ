
import React from 'react';
import { BookRecommendation } from '../../components/BookRecommendation';
import { useBooks } from '../../contexts/BookContext';

export default function RecommendationScreen() {
  const { savedBookIds, addToLibrary } = useBooks();
  return <BookRecommendation savedBooks={savedBookIds} onAddToLibrary={addToLibrary} />;
}
