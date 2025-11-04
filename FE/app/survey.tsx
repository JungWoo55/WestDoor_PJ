
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { submitSurvey } from '../api/survey';

import { updateNickname } from '../api/auth';

import { useBooks } from '../contexts/BookContext';

const READING_AMOUNTS = ['안읽음', '1~2권', '3권 이상'];
const CATEGORIES = [
  '건강', '경제/경영', '과학', '기술', '만화', '소설', '시/에세이', '어린이/초등', 
  '여행', '역사', '대중문화', '외국어', '요리', '인문', '자기계발', '유아', 
  '잡지', '정치사회', '종교', '청소년', 'IT', '취미/스포츠'
];

export default function SurveyScreen() {
  const router = useRouter();
  const { updateUserProfile } = useBooks();
  const [nickname, setNickname] = useState('');
  const [readingAmount, setReadingAmount] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [readingStyle, setReadingStyle] = useState('');

  const handleToggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSubmit = async () => {
    if (!nickname || !readingAmount || selectedCategories.length === 0) {
      Alert.alert('입력 필요', '닉네임, 월간 독서량, 선호 카테고리는 필수 항목입니다.');
      return;
    }

    try {
      await submitSurvey({
        nickname,
        readingAmount,
        selectedCategories,
        readingStyle,
      });
      await updateNickname(nickname);
      await updateUserProfile({ nickname, favoriteGenres: selectedCategories });
      Alert.alert('제출 완료', '설문이 제출되었습니다.', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    } catch (error) {
      console.error('Failed to submit survey:', error);
      Alert.alert('제출 실패', '설문 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>프로필 설정</Text>
          <Text style={styles.subtitle}>독서 취향을 알려주시면 책을 추천해 드려요!</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.card}>
            <Text style={styles.label}>닉네임</Text>
            <Input 
              placeholder="사용하실 닉네임을 입력하세요"
              value={nickname}
              onChangeText={setNickname}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>월간 독서량은 어떻게 되시나요?</Text>
            <View style={styles.selectionContainer}>
              {READING_AMOUNTS.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[styles.chip, readingAmount === amount && styles.chipSelected]}
                  onPress={() => setReadingAmount(amount)}
                >
                  <Text style={[styles.chipText, readingAmount === amount && styles.chipTextSelected]}>
                    {amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>선호하는 카테고리를 모두 선택해주세요.</Text>
            <View style={styles.selectionContainer}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[styles.chip, selectedCategories.includes(category) && styles.chipSelected]}
                  onPress={() => handleToggleCategory(category)}
                >
                  <Text style={[styles.chipText, selectedCategories.includes(category) && styles.chipTextSelected]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>자신의 독서 스타일을 자유롭게 알려주세요. (선택)</Text>
            <Input 
              placeholder="예: 출퇴근길에 가볍게 읽어요, 주말에 몰아서 읽는 편이에요."
              value={readingStyle}
              onChangeText={setReadingStyle}
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
          </View>
          
          <Button style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>제출하고 시작하기</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 28,
    paddingBottom: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: '#6b7280',
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 24,
  },
  form: {
    padding: 20,
    gap: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    gap: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  label: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  selectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: '#f9fafb',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  chipSelected: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  chipText: {
    color: '#374151',
    fontWeight: '500',
    fontSize: 15,
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  submitButton: {
    height: 56,
    justifyContent: 'center',
    marginTop: 8,
    borderRadius: 12,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.3,
  },
});
