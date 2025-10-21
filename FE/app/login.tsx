
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Feather } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = () => {
    // TODO: Implement actual login logic
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
        <Text style={styles.title}>로그인</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>이메일</Text>
          <Input placeholder="you@example.com" keyboardType="email-address" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>비밀번호</Text>
          <Input placeholder="••••••••" secureTextEntry />
        </View>
        
        <Button style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>로그인</Text>
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
