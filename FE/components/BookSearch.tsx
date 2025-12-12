import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  FlatList, // Removed ActivityIndicator as BookItemSkeleton replaces it
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Book } from '../types';
import { BookDetailModal } from "./BookDetailModal";
import { searchBooks } from "../api/googleBooks";
import { useBooks } from "../contexts/BookContext";
import { Button } from "./ui/Button";
import { BookItem } from "./BookItem";
import { useDebounce } from "../utils/useDebounce";
import { BookItemSkeleton } from "./BookItemSkeleton"; // Correct import location

export function BookSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500ms delay
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const insets = useSafeAreaInsets();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const { addToLibrary, removeFromLibrary, readBookIds, recomBookIds } = useBooks();
  const allSavedIds = [...(readBookIds || []), ...(recomBookIds || [])];

  const handleToggleSave = (book: Book) => {
    const isSaved = allSavedIds.includes(book.id);
    if (isSaved) {
      const isRead = readBookIds?.includes(book.id);
      removeFromLibrary(book, isRead ? 'isRead' : 'isRecom');
    } else {
      addToLibrary(book, 'isRead');
    }
  };

  const runSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const books = await searchBooks(query);
      setSearchResults(books || []);
    } catch (e) {
      setError("검색 중 오류가 발생했습니다.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      runSearch(debouncedSearchQuery);
    } else {
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [debouncedSearchQuery]);

  const handleManualSearch = () => {
    if (searchQuery.trim()) {
      runSearch(searchQuery);
    }
  };

  const handleBookPress = (book: Book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  const renderLoading = () => (
    <View style={styles.listContentContainer}>
      {Array.from({ length: 5 }).map((_, index) => (
        <BookItemSkeleton key={index} />
      ))}
    </View>
  );

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
              onSubmitEditing={handleManualSearch}
            />
            <Button onPress={handleManualSearch} size="icon" style={styles.searchButton}>
              <Feather name="search" size={16} color="white" />
            </Button>
          </View>
        </View>

        {isLoading ? (
          renderLoading()
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
                isSaved={allSavedIds.includes(item.id)}
                onPress={() => handleBookPress(item)}
                onToggleSave={() => handleToggleSave(item)}
              />
            )}
          />
        )}
      </View>
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
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  searchBarContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 18,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchButton: {
    height: 48,
    width: 48,
    borderRadius: 12,
  },
  listContentContainer: {
    padding: 20,
    gap: 16,
    paddingBottom: 32,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  messageText: {
    color: '#6b7280',
    fontSize: 17,
    fontWeight: '400',
    textAlign: 'center',
  },
});