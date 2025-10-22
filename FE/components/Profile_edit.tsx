
import React, { useState, useMemo } from 'react';
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

// 가상의 현재 사용자 정보
const currentUser = {
  email: 'bookworm@example.com',
  nickname: '독서광',
  bio: '책 읽는 것을 좋아합니다.',
  favoriteGenres: ['소설', '자기계발'],
  readingGoal: 50,
};

const allGenres = ["소설", "자기계발", "에세이", "과학", "역사", "IT/기술", "경제", "인문"];

export function Profile_edit() {
  const insets = useSafeAreaInsets();

  // 수정 가능한 상태들
  const [nickname, setNickname] = useState(currentUser.nickname);
  const [bio, setBio] = useState(currentUser.bio);
  const [selectedGenres, setSelectedGenres] = useState(currentUser.favoriteGenres);
  const [readingGoal, setReadingGoal] = useState(currentUser.readingGoal.toString());

  // 변경 여부 확인 (저장 버튼 활성화용)
  const isChanged = useMemo(() => {
    return (
      nickname !== currentUser.nickname ||
      bio !== currentUser.bio ||
      readingGoal !== currentUser.readingGoal.toString() ||
      JSON.stringify(selectedGenres.sort()) !== JSON.stringify(currentUser.favoriteGenres.sort())
    );
  }, [nickname, bio, readingGoal, selectedGenres]);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleImagePicker = () => {
    // TODO: 이미지 피커 라이브러리 연동 (e.g., expo-image-picker)
    Alert.alert("프로필 사진 변경", "이미지 라이브러리를 여는 기능이 여기에 추가됩니다.");
  };

  const handlePasswordChange = () => {
    // TODO: 비밀번호 변경 화면으로 이동
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

  const handleSave = () => {
    // TODO: 변경된 정보를 서버에 저장하는 API 호출
    console.log({ nickname, bio, selectedGenres, readingGoal });
    Alert.alert("저장 완료", "프로필 정보가 성공적으로 업데이트되었습니다.");
  };

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
          <Text style={styles.emailText}>{currentUser.email}</Text>
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
