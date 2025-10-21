
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import { Button } from './ui/Button';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Book } from '../types';
import { BookDetailModal } from './BookDetailModal';
import { Card } from './ui/Card';

interface BookRecommendationProps {
  onAddToLibrary: (book: Book) => void;
  savedBooks: number[];
}

export function BookRecommendation({ onAddToLibrary, savedBooks }: BookRecommendationProps) {
  const insets = useSafeAreaInsets();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleBookPress = (book: Book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };
  
  const keywordRecommendations: Book[] = [
    { id: 1, title: "원씽", author: "게리 켈러", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop", rating: 4.5, category: "자기계발", description: "하나의 목표에 집중하여 성공을 이끌어내는 방법을 제시하는 자기계발서입니다. 복잡한 세상에서 가장 중요한 것을 찾아내는 기술을 알려줍니다.", publisher: "비즈니스북스", publicationDate: "2013-01-25", pages: 336, authorInfo: "게리 켈러는 미국의 베스트셀러 작가이자 강연가로, 성공과 생산성 분야의 전문가입니다." },
    { id: 2, title: "데미안", author: "헤르만 헤세", cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop", rating: 4.7, category: "문학", description: "주인공 싱클레어가 자아를 찾아가는 과정을 그린 성장 소설입니다. 선과 악, 빛과 어둠의 세계를 탐험하며 진정한 자신을 발견하는 여정을 담고 있습니다.", publisher: "민음사", publicationDate: "1919-01-01", pages: 248, authorInfo: "헤르만 헤세는 독일의 소설가이자 시인으로, 노벨 문학상 수상자입니다. 그의 작품은 자기 탐구와 영적 성장을 주제로 다룹니다." },
    { id: 3, title: "클린 코드", author: "로버트 마틴", cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop", rating: 4.8, category: "IT/기술", description: "소프트웨어 장인 정신을 바탕으로 좋은 코드를 작성하는 방법을 알려주는 개발자 필독서입니다. 코드 가독성과 유지보수성을 높이는 원칙과 실제 사례를 다룹니다.", publisher: "인사이트", publicationDate: "2013-12-24", pages: 584, authorInfo: "로버트 C. 마틴(Uncle Bob)은 소프트웨어 개발 분야의 세계적인 전문가로, 애자일 방법론과 클린 코드 원칙의 선구자입니다." },
  ];

  const personalityRecommendations: Book[] = [
    { id: 4, title: "아몬드", author: "손원평", cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop", rating: 4.6, category: "소설", description: "감정을 느끼지 못하는 소년의 특별한 성장을 그린 소설입니다. 타인과의 관계를 통해 세상을 이해하고 공감의 의미를 배워가는 과정을 담담하게 그려냅니다.", publisher: "창비", publicationDate: "2017-03-31", pages: 264, authorInfo: "손원평은 대한민국의 소설가이자 영화감독입니다. 그녀의 작품은 사회적 이슈와 인간 내면의 상처를 섬세하게 다룹니다." },
    { id: 5, title: "코스모스", author: "칼 세이건", cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop", rating: 4.9, category: "과학", description: "우주의 경이로움과 과학적 탐구의 역사를 담은 과학 교양서의 고전입니다. 천문학, 물리학, 생물학을 아우르며 과학적 사고의 중요성을 일깨워줍니다.", publisher: "사이언스북스", publicationDate: "2006-12-20", pages: 752, authorInfo: "칼 세이건은 미국의 천문학자, 우주물리학자, 작가로, 대중 과학 분야에 큰 족적을 남겼습니다. 그는 TV 시리즈 <코스모스>로 전 세계적인 명성을 얻었습니다." },
    { id: 6, title: "사피엔스", author: "유발 하라리", cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop", rating: 4.7, category: "역사", description: "인지 혁명, 농업 혁명, 과학 혁명을 거치며 인류가 어떻게 지구의 지배자가 되었는지 탐구하는 역사서입니다. 과거를 통해 현재를 이해하고 미래를 조망합니다.", publisher: "김영사", publicationDate: "2015-11-24", pages: 696, authorInfo: "유발 하라리는 이스라엘의 역사학자이자 교수로, 인류의 역사와 미래에 대한 거시적인 통찰로 유명합니다." },
  ];

  const renderBookItem = ({ item }: { item: Book }) => {
    const isSaved = savedBooks.includes(item.id);
    return (
      <Card
        book={item}
        onPress={() => handleBookPress(item)}
        actionButton={
          <Button
            size="icon"
            variant="secondary"
            style={styles.heartButton}
            onPress={() => onAddToLibrary(item)}
          >
            <AntDesign name="heart" size={16} color={isSaved ? '#ef4444' : '#6b7280'} />
          </Button>
        }
      />
    );
  };

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

        <View style={styles.section}>
          <View style={styles.subSectionHeader}>
            <Text style={styles.subHeaderTitle}>키워드별 추천</Text>
          </View>
          <FlatList
            horizontal
            data={keywordRecommendations}
            renderItem={renderBookItem}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.subSectionHeader}>
            <Text style={styles.subHeaderTitle}>성향별 추천</Text>
          </View>
          <FlatList
            horizontal
            data={personalityRecommendations}
            renderItem={renderBookItem}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          />
        </View>
      </ScrollView>
      <BookDetailModal
        visible={!!selectedBook}
        book={selectedBook}
        onClose={handleCloseModal}
        onAddToLibrary={onAddToLibrary}
        isSaved={selectedBook ? savedBooks.includes(selectedBook.id) : false}
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
