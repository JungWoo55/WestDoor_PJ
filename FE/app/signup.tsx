
import React, { useState, useTransition } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Feather } from '@expo/vector-icons';
import api from '@/api';

export default function SignUpScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUp = () => {
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    startTransition(async () => {
      try {
        const { name, email, password } = formData;
        await api.post('/auth/signup', { name, email, password });
        router.replace('/login');
      } catch (e: any) {
        setError(e.response?.data?.error?.reason || "회원가입에 실패했어요.");
      }
    });
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
          <Input 
            placeholder="홍길동" 
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}  
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>이메일</Text>
          <Input 
            placeholder="you@example.com" 
            keyboardType="email-address" 
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}  
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>비밀번호</Text>
          <View style={styles.passwordInputContainer}>
            <Input 
              placeholder="••••••••" 
              secureTextEntry={!showPassword} 
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              style={styles.passwordInput}
            />
            <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} style={styles.passwordToggle}>
              <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <View style={styles.passwordInputContainer}>
            <Input 
              placeholder="••••••••" 
              secureTextEntry={!showConfirmPassword} 
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}  
              style={styles.passwordInput}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword((prev) => !prev)} style={styles.passwordToggle}>
              <Feather name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Button 
          style={styles.signupButton} 
          onPress={handleSignUp}
          disabled={isPending}
        >
          <Text style={styles.signupButtonText}>
            {isPending ? "회원가입 중..." : "회원가입"}
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
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 50, // Make space for the eye icon
  },
  passwordToggle: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  signupButton: {
    height: 56,
    justifyContent: 'center',
    marginTop: 8,
    borderRadius: 12,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.3,
  },
});
