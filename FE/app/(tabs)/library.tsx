
import React from 'react';
import { MyLibrary } from '../../components/MyLibrary';
import { useBooks } from '../../contexts/BookContext';

export default function LibraryScreen() {
  const { savedBooks, removeFromLibrary } = useBooks();
  return <MyLibrary savedBooks={savedBooks} onRemoveFromLibrary={removeFromLibrary} />;
}
