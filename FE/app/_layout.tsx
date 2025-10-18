
import { Stack } from "expo-router";
import { BookProvider } from "../contexts/BookContext";

export default function RootLayout() {
  return (
    <BookProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </BookProvider>
  );
}

