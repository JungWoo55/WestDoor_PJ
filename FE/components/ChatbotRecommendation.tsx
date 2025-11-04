
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
        contentContainerStyle={{ padding: 20, paddingBottom: 24 }}
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
  container: { flex: 1, backgroundColor: '#fafafa' },
  messagesContainer: { flex: 1 },
  messageRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-end', marginBottom: 12 },
  userMessageRow: { flexDirection: 'row-reverse' },
  avatar: { 
    height: 36, 
    width: 36, 
    borderRadius: 18, 
    backgroundColor: '#16a34a',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  userAvatar: { 
    backgroundColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bubble: { padding: 14, borderRadius: 20, maxWidth: '80%' },
  botBubble: { 
    backgroundColor: '#ffffff', 
    borderBottomLeftRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  userBubble: { 
    backgroundColor: '#16a34a', 
    borderBottomRightRadius: 6,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  botText: { color: '#111827', fontSize: 15, lineHeight: 22, fontWeight: '400' },
  userText: { color: '#ffffff', fontSize: 15, lineHeight: 22, fontWeight: '400' },
  recCard: { 
    marginTop: 14, 
    backgroundColor: '#f9fafb', 
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  recTitle: { fontWeight: '700', marginBottom: 4, fontSize: 16, color: '#111827' },
  recAuthor: { fontSize: 13, color: '#6b7280', marginBottom: 10, fontWeight: '500' },
  recReason: { fontSize: 14, color: '#374151', lineHeight: 20 },
  suggestionsContainer: { paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8 },
  suggestionsTitle: { fontSize: 14, color: '#6b7280', marginBottom: 12, fontWeight: '600' },
  suggestionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  suggestionButton: { paddingVertical: 10, height: 'auto', borderRadius: 12 },
  suggestionText: { flexShrink: 1, fontSize: 13 },
  inputContainer: { 
    flexDirection: 'row', 
    gap: 10, 
    padding: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#f3f4f6', 
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
});
