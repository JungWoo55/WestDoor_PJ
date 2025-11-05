import React, { useState, useMemo, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Avatar } from './ui/Avatar';
import { Input } from './ui/Input';
import { Separator } from './ui/Separator';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBooks } from '../contexts/BookContext';
import { getMySurvey, updateSurvey } from '../api/survey';
import { refresh, updateProfile } from '../api/auth';
import { useRouter } from 'expo-router';

const CATEGORIES = [
  '건강', '경제/경영', '과학', '기술', '만화', '소설', '시/에세이', '어린이/초등', 
  '여행', '역사', '대중문화', '외국어', '요리', '인문', '자기계발', '유아', 
  '잡지', '정치사회', '종교', '청소년', 'IT', '취미/스포츠'
];
const readingAmounts = ["안읽음", "1~2권", "3권 이상"];

const getReadingAmountIndex = (amount: number | undefined) => {
  if (amount === 0) return 0; // "안읽음"
  if (amount === 1) return 1; // "1~2권"
  if (amount === 3) return 2; // "3권 이상"
  return null; // 기본값 또는 유효하지 않은 경우
};

export function Profile_edit() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userProfile, reloadUserProfile, updateUserProfile } = useBooks();

  const [nickname, setNickname] = useState(userProfile?.nickname || '');
  const [selectedGenres, setSelectedGenres] = useState(userProfile?.favoriteGenres || []);
  const [readingAmount, setReadingAmount] = useState<number | null>(getReadingAmountIndex(userProfile?.readingAmount));
  const [readingStyle, setReadingStyle] = useState(userProfile?.readingStyle || '');
  const [readingGoal, setReadingGoal] = useState(userProfile?.readingGoal?.toString() || '');

  useEffect(() => {
    if (userProfile) {
      setNickname(userProfile?.nickname);
      setSelectedGenres(userProfile.favoriteGenres);
      setReadingAmount(getReadingAmountIndex(userProfile.readingAmount));
      setReadingStyle(userProfile.readingStyle);
      setReadingGoal(userProfile.readingGoal?.toString() || '');
    }
  }, [userProfile]);

  const isChanged = useMemo(() => {
    if (!userProfile) return false;
    const currentReadingAmount = userProfile.readingAmount !== undefined ? userProfile.readingAmount : null;
    return (
      nickname !== userProfile.nickname ||
      readingAmount !== currentReadingAmount ||
      readingStyle !== userProfile.readingStyle ||
      readingGoal !== userProfile.readingGoal?.toString() ||
      JSON.stringify(selectedGenres.sort()) !== JSON.stringify(userProfile.favoriteGenres.sort())
    );
  }, [nickname, selectedGenres, readingAmount, readingStyle, readingGoal, userProfile]);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSave = async () => {
    if (!userProfile) return;

    try {
      // 1. auth API 호출
      await updateProfile(nickname, parseInt(readingGoal, 10) || 0);

      // 2. AsyncStorage 직접 업데이트
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const updatedUser = { 
          ...parsedUser, 
          nickname: nickname, 
          goal: parseInt(readingGoal, 10) || 0 
        };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }

      // 3. survey API 호출
      await updateSurvey({
        readingAmount: readingAmount !== null ? readingAmounts[readingAmount] : null, 
        selectedCategories: selectedGenres,
        readingStyle,
      });

      // 4. 성공 시 프로필 리로드 및 뒤로가기
      await reloadUserProfile();
      Alert.alert("저장 완료", "프로필 정보가 성공적으로 업데이트되었습니다.", [
        { text: "확인", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert("오류", "프로필 업데이트 중 오류가 발생했습니다.");
    }
  };

  const handleImagePicker = () => {
    Alert.alert("프로필 사진 변경", "이미지 라이브러리를 여는 기능이 여기에 추가됩니다.");
  };
  const handlePasswordChange = () => {
    Alert.alert("비밀번호 변경", "비밀번호 변경 화면으로 이동하는 기능이 여기에 추가됩니다.");
  };
  const handleAccountDelete = () => {
    Alert.alert(
      "회원 탈퇴",
      "정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        { text: "삭제", onPress: () => console.log("Account deletion requested"), style: "destructive" },
      ]
    );
  };

  if (!userProfile) {
    return <Text>프로필 정보를 불러오는 중입니다...</Text>;
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>프로필 수정</Text>
        <Button size="sm" onPress={handleSave} disabled={!isChanged}>
          저장
        </Button>
      </View>

      <Card style={styles.card}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handleImagePicker}>
            <Avatar style={styles.profileAvatar}>
              <Feather name="user" size={50} color="white" />
            </Avatar>
            <View style={styles.cameraIconWrapper}>
              <Feather name="camera" size={16} color="#374151" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>닉네임</Text>
          <Input value={nickname} onChangeText={setNickname} placeholder="닉네임을 입력하세요" />
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>독서 취향</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>목표 독서량</Text>
          <Input value={readingGoal} onChangeText={setReadingGoal} placeholder="목표 독서량을 입력하세요" keyboardType="number-pad" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>월간 독서량</Text>
          <View style={styles.genresContainer}>
            {readingAmounts.map((amount, index) => (
              <TouchableOpacity
                key={amount}
                style={[styles.genreChip, readingAmount === index && styles.genreChipSelected]}
                onPress={() => setReadingAmount(index)}
              >
                <Text style={[styles.genreText, readingAmount === index && styles.genreTextSelected]}>
                  {amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>선호 장르 (여러 개 선택 가능)</Text>
          <View style={styles.genresContainer}>
            {CATEGORIES.map((genre) => (
              <TouchableOpacity
                key={genre}
                style={[styles.genreChip, selectedGenres.includes(genre) && styles.genreChipSelected]}
                onPress={() => handleGenreToggle(genre)}
              >
                <Text style={[styles.genreText, selectedGenres.includes(genre) && styles.genreTextSelected]}>
                  {genre}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>독서 스타일</Text>
          <Input value={readingStyle} onChangeText={setReadingStyle} placeholder="독서 스타일을 입력하세요" multiline />
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>계정 관리</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>이메일 주소</Text>
          <Text style={styles.emailText}>{userProfile.email}</Text>
        </View>
        <Separator style={{ marginVertical: 16 }} />
        <TouchableOpacity onPress={handlePasswordChange} style={styles.menuItem}>
          <Text style={styles.menuItemLabel}>비밀번호 변경</Text>
        </TouchableOpacity>
        <Separator style={{ marginVertical: 16 }} />
        <TouchableOpacity onPress={handleAccountDelete} style={styles.menuItem}>
          <Text style={[styles.menuItemLabel, styles.destructiveText]}>회원 탈퇴</Text>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa', paddingHorizontal: 20 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: 20,
    paddingTop: 24,
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  card: { 
    padding: 24, 
    marginBottom: 20, 
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  cardTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    marginBottom: 20,
    color: '#111827',
    letterSpacing: -0.3,
  },
  avatarSection: { alignItems: 'center', marginBottom: 28 },
  profileAvatar: { 
    height: 108, 
    width: 108, 
    borderRadius: 54, 
    backgroundColor: '#16a34a',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  cameraIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: { marginBottom: 24 },
  label: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#374151', 
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  genresContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  genreChip: { 
    paddingVertical: 10, 
    paddingHorizontal: 18, 
    borderRadius: 24, 
    backgroundColor: '#f9fafb',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  genreChipSelected: { 
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  genreText: { color: '#374151', fontWeight: '500', fontSize: 14 },
  genreTextSelected: { color: '#fff', fontWeight: '600' },
  emailText: { fontSize: 16, color: '#6b7280', fontWeight: '400' },
  menuItem: { paddingVertical: 6 },
  menuItemLabel: { fontSize: 16, color: '#111827', fontWeight: '500' },
  destructiveText: { color: '#dc2626', fontWeight: '600' },
});