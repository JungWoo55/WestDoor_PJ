
import React from 'react';
import { BookSearch } from '../../components/BookSearch';
import { useBooks } from '../../contexts/BookContext';

export default function SearchScreen() {
  const { savedBookIds, addToLibrary } = useBooks();
  return <BookSearch savedBooks={savedBookIds} onAddToLibrary={addToLibrary} />;
}
