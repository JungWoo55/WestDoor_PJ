
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { FontAwesome, Feather, AntDesign } from '@expo/vector-icons';

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

interface MyLibraryProps {
  savedBooks: Book[];
  onRemoveFromLibrary: (bookId: number) => void;
}

const { width } = Dimensions.get('window');
const cardGap = 12;
const cardWidth = (width - 3 * cardGap - 2 * 16) / 2; // 2 cards per row, with gaps and padding

export function MyLibrary({ savedBooks, onRemoveFromLibrary }: MyLibraryProps) {
  const insets = useSafeAreaInsets();
  // This logic is from the original file
  const readingList = savedBooks.filter(book => [1, 2, 7, 8].includes(book.id));
  const recommendedList = savedBooks.filter(book => ![1, 2, 7, 8].includes(book.id));

  const renderBookList = (books: Book[]) => {
    if (books.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <FontAwesome name="bookmark-o" size={48} color="#9ca3af" />
          <Text style={styles.emptyText}>아직 저장된 책이 없습니다</Text>
        </View>
      );
    }

    return (
      <View style={styles.bookGrid}>
        {books.map((book) => (
          <Card key={book.id} style={styles.bookCard}>
            <View style={{ position: 'relative' }}>
              <Image source={{ uri: book.cover }} style={styles.bookCover} />
              <Button
                size="icon"
                variant="destructive"
                style={styles.deleteButton}
                onPress={() => onRemoveFromLibrary(book.id)}
              >
                <Feather name="trash-2" size={16} color="white" />
              </Button>
            </View>
            <View style={styles.bookInfo}>
              <Badge variant="secondary" style={{ marginBottom: 8 }}>
                {book.category}
              </Badge>
              <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
              <Text style={styles.bookAuthor}>{book.author}</Text>
              <View style={styles.ratingContainer}>
                <AntDesign name="star" size={12} color="#facc15" />
                <Text style={styles.ratingText}>{book.rating}</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
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
          {renderBookList(readingList)}
        </TabsContent>
        <TabsContent value="recommended">
          {renderBookList(recommendedList)}
        </TabsContent>
      </Tabs>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabsContainer: {
    width: '100%',
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
  },
  bookGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: cardGap,
    marginTop: 16,
  },
  bookCard: {
    width: cardWidth,
    overflow: 'hidden',
    padding: 0, // Reset card padding to handle it internally
  },
  bookCover: {
    width: '100%',
    height: 180, // h-48
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    height: 32, // h-8
    width: 32, // w-8
    borderRadius: 16, // rounded-full
  },
  bookInfo: {
    padding: 12,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    minHeight: 34, // for 2 lines
  },
  bookAuthor: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
  },
});
