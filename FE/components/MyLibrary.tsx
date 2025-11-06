


import React, { useState } from 'react';

import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Book } from '../types';

import { BookDetailModal } from './BookDetailModal';

import { useBooks } from '../contexts/BookContext';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';

import { BookItem } from './BookItem';



export function MyLibrary() {

  const insets = useSafeAreaInsets();

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const { 

    readBooks, 

    recomBooks, 

    addToLibrary, 

    removeFromLibrary, 

    readBookIds, 

    recomBookIds,

    isLoading 

  } = useBooks();



  const handleBookPress = (book: Book) => {

    setSelectedBook(book);

  };



  const handleCloseModal = () => {

    setSelectedBook(null);

  };



  const handleToggleSave = (book: Book, type: 'isRead' | 'isRecom') => {

    const isSaved = type === 'isRead' ? readBookIds.includes(book.id) : recomBookIds.includes(book.id);

    // Google Books API의 ID에서 ISBN을 추출해야 합니다. 

    // volumeInfo.industryIdentifiers를 사용하거나, book.id가 ISBN이라고 가정합니다.

    const isbn = book.id; 



    if (isSaved) {

      removeFromLibrary(book, type);

    } else {

      addToLibrary(book, type);

    }

  };



  const renderBookList = (books: Book[], type: 'isRead' | 'isRecom', emptyMessage: string) => {

    if (isLoading) {

      return <ActivityIndicator size="large" color="#16a34a" style={{ marginTop: 50 }} />;

    }



    return (

      <FlatList

        data={books}

        keyExtractor={(item) => item.id}

        contentContainerStyle={styles.listContentContainer}

        renderItem={({ item }) => {

          const isSaved = type === 'isRead' 

            ? readBookIds.includes(item.id) 

            : recomBookIds.includes(item.id);

          return (

            <BookItem

              book={item}

              isSaved={isSaved}

              onPress={() => handleBookPress(item)}

              onToggleSave={() => handleToggleSave(item, type)}

            />

          );

        }}

        ListEmptyComponent={() => (

          <View style={styles.emptyContainer}>

            <FontAwesome name="bookmark-o" size={48} color="#9ca3af" />

            <Text style={styles.emptyText}>{emptyMessage}</Text>

          </View>

        )}

      />

    );

  }



  return (

    <>

      <View style={[styles.container, { paddingTop: insets.top }]}> 

        <View style={styles.header}>

          <FontAwesome name="bookmark" size={20} color="#16a34a" />

          <Text style={styles.headerTitle}>내 서재</Text>

        </View>

        

        <Tabs defaultValue="reading" style={styles.tabsContainer}>

          <TabsList>

            <TabsTrigger value="reading">{`읽은 책 (${readBooks.length})`}</TabsTrigger>

            <TabsTrigger value="recommended">{`추천받은 책 (${recomBooks.length})`}</TabsTrigger>

          </TabsList>

          <TabsContent value="reading">

            {renderBookList(readBooks, 'isRead', "읽은 책이 없습니다.")}

          </TabsContent>

          <TabsContent value="recommended">

            {renderBookList(recomBooks, 'isRecom', "추천받은 책이 없습니다.")}

          </TabsContent>

        </Tabs>



      </View>

      <BookDetailModal

        visible={!!selectedBook}

        book={selectedBook}

        onClose={handleCloseModal}

        onToggleSave={(book, type) => handleToggleSave(book, type as 'isRead' | 'isRecom')}

        isSaved={selectedBook ? readBookIds.includes(selectedBook.id) || recomBookIds.includes(selectedBook.id) : false}

      />

    </>

  );

}



const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: '#fafafa',

  },

  header: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 10,

    paddingTop: 20,

    paddingBottom: 20,

    paddingHorizontal: 20,

  },

  headerTitle: {

    fontSize: 28,

    fontWeight: '800',

    color: '#111827',

    letterSpacing: -0.5,

  },

  tabsContainer: {

    flex: 1,

    paddingHorizontal: 20,

  },

  listContentContainer: {

    paddingTop: 20,

    paddingBottom: 32,

    gap: 16,

  },

  emptyContainer: {

    paddingVertical: 80,

    alignItems: 'center',

    gap: 20,

  },

  emptyText: {

    color: '#6b7280',

    fontSize: 17,

    fontWeight: '500',

    textAlign: 'center',

  },

});


