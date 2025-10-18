
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";

import { useSafeAreaInsets } from "react-native-safe-area-context";

// Type definitions from the original file
interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  category: string;
  description: string;
}

interface BookSearchProps {
  onAddToLibrary: (book: Book) => void;
  savedBooks: number[];
}

export function BookSearch({ onAddToLibrary, savedBooks }: BookSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const insets = useSafeAreaInsets();

  // Data from the original file
  const bestsellerBooks: Book[] = [
    {
      id: 7,
      title: "트렌드 코리아 2025",
      author: "김난도",
      cover: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=600&fit=crop",
      rating: 4.5,
      category: "경제/경영",
      description: "2025년 대한민국의 트렌드를 분석한 필독서"
    },
    {
      id: 8,
      title: "퓨처 셀프",
      author: "벤저민 하디",
      cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop",
      rating: 4.7,
      category: "자기계발",
      description: "미래의 나를 설계하는 실천적 방법론"
    },
    {
      id: 9,
      title: "불편한 편의점",
      author: "김호연",
      cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop",
      rating: 4.8,
      category: "소설",
      description: "따뜻한 위로를 전하는 감동 소설"
    },
  ];

  const filteredBooks = searchQuery
    ? bestsellerBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : bestsellerBooks;

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.searchBarContainer}>
        <View style={styles.searchInputWrapper}>
          <Feather name="search" size={16} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="책 제목이나 저자를 검색하세요"
            placeholderTextColor="#6b7280"
            style={styles.searchInput}
          />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.sectionHeader}>
          <Feather name="trending-up" size={20} color="#16a34a" />
          <Text style={styles.sectionTitle}>베스트셀러</Text>
        </View>

        <View style={styles.bookList}>
          {filteredBooks.map((book, index) => {
            const isSaved = savedBooks.includes(book.id);
            return (
              <View key={book.id} style={styles.card}>
                <View style={styles.bookContent}>
                  <View style={styles.coverWrapper}>
                    <Image source={{ uri: book.cover }} style={styles.coverImage} />
                    <View style={styles.rankBadge}>
                      <Text style={styles.rankText}>{index + 1}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.bookInfo}>
                    <View style={styles.bookHeader}>
                      <View style={styles.bookTitleWrapper}>
                        <Text style={styles.bookTitle} numberOfLines={1}>{book.title}</Text>
                        <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>
                      </View>
                      <TouchableOpacity onPress={() => onAddToLibrary(book)} style={styles.heartButton}>
                        <AntDesign name="heart" size={16} color={isSaved ? '#ef4444' : '#6b7280'} />
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{book.category}</Text>
                    </View>
                    
                    <Text style={styles.description} numberOfLines={2}>
                      {book.description}
                    </Text>
                    
                    <View style={styles.ratingContainer}>
                      <AntDesign name="star" size={12} color="#facc15" />
                      <Text style={styles.ratingText}>{book.rating}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {filteredBooks.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>검색 결과가 없습니다</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  searchBarContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  searchInputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingLeft: 40,
    paddingRight: 16,
    fontSize: 16,
    color: '#111827',
  },
  contentContainer: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#111827',
  },
  bookList: {
    // Simulates space-y-3
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12, // for space-y-3
  },
  bookContent: {
    flexDirection: 'row',
    gap: 16,
  },
  coverWrapper: {
    position: 'relative',
  },
  coverImage: {
    width: 80,
    height: 112,
    borderRadius: 8,
  },
  rankBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  rankText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#111827',
  },
  bookInfo: {
    flex: 1,
  },
  bookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bookTitleWrapper: {
    flex: 1,
    marginRight: 8,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#6b7280',
  },
  heartButton: {
    padding: 4,
  },
  categoryBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#374151',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#111827',
  },
  noResults: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#6b7280',
  },
});
