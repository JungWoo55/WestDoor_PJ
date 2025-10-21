
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Feather } from '@expo/vector-icons';

export default function SignUpScreen() {
  const router = useRouter();

  const handleSignUp = () => {
    // TODO: Implement actual sign-up logic
    // On success, navigate to the main app and replace the history stack
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Feather name="chevron-left" size={24} color="#111827" />
          </TouchableOpacity>
        </Link>
        <Text style={styles.title}>회원가입</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>이름</Text>
          <Input placeholder="홍길동" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>이메일</Text>
          <Input placeholder="you@example.com" keyboardType="email-address" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>비밀번호</Text>
          <Input placeholder="••••••••" secureTextEntry />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <Input placeholder="••••••••" secureTextEntry />
        </View>
        
        <Button style={styles.signupButton} onPress={handleSignUp}>
          <Text style={styles.signupButtonText}>회원가입</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    position: 'absolute',
    left: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  form: {
    padding: 24,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  signupButton: {
    height: 52,
    justifyContent: 'center',
    marginTop: 16,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
