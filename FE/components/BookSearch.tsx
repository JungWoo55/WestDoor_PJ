import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Book } from '../types';
import { BookDetailModal } from "./BookDetailModal";
import { searchBooks } from "../api/googleBooks"; // API 함수 임포트
import { useBooks } from "../contexts/BookContext"; // useBooks 훅 임포트
import { Button } from "./ui/Button";

export function BookSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const insets = useSafeAreaInsets();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // useBooks 훅으로 컨텍스트 값 가져오기
  const { addToLibrary, savedBookIds } = useBooks();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const books = await searchBooks(searchQuery);
      setSearchResults(books || []);
    } catch (e) {
      setError("검색 중 오류가 발생했습니다.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookPress = (book: Book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  return (
    <>
      <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.searchBarContainer}>
          <View style={styles.searchInputWrapper}>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="책 제목, 저자 등으로 검색하세요" // 플레이스홀더 변경
              placeholderTextColor="#6b7280"
              style={styles.searchInput}
              onSubmitEditing={handleSearch} // 엔터키로 검색
            />
            <Button onPress={handleSearch} size="icon" style={styles.searchButton}>
              <Feather name="search" size={16} color="white" />
            </Button>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#16a34a" style={{ marginTop: 20 }} />
          ) : error ? (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>{error}</Text>
            </View>
          ) : searchResults.length > 0 ? (
            <View style={styles.bookList}>
              {searchResults.map((book) => {
                const isSaved = savedBookIds.includes(book.id);
                // API 응답에 맞춰 이미지 경로 수정
                const coverImage = book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/80x112.png?text=No+Image';

                return (
                  <TouchableOpacity key={book.id} onPress={() => handleBookPress(book)}>
                    <View style={styles.card}>
                      <View style={styles.bookContent}>
                        <Image source={{ uri: coverImage }} style={styles.coverImage} />
                        <View style={styles.bookInfo}>
                          <View style={styles.bookHeader}>
                            <View style={styles.bookTitleWrapper}>
                              <Text style={styles.bookTitle} numberOfLines={2}>{book.volumeInfo.title}</Text>
                              <Text style={styles.bookAuthor} numberOfLines={1}>{book.volumeInfo.authors?.join(', ')}</Text>
                            </View>
                            <TouchableOpacity onPress={() => addToLibrary(book)} style={styles.heartButton}>
                              <AntDesign name="heart" size={16} color={isSaved ? '#ef4444' : '#6b7280'} />
                            </TouchableOpacity>
                          </View>
                          <Text style={styles.description} numberOfLines={2}>
                            {book.volumeInfo.description}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>검색 결과가 여기에 표시됩니다.</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <BookDetailModal
        visible={!!selectedBook}
        book={selectedBook}
        onClose={handleCloseModal}
        onAddToLibrary={addToLibrary} // 컨텍스트의 addToLibrary 함수 전달
        isSaved={selectedBook ? savedBookIds.includes(selectedBook.id) : false}
      />
    </>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
  },
  searchButton: {
    height: 40,
    width: 40,
  },
  contentContainer: {
    padding: 16,
  },
  bookList: {
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  bookContent: {
    flexDirection: 'row',
    gap: 16,
  },
  coverImage: {
    width: 80,
    height: 112,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  bookInfo: {
    flex: 1,
    gap: 8,
  },
  bookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookTitleWrapper: {
    flex: 1,
    marginRight: 8,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#6b7280',
  },
  heartButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
  },
  noResults: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#6b7280',
  },
});