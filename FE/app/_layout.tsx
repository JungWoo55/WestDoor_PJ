
import { Stack } from "expo-router";
import { BookProvider } from "../contexts/BookContext";
import { useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  useEffect(() => {
    const clearStorage = async () => {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('accessToken');
    };
    clearStorage();
  }, []);

  return (
    <BookProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </BookProvider>
  );
}