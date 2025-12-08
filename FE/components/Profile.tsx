import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { Separator } from './ui/Separator';
import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBooks } from '../contexts/BookContext';
import { logout} from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userProfile, countedBooks, reloadUserProfile, clearUserProfile } = useBooks();

  // 화면 포커스 시 사용자 프로필 다시 로드
  useFocusEffect(
    React.useCallback(() => {
      reloadUserProfile();
      console.log('profile')
    }, [reloadUserProfile])
  );

  const handleLogout = async () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              await AsyncStorage.removeItem('user');
              clearUserProfile();
              router.replace('/');
            } catch (error) {
              console.error('Logout error:', error);
              // 에러가 발생해도 로컬에서 로그아웃 처리
              await AsyncStorage.removeItem('user');
              clearUserProfile();
              router.replace('/');
            }
          },
        },
      ]
    );
  };

  // 프로필 정보가 없을 경우 로딩 또는 에러 처리
  if (!userProfile) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>프로필 정보를 불러오지 못했습니다.</Text>
      </View>
    );
  }

  const readingAmountMap: { [key: number]: string } = {
    0: '안읽음',
    1: '1~2권',
    3: '3권 이상',
  };

  const userStats = [
    { label: "읽은 책", value: `${(countedBooks?.length || 0)}권` },
    { label: "목표 독서량", value: `${userProfile.readingGoal || 0}권` },
    { label: "월간 독서량", value: readingAmountMap[userProfile.readingAmount] || '정보 없음' },
  ];

  const menuItems = [
    { icon: () => <Feather name="bell" size={20} color="#374151" />, label: "알림 설정", action: () => {} },
    { icon: () => <Feather name="shield" size={20} color="#374151" />, label: "개인정보 보호", action: () => {} },
    { icon: () => <Feather name="help-circle" size={20} color="#374151" />, label: "도움말", action: () => {} },
    { icon: () => <Feather name="log-out" size={20} color="#dc2626" />, label: "로그아웃", action: handleLogout, variant: "destructive" as const }
  ];

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Feather name="user" size={20} color="#16a34a" />
        <Text style={styles.headerTitle}>내 정보</Text>
      </View>

      <Card style={styles.card}>
        <View style={styles.profileInfoContainer}>
          <Avatar style={styles.profileAvatar}>
            <Feather name="user" size={40} color="white" />
          </Avatar>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>
              {userProfile.nickname || (userProfile as any).name || '사용자'}
            </Text>
            <Text style={styles.profileEmail}>{userProfile.email}</Text>
          </View>
        </View>
        <Button variant="outline" onPress={() => router.push('/profile-edit')}>프로필 수정</Button>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>독서 통계</Text>
        <View style={styles.statsContainer}>
          {userStats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <FontAwesome5 name="book-open" size={20} color="#16a34a" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>선호 카테고리</Text>
        <View style={styles.genresContainer}>
          {userProfile.favoriteGenres && userProfile.favoriteGenres.length > 0 ? (
            userProfile.favoriteGenres.map((genre) => (
              <Badge key={genre} variant="outline">{genre}</Badge>
            ))
          ) : (
            <Text style={styles.noGenresText}>선호하는 카테고리가 없습니다.</Text>
          )}
        </View>
      </Card>
      
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>독서 스타일</Text>
        <View style={styles.genresContainer}>
          {userProfile.readingStyle ? (
            <Text variant="outline">{userProfile.readingStyle}</Text>
          ) : (
            <Text style={styles.noGenresText}>독서 스타일이 지정되지 않았습니다.</Text>
          )}
        </View>
      </Card>

      <Card style={{ padding: 0 }}>
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            <TouchableOpacity onPress={item.action} style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                {item.icon()}
                <Text style={[styles.menuItemLabel, item.variant === 'destructive' && styles.destructiveText]}>
                  {item.label}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </TouchableOpacity>
            {index < menuItems.length - 1 && <Separator style={{ marginHorizontal: 16 }} />} 
          </React.Fragment>
        ))}
      </Card>

      <View style={styles.footer}>
        <Text style={styles.footerText}>버전 1.0.0</Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24, paddingTop: 8 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#111827', letterSpacing: -0.5 },
  card: { padding: 24, marginBottom: 20, borderRadius: 16 },
  cardTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20, color: '#111827', letterSpacing: -0.3 },
  profileInfoContainer: { flexDirection: 'row', alignItems: 'center', gap: 18, marginBottom: 20 },
  profileAvatar: { 
    height: 88, 
    width: 88, 
    borderRadius: 44, 
    backgroundColor: '#16a34a',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  profileName: { fontSize: 22, fontWeight: '700', marginBottom: 6, color: '#111827', letterSpacing: -0.3 },
  profileEmail: { fontSize: 15, color: '#6b7280', marginBottom: 10 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', gap: 20, paddingVertical: 8 },
  statItem: { alignItems: 'center', gap: 10, minWidth: 80 },
  statValue: { fontSize: 24, fontWeight: '700', color: '#16a34a', letterSpacing: -0.5 },
  statLabel: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  genresContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  noGenresText: { color: '#9ca3af', fontSize: 14, fontStyle: 'italic' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18 },
  menuItemContent: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  menuItemLabel: { fontSize: 16, fontWeight: '500', color: '#374151' },
  destructiveText: { color: '#dc2626', fontWeight: '600' },
  footer: { marginTop: 32, paddingBottom: 32, alignItems: 'center' },
  footerText: { fontSize: 13, color: '#9ca3af', fontWeight: '400' },
});
