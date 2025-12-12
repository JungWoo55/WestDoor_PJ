import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from './ui/Card';
import { Skeleton } from './ui/Skeleton';

export function BookItemSkeleton() {
  return (
    <Card style={styles.card}>
      <Skeleton style={styles.coverImage} />
      <View style={styles.bookInfo}>
        <Skeleton style={{ height: 20, width: '80%', marginBottom: 8 }} />
        <Skeleton style={{ height: 16, width: '50%', marginBottom: 16 }} />
        <View style={styles.bookFooter}>
          <Skeleton style={{ height: 22, width: 80 }} />
          <Skeleton style={{ height: 22, width: 60 }} />
        </View>
      </View>
    </Card>
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
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
