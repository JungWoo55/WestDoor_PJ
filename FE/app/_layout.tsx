
import { Stack } from "expo-router";
import { BookProvider } from "../contexts/BookContext";

export default function RootLayout() {
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