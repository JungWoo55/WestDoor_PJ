import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Book, LibraryBookWithDetails } from '../types';
import { BookDetailModal } from './BookDetailModal';
import { useBooks } from '../contexts/BookContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { BookItem } from './BookItem';
import { useRouter } from 'expo-router'; // Correct import location for useRouter
import { Button } from './ui/Button';     // Correct import location for Button

export function MyLibrary() {
  const insets = useSafeAreaInsets();
  const router = useRouter(); // Correct usage of useRouter
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { 
    countedBooks,
    savedBooks,
    recommendedBooks,
    addToLibrary, 
    removeFromLibrary, 
    markAsRead,
    decrementReadCount,
    isLoading 
  } = useBooks();

  const savedBookIds = savedBooks.map(book => book.id);
  const recommendedBookIds = recommendedBooks.map(book => book.id);

  const handleBookPress = (book: Book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

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
    return null;
  };

  const handleToggleSave = async (book: Book, type: 'isRead' | 'isRecom') => {
    const isbn = getISBN(book);
    if (!isbn) {
      console.error('ISBN not found for book:', book);
      return;
    }
    const isSaved = type === 'isRead' 
      ? savedBookIds.includes(book.id) 
      : recommendedBookIds.includes(book.id);
    if (isSaved) {
      await removeFromLibrary(book, type);
    } else {
      await addToLibrary(book, type);
    }
  };

  const renderBookList = (
    books: LibraryBookWithDetails[], 
    type: 'isRead' | 'isRecom', 
    emptyMessage: string,
    options?: {
      onDelete?: (book: Book) => void;
      onMarkAsRead?: (book: Book) => void;
      onIncrementReadCount?: (book: Book) => void;
      onDecrementReadCount?: (book: Book) => void;
      showToggleSave?: boolean;
    }
  ) => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#16a34a" style={{ marginTop: 50 }} />;
    }
    return (
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
        renderItem={({ item }) => {
          const isSaved = type === 'isRead' 
            ? savedBookIds.includes(item.id) 
            : recommendedBookIds.includes(item.id);
          return (
            <BookItem
              book={item}
              isSaved={isSaved}
              onPress={() => handleBookPress(item)}
              onToggleSave={options?.showToggleSave ? () => handleToggleSave(item, type) : undefined}
              onDelete={options?.onDelete ? () => options.onDelete?.(item) : undefined}
              onMarkAsRead={options?.onMarkAsRead ? () => options.onMarkAsRead?.(item) : undefined}
              onIncrementReadCount={options?.onIncrementReadCount ? () => options.onIncrementReadCount?.(item) : undefined}
              onDecrementReadCount={options?.onDecrementReadCount ? () => options.onDecrementReadCount?.(item) : undefined}
            />
          );
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <FontAwesome name="bookmark-o" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>{emptyMessage}</Text>
            {/* Add Button */}
            <Button
              variant="outline"
              onPress={() => router.push('/(tabs)/search')} // Navigate to search tab
            >
              <Text>책 검색하러 가기</Text>
            </Button>
          </View>
        )}
      />
    );
  }

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top }]}> 
        <View style={styles.header}>
          <FontAwesome name="bookmark" size={20} color="#16a34a" />
          <Text style={styles.headerTitle}>내 서재</Text>
        </View>
        
        <Tabs defaultValue="reading" style={styles.tabsContainer}>
          <TabsList>
            <TabsTrigger value="reading">{`읽은 책 (${countedBooks.length})`}</TabsTrigger>
            <TabsTrigger value="saved">{`저장한 책 (${savedBooks.length})`}</TabsTrigger>
            <TabsTrigger value="recommended">{`추천받은 책 (${recommendedBooks.length})`}</TabsTrigger>
          </TabsList>
          <TabsContent value="reading">
            {renderBookList(countedBooks, 'isRead', "읽은 책이 없습니다.", {
              onIncrementReadCount: (book) => markAsRead(book),
              onDecrementReadCount: (book) => decrementReadCount(book),
              showToggleSave: false,
            })}
          </TabsContent>
          <TabsContent value="saved">
            {renderBookList(savedBooks, 'isRead', "저장한 책이 없습니다.", {
              onDelete: (book) => removeFromLibrary(book, 'isRead'),
              onMarkAsRead: (book) => markAsRead(book),
              showToggleSave: true,
            })}
          </TabsContent>
          <TabsContent value="recommended">
            {renderBookList(recommendedBooks, 'isRecom', "추천받은 책이 없습니다.", {
              showToggleSave: true,
            })}
          </TabsContent>
        </Tabs>
      </View>
      <BookDetailModal
        visible={!!selectedBook}
        book={selectedBook}
        onClose={handleCloseModal}
        onToggleSave={(book, type) => handleToggleSave(book, type as 'isRead' | 'isRecom')}
        isSaved={selectedBook ? savedBookIds.includes(selectedBook.id) || recommendedBookIds.includes(selectedBook.id) : false}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  tabsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContentContainer: {
    paddingTop: 20,
    paddingBottom: 32,
    gap: 16,
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    gap: 20,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
  },
});