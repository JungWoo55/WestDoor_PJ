
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Button } from '../components/ui/Button';
import { FontAwesome5 } from '@expo/vector-icons';

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={['#f0fdf4', '#ffffff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="door-open" size={56} color="#16a34a" />
            </View>
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 72,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  appName: {
    fontSize: 52,
    fontWeight: '800',
    color: '#111827',
    marginTop: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: '#6b7280',
    marginTop: 12,
    fontWeight: '400',
  },
  buttonContainer: {
    width: '100%',
    gap: 14,
    paddingHorizontal: 8,
  },
  button: {
    height: 56,
    justifyContent: 'center',
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.3,
  },
  outlineButtonText: {
    color: '#16a34a',
    fontWeight: '600',
  },
});
