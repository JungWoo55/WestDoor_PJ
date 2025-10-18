
import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { Separator } from './ui/Separator';
import { Feather, FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';


import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function Profile() {
  const insets = useSafeAreaInsets();
  const userStats = [
    { label: "읽은 책", value: "24권", icon: () => <FontAwesome5 name="book-open" size={20} color="#16a34a" /> },
    { label: "독서 목표", value: "80%", icon: () => <Feather name="target" size={20} color="#16a34a" /> },
    { label: "획득 배지", value: "12개", icon: () => <FontAwesome5 name="award" size={20} color="#16a34a" /> }
  ];

  const menuItems = [
    { icon: () => <Feather name="bell" size={20} color="#374151" />, label: "알림 설정", action: () => {} },
    { icon: () => <Feather name="shield" size={20} color="#374151" />, label: "개인정보 보호", action: () => {} },
    { icon: () => <Feather name="help-circle" size={20} color="#374151" />, label: "도움말", action: () => {} },
    { icon: () => <Feather name="log-out" size={20} color="#dc2626" />, label: "로그아웃", action: () => {}, variant: "destructive" as const }
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
            <Text style={styles.profileName}>독서광</Text>
            <Text style={styles.profileEmail}>bookworm@example.com</Text>
            <Badge variant="secondary">레벨 5 독서가</Badge>
          </View>
        </View>
        <Button variant="outline">프로필 수정</Button>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>독서 통계</Text>
        <View style={styles.statsContainer}>
          {userStats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <View style={styles.statIconContainer}>{stat.icon()}</View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>선호 장르</Text>
        <View style={styles.genresContainer}>
          {["소설", "자기계발", "에세이", "과학", "역사", "IT/기술"].map((genre) => (
            <Badge key={genre} variant="outline">{genre}</Badge>
          ))}
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
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  card: { padding: 24, marginBottom: 24 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  profileInfoContainer: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  profileAvatar: { height: 80, width: 80, borderRadius: 40, backgroundColor: '#60a5fa' },
  profileName: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  profileEmail: { fontSize: 14, color: '#6b7280', marginBottom: 8 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', gap: 16 },
  statItem: { alignItems: 'center', gap: 4 },
  statIconContainer: { height: 48, width: 48, borderRadius: 24, backgroundColor: 'rgba(22, 163, 74, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#6b7280' },
  genresContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  menuItemContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuItemLabel: { fontSize: 16 },
  destructiveText: { color: '#dc2626' },
  footer: { marginTop: 24, paddingBottom: 24, alignItems: 'center' },
  footerText: { fontSize: 12, color: '#9ca3af' },
});
