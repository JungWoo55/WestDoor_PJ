
import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { AntDesign, Feather } from '@expo/vector-icons';
import { Book } from '../types';

interface BookDetailModalProps {
  book: Book | null;
  visible: boolean;
  onClose: () => void;
  onAddToLibrary: (book: Book) => void;
  isSaved: boolean;
}

const { height } = Dimensions.get('window');

const DetailRow = ({ label, value }: { label: string; value: string | number | undefined }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value || '-'}</Text>
  </View>
);

export function BookDetailModal({ book, visible, onClose, onAddToLibrary, isSaved }: BookDetailModalProps) {
  if (!book) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <SafeAreaView style={styles.modalView}>
          <View style={styles.header}>
            <Button variant="ghost" size="icon" onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#111827" />
            </Button>
          </View>

          {/* --- Fixed Header --- */}
          <View style={styles.fixedHeader}>
            <Image source={{ uri: book.cover }} style={styles.coverImage} />
            <View style={styles.headerInfo}>
              <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
              <Text style={styles.author}>{book.author}</Text>
              <Text style={styles.publisher}>{book.publisher || '출판사 정보 없음'}</Text>
              <View style={styles.metaRow}>
                <Badge variant="secondary">{book.category}</Badge>
                <View style={styles.ratingContainer}>
                  <AntDesign name="star" size={16} color="#facc15" />
                  <Text style={styles.ratingText}>{book.rating}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* --- Tab Navigation --- */}
          <Tabs defaultValue="intro" style={styles.tabsContainer}>
            <TabsList>
              <TabsTrigger value="intro">책소개</TabsTrigger>
              <TabsTrigger value="author">저자소개</TabsTrigger>
              <TabsTrigger value="details">상세정보</TabsTrigger>
            </TabsList>
            <ScrollView style={styles.tabContentScrollView}>
              <TabsContent value="intro">
                <Text style={styles.description}>
                  {book.description || "이 책에 대한 설명이 아직 없습니다."}
                </Text>
              </TabsContent>
              <TabsContent value="author">
                <Text style={styles.description}>
                  {book.authorInfo || "저자 정보가 아직 없습니다."}
                </Text>
              </TabsContent>
              <TabsContent value="details">
                <DetailRow label="출판사" value={book.publisher} />
                <DetailRow label="출간일" value={book.publicationDate} />
                <DetailRow label="페이지" value={book.pages ? `${book.pages}쪽` : '-'} />
              </TabsContent>
            </ScrollView>
          </Tabs>

          {/* --- Footer --- */}
          <View style={styles.footer}>
            <Button 
              style={styles.actionButton} 
              onPress={() => onAddToLibrary(book)}
            >
              <AntDesign name="heart" size={18} color={isSaved ? '#ef4444' : 'white'} />
              <Text style={styles.actionButtonText}>
                {isSaved ? '서재에서 제거' : '내 서재에 추가'}
              </Text>
            </Button>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    height: height * 0.92, // Increased height slightly
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    padding: 8,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  fixedHeader: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  coverImage: {
    width: 110,
    height: 160,
    borderRadius: 8,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  author: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 4,
  },
  publisher: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tabContentScrollView: {
    flex: 1,
    paddingBottom: 120, // Footer height
  },
  description: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    padding: 8, // Padding for content inside tabs
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    fontSize: 15,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 36, // For safe area
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButton: {
    height: 52,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
