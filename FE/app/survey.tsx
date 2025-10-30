
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const READING_AMOUNTS = ['안읽음', '1~2권', '3권 이상'];
const CATEGORIES = [
  '건강', '경제/경영', '과학', '기술', '만화', '소설', '시/에세이', '어린이/초등', 
  '여행', '역사', '대중문화', '외국어', '요리', '인문', '자기계발', '유아', 
  '잡지', '정치사회', '종교', '청소년', 'IT', '취미/스포츠'
];

export default function SurveyScreen() {
  const router = useRouter();
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
    // TODO: Implement API call to submit survey data
    console.log({ nickname, readingAmount, selectedCategories, readingStyle });

    if (!nickname || !readingAmount || selectedCategories.length === 0) {
      Alert.alert('입력 필요', '닉네임, 월간 독서량, 선호 카테고리는 필수 항목입니다.');
      return;
    }

    Alert.alert('제출 완료', '설문이 제출되었습니다.', [
      { text: 'OK', onPress: () => router.replace('/(tabs)') },
    ]);
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
    backgroundColor: '#f9fafb', // Light gray background
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  selectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chipSelected: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  chipText: {
    color: '#374151',
    fontWeight: '500',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    height: 52,
    justifyContent: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
