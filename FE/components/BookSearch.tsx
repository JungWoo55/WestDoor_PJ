
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ActivityIndicator,
  FlatList, // FlatList 임포트
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Book } from '../types';
import { BookDetailModal } from "./BookDetailModal";
import { searchBooks } from "../api/googleBooks";
import { useBooks } from "../contexts/BookContext";
import { Button } from "./ui/Button";
import { BookItem } from "./BookItem"; // BookItem 임포트

export function BookSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false); // 검색 실행 여부 상태
  
  const insets = useSafeAreaInsets();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const { addToLibrary, savedBookIds } = useBooks();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
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
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.searchBarContainer}>
          <View style={styles.searchInputWrapper}>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="책 제목, 저자 등으로 검색하세요"
              placeholderTextColor="#6b7280"
              style={styles.searchInput}
              onSubmitEditing={handleSearch}
            />
            <Button onPress={handleSearch} size="icon" style={styles.searchButton}>
              <Feather name="search" size={16} color="white" />
            </Button>
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#16a34a" style={{ flex: 1 }} />
        ) : error ? (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{error}</Text>
          </View>
        ) : !hasSearched ? (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>관심 있는 책을 검색해보세요.</Text>
          </View>
        ) : searchResults.length === 0 ? (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>검색 결과가 없습니다.</Text>
          </View>
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContentContainer}
            renderItem={({ item }) => (
              <BookItem
                book={item}
                isSaved={savedBookIds.includes(item.id)}
                onPress={() => handleBookPress(item)}
                onToggleSave={addToLibrary}
              />
            )}
          />
        )}
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
  listContentContainer: {
    padding: 16,
    gap: 12,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    color: '#6b7280',
    fontSize: 16,
  },
});