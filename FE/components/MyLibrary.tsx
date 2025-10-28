
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native'; // FlatList, ScrollView 제거
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Book } from '../types';
import { BookDetailModal } from './BookDetailModal';
import { useBooks } from '../contexts/BookContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { BookItem } from './BookItem';

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

  const renderBookList = (books: Book[], emptyMessage: string) => (
    <FlatList
      data={books}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContentContainer}
      renderItem={({ item }) => (
        <BookItem
          book={item}
          isSaved={true} // 내 서재에 있는 책이므로 항상 true
          onPress={() => handleBookPress(item)}
          onToggleSave={addToLibrary} // 컨텍스트의 토글 함수 사용
        />
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <FontAwesome name="bookmark-o" size={48} color="#9ca3af" />
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      )}
    />
  );

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top }]}>
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

      </View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flex: 1, // 탭 컨텐츠가 남은 공간을 모두 차지하도록
    paddingHorizontal: 16,
  },
  listContentContainer: {
    paddingTop: 16,
    paddingBottom: 32,
    gap: 12, // 아이템 사이의 간격
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
});
