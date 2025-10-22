
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { FontAwesome, Feather, AntDesign } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Book } from '../types';
import { BookDetailModal } from './BookDetailModal';
import { useBooks } from '../contexts/BookContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs'; // Tabs 임포트

const { width } = Dimensions.get('window');
const cardGap = 12;
const cardWidth = (width - 3 * cardGap - 2 * 16) / 2;

export function MyLibrary() {
  const insets = useSafeAreaInsets();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { savedBooks, addToLibrary, savedBookIds } = useBooks();

  const handleBookPress = (book: Book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  // 현재는 모든 책을 '읽을 책'으로 간주합니다.
  const readingList = savedBooks;
  // 추천받은 책 목록은 비워둡니다. 향후 로직 구현이 필요합니다.
  const recommendedList: Book[] = [];

  const renderBookList = (books: Book[], emptyMessage: string) => {
    if (books.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <FontAwesome name="bookmark-o" size={48} color="#9ca3af" />
          <Text style={styles.emptyText}>{emptyMessage}</Text>
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
                    onPress={() => addToLibrary(book)}
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
        
        <Tabs defaultValue="reading" style={styles.tabsContainer}>
          <TabsList>
            <TabsTrigger value="reading">{`읽을 책 (${readingList.length})`}</TabsTrigger>
            <TabsTrigger value="recommended">{`추천받은 책 (${recommendedList.length})`}</TabsTrigger>
          </TabsList>
          <TabsContent value="reading">
            {renderBookList(readingList, "서재에 저장된 책이 없습니다.")}
          </TabsContent>
          <TabsContent value="recommended">
            {renderBookList(recommendedList, "추천받아 저장한 책이 없습니다.")}
          </TabsContent>
        </Tabs>

      </ScrollView>
      <BookDetailModal
        visible={!!selectedBook}
        book={selectedBook}
        onClose={handleCloseModal}
        onAddToLibrary={addToLibrary}
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
    paddingTop: 16, // Adjusted padding
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabsContainer: {
    width: '100%',
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
  bookGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: cardGap,
    marginTop: 16,
    paddingBottom: 32,
  },
  bookCard: {
    width: cardWidth,
    overflow: 'hidden',
    padding: 0,
  },
  bookCover: {
    width: '100%',
    height: 180,
    backgroundColor: '#f3f4f6',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    height: 32,
    width: 32,
    borderRadius: 16,
  },
  bookInfo: {
    padding: 12,
    gap: 4,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    minHeight: 34,
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
