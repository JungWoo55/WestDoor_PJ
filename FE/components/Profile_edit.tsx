
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
import { useBooks } from '../contexts/BookContext'; // 컨텍스트 훅 임포트

const allGenres = ["소설", "자기계발", "에세이", "과학", "역사", "IT/기술", "경제", "인문"];

export function Profile_edit() {
  const insets = useSafeAreaInsets();
  const { userProfile, updateUserProfile } = useBooks();

  // 컨텍스트의 userProfile로 내부 상태 초기화
  const [nickname, setNickname] = useState(userProfile?.nickname || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [selectedGenres, setSelectedGenres] = useState(userProfile?.favoriteGenres || []);
  const [readingGoal, setReadingGoal] = useState(userProfile?.readingGoal.toString() || '0');

  // 컨텍스트의 프로필이 변경될 때 상태를 동기화 (선택적)
  useEffect(() => {
    if (userProfile) {
      setNickname(userProfile.nickname);
      setBio(userProfile.bio);
      setSelectedGenres(userProfile.favoriteGenres);
      setReadingGoal(userProfile.readingGoal.toString());
    }
  }, [userProfile]);

  // 변경 여부 확인
  const isChanged = useMemo(() => {
    if (!userProfile) return false;
    return (
      nickname !== userProfile.nickname ||
      bio !== userProfile.bio ||
      readingGoal !== userProfile.readingGoal.toString() ||
      JSON.stringify(selectedGenres.sort()) !== JSON.stringify(userProfile.favoriteGenres.sort())
    );
  }, [nickname, bio, readingGoal, selectedGenres, userProfile]);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSave = () => {
    const newProfile = {
      nickname,
      bio,
      favoriteGenres: selectedGenres,
      readingGoal: parseInt(readingGoal, 10) || 0,
    };
    updateUserProfile(newProfile);
    Alert.alert("저장 완료", "프로필 정보가 성공적으로 업데이트되었습니다.");
  };

  // ... (나머지 핸들러 함수들은 동일) ...
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

      {/* 프로필 정보 섹션 */}
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
        <View style={styles.inputGroup}>
          <Text style={styles.label}>자기소개</Text>
          <Input value={bio} onChangeText={setBio} placeholder="한 줄로 자신을 소개해보세요" multiline />
        </View>
      </Card>

      {/* 독서 취향 섹션 */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>독서 취향</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>선호 장르 (여러 개 선택 가능)</Text>
          <View style={styles.genresContainer}>
            {allGenres.map((genre) => (
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
          <Text style={styles.label}>올해의 독서 목표 (권)</Text>
          <Input value={readingGoal} onChangeText={setReadingGoal} placeholder="예: 50" keyboardType="number-pad" />
        </View>
      </Card>

      {/* 계정 관리 섹션 */}
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
  container: { flex: 1, backgroundColor: '#f9fafb', paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  card: { padding: 24, marginBottom: 24, backgroundColor: '#fff' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  profileAvatar: { height: 100, width: 100, borderRadius: 50, backgroundColor: '#60a5fa' },
  cameraIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#e5e7eb',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  genresContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  genreChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#f3f4f6' },
  genreChipSelected: { backgroundColor: '#16a34a' },
  genreText: { color: '#374151', fontWeight: '500' },
  genreTextSelected: { color: '#fff' },
  emailText: { fontSize: 16, color: '#6b7280' },
  menuItem: { paddingVertical: 4 },
  menuItemLabel: { fontSize: 16, color: '#111827' },
  destructiveText: { color: '#dc2626' },
});
