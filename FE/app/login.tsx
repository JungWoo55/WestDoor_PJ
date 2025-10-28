
import React, { useState, useTransition } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Feather } from '@expo/vector-icons';
import {apiClient} from "@/api/client";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()


  const handleLogin = () => {
    // TODO: Implement actual login logic
    // On success, navigate to the main app and replace the history stack
    setError(null)
    startTransition(async () => {
      const res = await apiClient.login(email, password)
      if (!res.success) {
        setError(res.error || "로그인에 실패했어요. 다시 시도해주세요.")
        return
      }
      if (!res.success) {
        // res.error는 백엔드가 보낸 에러 메시지일 것입니다.
        setError(res.error || "이메일 또는 비밀번호가 일치하지 않습니다.");
        return; // 👈 함수를 중단합니다.
      }
      
      // 💡 2. (선택적) data가 null인지 한 번 더 확인합니다.
      const data = (res as any).success;
      if (!data) {
        setError("사용자 정보를 불러오지 못했습니다.");
        return;
      }
      // const data = (res as any).data;
      const user = data.user;
      const tokens = data.tokens;
      if (user?.id) {
        await AsyncStorage.setItem("userid", String(user.id))
      }
      if (tokens?.access) {
        await AsyncStorage.setItem("accessToken", tokens.access)
      }
      if (tokens?.refresh) {
        await AsyncStorage.setItem("refreshToken", tokens.refresh)
      }
      // if (user?.is_completed === false) {
      //   router.replace("/forms");
      // } else{
      router.replace("/(tabs)");
      // }
    })
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Feather name="chevron-left" size={24} color="#111827" />
          </TouchableOpacity>
        </Link>
        <Text style={styles.title}>로그인</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>이메일</Text>
          <Input 
            placeholder="you@example.com" 
            keyboardType="email-address" 
            value= {email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>비밀번호</Text>
          <Input 
            placeholder="••••••••" 
            secureTextEntry 
            value ={password}
            onChangeText={setPassword}
          />
        </View>
        {/* 👇 🌟🌟🌟 이 블록을 추가하세요 🌟🌟🌟
          error state에 값이 있으면(null이 아니면) 에러 메시지를 렌더링합니다.
        */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        <Button 
          style={styles.loginButton} 
          onPress={handleLogin}
          disabled={isPending} 
        >
          <Text style={styles.loginButtonText}>
            {isPending ? "로그인 중..." : "로그인"}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 👇 에러 메시지를 위한 스타일 추가
  errorContainer: {
    padding: 10,
    backgroundColor: '#FFEBEE', // 붉은 배경
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10, // 버튼과의 간격
  },
  errorText: {
    color: '#D32F2F', // 붉은 텍스트
    fontSize: 14,
    fontWeight: '500',
  },
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
  loginButton: {
    height: 52,
    justifyContent: 'center',
    marginTop: 16,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
