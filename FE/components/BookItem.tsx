
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { AntDesign } from '@expo/vector-icons';
import { Book } from '../types';

interface BookItemProps extends TouchableOpacityProps {
  book: Book;
  onToggleSave: (book: Book, type: 'isRead' | 'isRecom') => void;
  isSaved: boolean;
  onDelete?: () => void;
  onMarkAsRead?: () => void;
}

export function BookItem({ book, onToggleSave, isSaved, onDelete, onMarkAsRead, ...props }: BookItemProps) {
  const coverImage = book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/80x112.png?text=No+Image';

  return (
    <TouchableOpacity {...props}>
      <Card style={styles.card}>
        {/* --- Left: Image --- */}
        <Image source={{ uri: coverImage }} style={styles.coverImage} />

        {/* --- Right: Info --- */}
        <View style={styles.bookInfo}>
          <View style={styles.bookHeader}>
            <View style={styles.bookTitleWrapper}>
              <Text style={styles.bookTitle} numberOfLines={2}>{book.volumeInfo.title}</Text>
              <Text style={styles.bookAuthor} numberOfLines={1}>{book.volumeInfo.authors?.join(', ')}</Text>
            </View>
            <TouchableOpacity onPress={() => onToggleSave(book, 'isRead')} style={styles.heartButton}>
              <AntDesign name="heart" size={20} color={isSaved ? '#ef4444' : '#9ca3af'} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.bookFooter}>
            <View style={styles.bookMeta}>
              {book.volumeInfo.categories?.[0] && 
                <Badge variant="secondary">
                  {book.volumeInfo.categories[0]}
                </Badge>
              }
              {book.volumeInfo.averageRating &&
                <View style={styles.ratingContainer}>
                  <AntDesign name="star" size={14} color="#facc15" />
                  <Text style={styles.ratingText}>{book.volumeInfo.averageRating}</Text>
                </View>
              }
            </View>
            
            {onDelete && onMarkAsRead && (
              <View style={styles.buttonContainer}>
                <Button variant="outline" size="sm" onPress={onMarkAsRead}>
                  읽음
                </Button>
                <Button variant="destructive" size="sm" onPress={onDelete}>
                  삭제
                </Button>
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
  },
  coverImage: {
    width: 80,
    height: 112,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
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
    marginTop: 4,
  },
  heartButton: {
    padding: 4,
  },
  bookFooter: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
  },
  bookMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    justifyContent: 'flex-end',
  },
});
