
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Book } from '../types';
import { BookDetailModal } from './BookDetailModal';
import { useBooks } from '../contexts/BookContext';
import { searchBooks } from '../api/googleBooks';
import { BookItem } from './BookItem'; // BookItem 임포트

export function BookRecommendation() {
  const insets = useSafeAreaInsets();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  
  const { addToLibrary, savedBookIds } = useBooks();

  const [selfHelpBooks, setSelfHelpBooks] = useState<Book[]>([]);
  const [fictionBooks, setFictionBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [selfHelpResult, fictionResult] = await Promise.all([
          searchBooks('자기계발'),
          searchBooks('소설'),
        ]);
        setSelfHelpBooks(selfHelpResult || []);
        setFictionBooks(fictionResult || []);
      } catch (e) {
        setError('추천 도서 목록을 가져오는 데 실패했습니다.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleBookPress = (book: Book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  const renderSection = (title: string, data: Book[]) => (
    <View style={styles.section}>
      <View style={styles.subSectionHeader}>
        <Text style={styles.subHeaderTitle}>{title}</Text>
      </View>
      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
        renderItem={({ item }) => (
          <View style={{ width: 280 }}>{/* 가로 스크롤 아이템의 너비 지정 */}
            <BookItem
              book={item}
              isSaved={savedBookIds.includes(item.id)}
              onPress={() => handleBookPress(item)}
              onToggleSave={addToLibrary}
            />
          </View>
        )}
      />
    </View>
  );

  return (
    <>
      <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.headerSection}>
          <FontAwesome name="book" size={20} color="#16a34a" />
          <Text style={styles.mainHeaderTitle}>맞춤 도서 추천</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#16a34a" style={{ marginTop: 40 }}/>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            {renderSection('인기 자기계발서', selfHelpBooks)}
            {renderSection('화제의 소설', fictionBooks)}
          </>
        )}
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
  container: { flex: 1, backgroundColor: '#fff' },
  headerSection: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 32, paddingHorizontal: 16 },
  mainHeaderTitle: { fontSize: 24, fontWeight: 'bold' },
  section: { marginBottom: 32 },
  subSectionHeader: { marginBottom: 16, paddingHorizontal: 16 },
  subHeaderTitle: { fontSize: 18, fontWeight: 'bold' },
  horizontalScroll: { gap: 12, paddingHorizontal: 16 },
  errorText: { textAlign: 'center', color: '#ef4444', marginTop: 40 },
});
