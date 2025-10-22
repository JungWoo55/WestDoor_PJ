
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Button } from './ui/Button';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Book } from '../types';
import { BookDetailModal } from './BookDetailModal';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { useBooks } from '../contexts/BookContext';
import { searchBooks } from '../api/googleBooks';

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

  const renderBookItem = ({ item }: { item: Book }) => {
    const isSaved = savedBookIds.includes(item.id);
    const coverImage = item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/144x192.png?text=No+Image';

    return (
      <TouchableOpacity onPress={() => handleBookPress(item)}>
        <Card style={styles.bookCard}>
          <View style={{ position: 'relative' }}>
            <Image source={{ uri: coverImage }} style={styles.bookCover} />
            <Button
              size="icon"
              variant="secondary"
              style={styles.heartButton}
              onPress={() => addToLibrary(item)}
            >
              <AntDesign name="heart" size={16} color={isSaved ? '#ef4444' : '#6b7280'} />
            </Button>
          </View>
          <View style={styles.bookInfo}>
            {item.volumeInfo.categories?.[0] && <Badge variant="secondary" style={{ marginBottom: 8 }}>{item.volumeInfo.categories[0]}</Badge>}
            <Text style={styles.bookTitle} numberOfLines={1}>{item.volumeInfo.title}</Text>
            <Text style={styles.bookAuthor}>{item.volumeInfo.authors?.join(', ')}</Text>
            {item.volumeInfo.averageRating &&
              <View style={styles.ratingContainer}>
                <AntDesign name="star" size={12} color="#facc15" />
                <Text style={styles.ratingText}>{item.volumeInfo.averageRating}</Text>
              </View>
            }
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderSection = (title: string, data: Book[]) => (
    <View style={styles.section}>
      <View style={styles.subSectionHeader}>
        <Text style={styles.subHeaderTitle}>{title}</Text>
      </View>
      <FlatList
        horizontal
        data={data}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      />
    </View>
  );

  return (
    <>
      <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="book" size={20} color="#16a34a" />
            <Text style={styles.mainHeaderTitle}>맞춤 도서 추천</Text>
          </View>
          <Text style={styles.subHeaderText}>AI가 분석한 당신을 위한 특별한 책들을 만나보세요</Text>
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
  section: { marginBottom: 32, paddingHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  mainHeaderTitle: { fontSize: 24, fontWeight: 'bold' },
  subHeaderText: { color: '#6b7280', fontSize: 16 },
  subSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  subHeaderTitle: { fontSize: 18, fontWeight: 'bold' },
  horizontalScroll: { gap: 12, paddingRight: 16 },
  bookCard: { width: 144, overflow: 'hidden', padding: 0 },
  bookCover: { width: '100%', height: 192, backgroundColor: '#f3f4f6' },
  heartButton: { position: 'absolute', top: 8, right: 8, height: 32, width: 32, borderRadius: 16 },
  bookInfo: { padding: 12, gap: 4 },
  bookTitle: { fontSize: 14, fontWeight: 'bold' },
  bookAuthor: { fontSize: 12, color: '#6b7280' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 12 },
  errorText: { textAlign: 'center', color: '#ef4444', marginTop: 40 },
});
