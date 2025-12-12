import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Book } from '../types';
import { BookDetailModal } from './BookDetailModal';
import { useBooks } from '../contexts/BookContext';
import { searchBooks } from '../api/googleBooks';
import { BookItem } from './BookItem';
import { BookItemSkeleton } from './BookItemSkeleton';

export function BookRecommendation() {
  const insets = useSafeAreaInsets();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { userProfile, addToLibrary, removeFromLibrary, readBookIds, recomBookIds } = useBooks();

  const [recommendations, setRecommendations] = useState<{ [key: string]: Book[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const genresToFetch = React.useMemo(() => 
    userProfile?.favoriteGenres && userProfile.favoriteGenres.length > 0
      ? userProfile.favoriteGenres
      : ['자기계발', '소설'],
  [userProfile]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userProfile) {
        setIsLoading(true);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const promises = genresToFetch.map(genre => searchBooks(genre));
        const results = await Promise.all(promises);

        const newRecommendations: { [key: string]: Book[] } = {};
        genresToFetch.forEach((genre, index) => {
          newRecommendations[genre] = results[index] || [];
        });

        setRecommendations(newRecommendations);
      } catch (e) {
        setError('추천 도서 목록을 가져오는 데 실패했습니다.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [userProfile, genresToFetch]);

  const handleToggleSave = (book: Book) => {
    const allSavedIds = [...(readBookIds || []), ...(recomBookIds || [])];
    const isSaved = allSavedIds.includes(book.id);
    if (isSaved) {
      const isRead = readBookIds?.includes(book.id);
      removeFromLibrary(book, isRead ? 'isRead' : 'isRecom');
    } else {
      addToLibrary(book, 'isRead');
    }
  };

  const handleBookPress = (book: Book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  const renderSection = (title: string, data: Book[]) => {
    const allSavedIds = [...(readBookIds || []), ...(recomBookIds || [])];
    return (
      <View style={styles.section} key={title}>
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
            <View style={{ width: 280 }}>
              <BookItem
                book={item}
                isSaved={allSavedIds.includes(item.id)}
                onPress={() => handleBookPress(item)}
                onToggleSave={() => handleToggleSave(item)}
              />
            </View>
          )}
        />
      </View>
    );
  };

  const renderSkeletonSection = (title: string) => {
    return (
      <View style={styles.section} key={title}>
        <View style={styles.subSectionHeader}>
          <Text style={styles.subHeaderTitle}>{title}</Text>
        </View>
        <FlatList
          horizontal
          data={Array.from({ length: 3 })}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
          renderItem={() => (
            <View style={{ width: 280 }}>
              <BookItemSkeleton />
            </View>
          )}
        />
      </View>
    );
  };

  const allSavedIds = [...(readBookIds || []), ...(recomBookIds || [])];

  return (
    <>
      <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.headerSection}>
          <FontAwesome name="book" size={20} color="#16a34a" />
          <Text style={styles.mainHeaderTitle}>맞춤 도서 추천</Text>
        </View>

        {isLoading ? (
          <>
            {genresToFetch.map(genre => renderSkeletonSection(`'${genre}' 추천 도서`))}
          </>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            {Object.entries(recommendations).map(([genre, books]) => 
              books.length > 0 ? renderSection(`'${genre}' 추천 도서`, books) : null
            )}
          </>
        )}
      </ScrollView>
      <BookDetailModal
        visible={!!selectedBook}
        book={selectedBook}
        onClose={handleCloseModal}
        onToggleSave={handleToggleSave}
        isSaved={selectedBook ? allSavedIds.includes(selectedBook.id) : false}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  mainHeaderTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  section: { marginBottom: 40 },
  subSectionHeader: { marginBottom: 20, paddingHorizontal: 20 },
  subHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  horizontalScroll: { gap: 16, paddingHorizontal: 20 },
  errorText: {
    textAlign: 'center',
    color: '#ef4444',
    marginTop: 60,
    fontSize: 16,
    fontWeight: '500',
  },
});
