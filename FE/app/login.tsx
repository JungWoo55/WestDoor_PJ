
import React, { useState, useTransition } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Feather } from '@expo/vector-icons';
import api from '@/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()


  const handleLogin = () => {
    setError(null)
    startTransition(async () => {
      try {
        const response = await api.post('/auth/login', { email, password });
        const user = response.data.success; // 백엔드 응답 구조에 따라 조정
        if (user?.id) {
          await AsyncStorage.setItem("userid", String(user.id));
        }
        
        if (user?.isCompleted === false) {
            router.replace("/survey"); //설문 창으로 라우터 변경해야함
        } else{
          router.replace("/(tabs)");
        }
      } catch (e: any) {
        console.log('Login Error:', JSON.stringify(e, null, 2));
        setError(e.response?.data?.error?.reason || "로그인에 실패했어요. 다시 시도해주세요.");
        }
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
  errorContainer: {
    padding: 10,
    backgroundColor: '#FFEBEE', 
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10, 
  },
  errorText: {
    color: '#D32F2F', 
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
