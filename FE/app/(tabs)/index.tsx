
import React from 'react';
import { View } from 'react-native';
import { BookRecommendation } from '../../components/BookRecommendation';

export default function RecommendationScreen() {
  return (
    <View style={{ flex: 1 }}>
      <BookRecommendation />
    </View>
  );
}
