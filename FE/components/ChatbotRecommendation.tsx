
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { Avatar } from './ui/Avatar';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  bookRecommendation?: {
    title: string;
    author: string;
    reason: string;
  };
}

export function ChatbotRecommendation() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "안녕하세요! 저는 당신의 독서 취향을 분석하여 최적의 책을 추천해드리는 AI 어시스턴트입니다. 어떤 책을 찾고 계신가요?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Mock AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: "좋은 선택이세요! 당신의 취향을 바탕으로 다음 책을 추천드립니다:",
        sender: "bot",
        timestamp: new Date(),
        bookRecommendation: {
          title: "1984",
          author: "조지 오웰",
          reason: "당신이 관심있어하는 주제와 잘 맞는 디스토피아 소설입니다. 사회 비판적 시각과 깊이있는 철학적 주제를 다룹니다."
        }
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const suggestedQuestions = [
    "최근 베스트셀러 추천해줘",
    "감동적인 소설 찾아줘",
    "자기계발서 추천해줘",
    "가볍게 읽을 책 알려줘"
  ];

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top }]} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100} // Adjust this value as needed
    >
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={{ padding: 16, gap: 16 }}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[styles.messageRow, message.sender === 'user' && styles.userMessageRow]}
          >
            <Avatar style={[styles.avatar, message.sender === 'user' && styles.userAvatar]}>
              {message.sender === 'bot' ? (
                <FontAwesome5 name="robot" size={16} color="white" />
              ) : (
                <Feather name="user" size={16} color="#374151" />
              )}
            </Avatar>
            
            <View style={[styles.bubble, message.sender === 'user' ? styles.userBubble : styles.botBubble]}>
              <Text style={message.sender === 'user' ? styles.userText : styles.botText}>{message.text}</Text>
              {message.bookRecommendation && (
                <Card style={styles.recCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                    <Ionicons name="sparkles" size={16} color="#f59e0b" style={{ marginTop: 2 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.recTitle}>{message.bookRecommendation.title}</Text>
                      <Text style={styles.recAuthor}>{message.bookRecommendation.author}</Text>
                    </View>
                  </View>
                  <Text style={styles.recReason}>{message.bookRecommendation.reason}</Text>
                  <Button size="sm" style={{ marginTop: 12 }}>상세 정보 보기</Button>
                </Card>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {messages.length <= 1 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>추천 질문:</Text>
          <View style={styles.suggestionsGrid}>
            {suggestedQuestions.map((q, i) => (
              <Button key={i} variant="outline" size="sm" onPress={() => setInputValue(q)} style={styles.suggestionButton}>
                <Text style={styles.suggestionText}>{q}</Text>
              </Button>
            ))}
          </View>
        </View>
      )}

      <View style={styles.inputContainer}>
        <Input
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="원하는 책이나 관심사를 입력하세요..."
          style={{ flex: 1 }}
          onSubmitEditing={handleSend} // Send on keyboard submit
        />
        <Button onPress={handleSend} size="icon">
          <Feather name="send" size={16} color="white" />
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  messagesContainer: { flex: 1 },
  messageRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-end' },
  userMessageRow: { flexDirection: 'row-reverse' },
  avatar: { height: 32, width: 32, borderRadius: 16, backgroundColor: '#16a34a' },
  userAvatar: { backgroundColor: '#f3f4f6' },
  bubble: { padding: 12, borderRadius: 18, maxWidth: '80%' },
  botBubble: { backgroundColor: '#f3f4f6', borderBottomLeftRadius: 4 },
  userBubble: { backgroundColor: '#16a34a', borderBottomRightRadius: 4 },
  botText: { color: '#111827', fontSize: 15 },
  userText: { color: '#ffffff', fontSize: 15 },
  recCard: { marginTop: 12, backgroundColor: '#fff', padding: 12 },
  recTitle: { fontWeight: 'bold', marginBottom: 2 },
  recAuthor: { fontSize: 12, color: '#6b7280', marginBottom: 8 },
  recReason: { fontSize: 14 },
  suggestionsContainer: { paddingHorizontal: 16, paddingBottom: 8 },
  suggestionsTitle: { fontSize: 14, color: '#6b7280', marginBottom: 8 },
  suggestionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  suggestionButton: { paddingVertical: 8, height: 'auto' },
  suggestionText: { flexShrink: 1, fontSize: 12 },
  inputContainer: { flexDirection: 'row', gap: 8, padding: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb', backgroundColor: '#fff' },
});
