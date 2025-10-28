
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '../components/ui/Button';
import { FontAwesome5 } from '@expo/vector-icons';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <FontAwesome5 name="door-open" size={48} color="#16a34a" />
          <Text style={styles.appName}>BookMind</Text>
          <Text style={styles.subtitle}>당신의 독서 여정을 함께합니다</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Link href="/login" asChild>
            <Button style={styles.button}>
              <Text style={styles.buttonText}>로그인</Text>
            </Button>
          </Link>
          <Link href="/signup" asChild>
            <Button variant="outline" style={styles.button}>
              <Text style={[styles.buttonText, styles.outlineButtonText]}>회원가입</Text>
            </Button>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 64,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 8,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    height: 52,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  outlineButtonText: {
    color: '#16a34a',
  },
});
