
import React, { useState, useTransition } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Feather } from '@expo/vector-icons';
import api from '@/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBooks } from '../contexts/BookContext';
import { getMySurvey } from '../api/survey';

export default function LoginScreen() {
  const router = useRouter();
  const { reloadUserProfile } = useBooks();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()


  const handleLogin = () => {
    setError(null)
    startTransition(async () => {
      try {
        const loginResponse = await api.post('/auth/login', { email, password });
        console.log('login')
        const user = loginResponse.data.success;

        if (user.isCompleted === true) {
            console.log('true')
            const surveyResponse = await getMySurvey();
            console.log(surveyResponse)
            console.log()
            const surveyData = surveyResponse.success;

            const completeProfile = {
              ...user,
              favoriteGenres: surveyData.category || [],
              readingAmount: surveyData.amount,
              readingStyle: surveyData.style,
            };
            console.log(surveyData)

            await AsyncStorage.setItem("user", JSON.stringify(user));
            await AsyncStorage.setItem("user", JSON.stringify(completeProfile));
            await reloadUserProfile();

          if (completeProfile == null) {
            await AsyncStorage.setItem("user", JSON.stringify(user));
            await reloadUserProfile();
          }
        }
        
        if (user?.isCompleted === false) {
            await AsyncStorage.setItem("user", JSON.stringify(user));
            await reloadUserProfile();
            router.replace("/survey");
        } 
        else{
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
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
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
    padding: 14,
    backgroundColor: '#FEF2F2', 
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  errorText: {
    color: '#DC2626', 
    fontSize: 14,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#ffffff',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  form: {
    padding: 24,
    gap: 20,
  },
  inputGroup: {
    gap: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  loginButton: {
    height: 56,
    justifyContent: 'center',
    marginTop: 8,
    borderRadius: 12,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.3,
  },
});
