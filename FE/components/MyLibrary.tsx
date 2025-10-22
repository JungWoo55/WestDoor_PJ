
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { FontAwesome, Feather, AntDesign } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Book } from '../types';
import { BookDetailModal } from './BookDetailModal';
import { useBooks } from '../contexts/BookContext'; // useBooks 훅 임포트

const { width } = Dimensions.get('window');
const cardGap = 12;
const cardWidth = (width - 3 * cardGap - 2 * 16) / 2; // 2 cards per row, with gaps and padding

export function MyLibrary() {
  const insets = useSafeAreaInsets();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // useBooks 훅을 통해 컨텍스트 값 사용
  const { savedBooks, addToLibrary, savedBookIds } = useBooks();

  const handleBookPress = (book: Book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  const renderBookList = (books: Book[]) => {
    if (books.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <FontAwesome name="bookmark-o" size={48} color="#9ca3af" />
          <Text style={styles.emptyText}>아직 서재에 저장된 책이 없습니다</Text>
          <Text style={styles.emptySubText}>검색 탭에서 원하는 책을 추가해보세요.</Text>
        </View>
      );
    }

    return (
      <View style={styles.bookGrid}>
        {books.map((book) => {
          const coverImage = book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150x220.png?text=No+Image';
          return (
            <TouchableOpacity key={book.id} onPress={() => handleBookPress(book)}>
              <Card style={styles.bookCard}>
                <View style={{ position: 'relative' }}>
                  <Image source={{ uri: coverImage }} style={styles.bookCover} />
                  <Button
                    size="icon"
                    variant="destructive"
                    style={styles.deleteButton}
                    onPress={() => addToLibrary(book)} // 토글 함수 사용
                  >
                    <Feather name="trash-2" size={16} color="white" />
                  </Button>
                </View>
                <View style={styles.bookInfo}>
                  {book.volumeInfo.categories?.[0] && 
                    <Badge variant="secondary" style={{ marginBottom: 8 }}>
                      {book.volumeInfo.categories[0]}
                    </Badge>
                  }
                  <Text style={styles.bookTitle} numberOfLines={2}>{book.volumeInfo.title}</Text>
                  <Text style={styles.bookAuthor}>{book.volumeInfo.authors?.join(', ')}</Text>
                  {book.volumeInfo.averageRating &&
                    <View style={styles.ratingContainer}>
                      <AntDesign name="star" size={12} color="#facc15" />
                      <Text style={styles.ratingText}>{book.volumeInfo.averageRating}</Text>
                    </View>
                  }
                </View>
              </Card>
            </TouchableOpacity>
          )
        })}
      </View>
    );
  };

  return (
    <>
      <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <FontAwesome name="bookmark" size={20} color="#16a34a" />
          <Text style={styles.headerTitle}>내 서재</Text>
        </View>
        <View style={styles.contentContainer}>
          {renderBookList(savedBooks)}
        </View>
      </ScrollView>
      <BookDetailModal
        visible={!!selectedBook}
        book={selectedBook}
        onClose={handleCloseModal}
        onAddToLibrary={addToLibrary} // 컨텍스트의 토글 함수 전달
        isSaved={selectedBook ? savedBookIds.includes(selectedBook.id) : false}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingBottom: 32,
  },
  emptyContainer: {
    paddingVertical: 64,
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    color: '#374151',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubText: {
    color: '#6b7280',
    fontSize: 14,
  },
  bookGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: cardGap,
    marginTop: 16,
  },
  bookCard: {
    width: cardWidth,
    overflow: 'hidden',
    padding: 0, // Reset card padding to handle it internally
  },
  bookCover: {
    width: '100%',
    height: 180, // h-48
    backgroundColor: '#f3f4f6',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    height: 32, // h-8
    width: 32, // w-8
    borderRadius: 16, // rounded-full
  },
  bookInfo: {
    padding: 12,
    gap: 4,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    minHeight: 34, // for 2 lines
  },
  bookAuthor: {
    fontSize: 12,
    color: '#6b7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
  },
});
