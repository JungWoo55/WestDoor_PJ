
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Copied from BookSearch.tsx - should be in a central types file
interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  category: string;
}

interface BookRecommendationProps {
  onAddToLibrary: (book: Book) => void;
  savedBooks: number[];
}

const { width } = Dimensions.get('window');
const genreCardWidth = (width - 3 * 16) / 2;

export function BookRecommendation({ onAddToLibrary, savedBooks }: BookRecommendationProps) {
  const insets = useSafeAreaInsets();
  // Data from the original file
  const keywordRecommendations: Book[] = [
    { id: 1, title: "원씽", author: "게리 켈러", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop", rating: 4.5, category: "자기계발" },
    { id: 2, title: "데미안", author: "헤르만 헤세", cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop", rating: 4.7, category: "문학" },
    { id: 3, title: "클린 코드", author: "로버트 마틴", cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop", rating: 4.8, category: "IT/기술" },
  ];

  const personalityRecommendations: Book[] = [
    { id: 4, title: "아몬드", author: "손원평", cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop", rating: 4.6, category: "소설" },
    { id: 5, title: "코스모스", author: "칼 세이건", cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop", rating: 4.9, category: "과학" },
    { id: 6, title: "사피엔스", author: "유발 하라리", cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop", rating: 4.7, category: "역사" },
  ];

  const renderBookCard = (book: Book) => {
    const isSaved = savedBooks.includes(book.id);
    return (
      <Card key={book.id} style={styles.bookCard}>
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: book.cover }} style={styles.bookCover} />
          <Button
            size="icon"
            variant="secondary"
            style={styles.heartButton}
            onPress={() => onAddToLibrary(book)}
          >
            <AntDesign name="heart" size={16} color={isSaved ? '#ef4444' : '#6b7280'} />
          </Button>
        </View>
        <View style={styles.bookInfo}>
          <Badge variant="secondary" style={{ marginBottom: 8 }}>{book.category}</Badge>
          <Text style={styles.bookTitle} numberOfLines={1}>{book.title}</Text>
          <Text style={styles.bookAuthor}>{book.author}</Text>
          <View style={styles.ratingContainer}>
            <AntDesign name="star" size={12} color="#facc15" />
            <Text style={styles.ratingText}>{book.rating}</Text>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <FontAwesome name="book" size={20} color="#16a34a" />
          <Text style={styles.mainHeaderTitle}>맞춤 도서 추천</Text>
        </View>
        <Text style={styles.subHeaderText}>AI가 분석한 당신을 위한 특별한 책들을 만나보세요</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.subSectionHeader}>
          <Text style={styles.subHeaderTitle}>키워드별 추천</Text>
          <Button variant="ghost" size="sm">더보기</Button>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {keywordRecommendations.map(renderBookCard)}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.subSectionHeader}>
          <Text style={styles.subHeaderTitle}>성향별 추천</Text>
          <Button variant="ghost" size="sm">더보기</Button>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {personalityRecommendations.map(renderBookCard)}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.subSectionHeader}>
          <Text style={styles.subHeaderTitle}>오늘의 추천 장르</Text>
        </View>
        <View style={styles.genreGrid}>
          <Card style={styles.genreCard}>
            <LinearGradient colors={['#3b82f6', '#8b5cf6']} style={styles.gradient}>
              <Text style={styles.genreTitle}>SF/판타지</Text>
              <Text style={styles.genreSubtitle}>상상력을 자극하는 이야기</Text>
            </LinearGradient>
          </Card>
          <Card style={styles.genreCard}>
            <LinearGradient colors={['#f97316', '#ec4899']} style={styles.gradient}>
              <Text style={styles.genreTitle}>자기계발</Text>
              <Text style={styles.genreSubtitle}>더 나은 내일을 위한 지침</Text>
            </LinearGradient>
          </Card>
        </View>
      </View>
    </ScrollView>
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
  bookCover: { width: '100%', height: 192 },
  heartButton: { position: 'absolute', top: 8, right: 8, height: 32, width: 32, borderRadius: 16 },
  bookInfo: { padding: 12 },
  bookTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  bookAuthor: { fontSize: 12, color: '#6b7280', marginBottom: 8 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 12 },
  genreGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  genreCard: { width: genreCardWidth, borderWidth: 0, borderRadius: 12, overflow: 'hidden' },
  gradient: { padding: 16, height: 100, justifyContent: 'center' },
  genreTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  genreSubtitle: { fontSize: 14, color: '#fff', opacity: 0.9 },
});
