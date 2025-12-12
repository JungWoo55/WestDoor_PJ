import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { Avatar } from './ui/Avatar';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBooks } from '../contexts/BookContext';
import { searchBooks } from '../api/googleBooks';
import { sendChatMessage } from '../api/chat'; 
import { Book } from '../types';

interface ChatbotRecommendationProps {
  onBookPress: (book: Book) => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  bookRecommendation?: Book;
  recommendationReason?: string;
  isLoading?: boolean;
}

export function ChatbotRecommendation({ onBookPress }: ChatbotRecommendationProps) {
  const { userProfile } = useBooks();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "안녕하세요! 저는 당신의 독서 취향을 분석하여 최적의 책을 추천해드리는 AI 어시스턴트입니다. 어떤 책을 찾고 계신가요?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInputValue = inputValue;
    setInputValue("");
    setIsLoading(true);

    const botTypingMessage: Message = {
      id: Date.now() + 1,
      text: "...",
      sender: "bot",
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages(prev => [...prev, botTypingMessage]);

    try {
      const response = await sendChatMessage(currentInputValue);
      
      const textResponse = response.success.answer;
      const isbnResponse = response.success.books && response.success.books.length > 0 ? response.success.books[0] : null;
      let botResponse: Message;
      
      console.log("Text Response:", textResponse);
      console.log("ISBN Response:", isbnResponse);

      // ISBN 값이 있고, 유효한 문자열인지 확인
      if (typeof isbnResponse === 'string') {
        const bookResult = await searchBooks(isbnResponse);
        if (bookResult) {
          botResponse = {
            id: Date.now(),
            text: textResponse || `'${bookResult[0].volumeInfo.title}'에 대한 추천입니다.`,
            sender: "bot",
            timestamp: new Date(),
            bookRecommendation: bookResult[0],
            recommendationReason: "AI가 당신의 질문을 바탕으로 다음 책을 추천합니다.",
          };
          console.log("Book found for ISBN:", isbnResponse);
        } else {
           // ISBN으로 책을 찾지 못한 경우, 텍스트 답변만 표시
          botResponse = { id: Date.now(), text: textResponse, sender: "bot", timestamp: new Date() };
          console.log("Book not found for ISBN:", isbnResponse);
        }
      } else {
        // ISBN 값이 없는 경우, 텍스트 답변만 표시
        botResponse = { id: Date.now(), text: textResponse, sender: "bot", timestamp: new Date() };
        console.log("ISBN not found:", isbnResponse);
        
        }
      setMessages(prev => prev.filter(m => !m.isLoading).concat(botResponse));

    } catch (error) {
      console.error("Failed to fetch bot response:", error.response?.data || error.message);
      const errorResponse: Message = {
        id: Date.now(),
        text: "죄송합니다, 응답을 받아오는 중 오류가 발생했습니다. 다시 시도해주세요.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => prev.filter(m => !m.isLoading).concat(errorResponse));
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = useMemo(() => {
    const defaultQuestions = [
      "최근 베스트셀러 추천해줘",
      "감동적인 소설 찾아줘",
      "자기계발서 추천해줘",
      "가볍게 읽을 책 알려줘"
    ];

    if (userProfile?.favoriteGenres && userProfile.favoriteGenres.length > 0) {
      const genreQuestions = userProfile.favoriteGenres.slice(0, 2).map(genre => `${genre} 관련 책 추천해줘`);
      return [...genreQuestions, ...defaultQuestions.slice(0, 4 - genreQuestions.length)];
    }

    return defaultQuestions;
  }, [userProfile]);

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top }]} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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
              {message.isLoading ? (
                <ActivityIndicator color="#6b7280" />
              ) : (
                <Text style={message.sender === 'user' ? styles.userText : styles.botText}>{message.text}</Text>
              )}
              {message.bookRecommendation && (
                <Card style={styles.recCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                    <Ionicons name="sparkles" size={16} color="#f59e0b" style={{ marginTop: 2 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.recTitle}>{message.bookRecommendation.volumeInfo.title}</Text>
                      <Text style={styles.recAuthor}>{message.bookRecommendation.volumeInfo.authors?.join(', ')}</Text>
                    </View>
                  </View>
                  <Text style={styles.recReason}>{message.recommendationReason}</Text>
                  <Button 
                    size="sm" 
                    style={{ marginTop: 12 }} 
                    onPress={() => onBookPress(message.bookRecommendation!)}
                  >
                    상세 정보 보기
                  </Button>
                </Card>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      
      {messages.length <= 1 && !isLoading && (
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
          onSubmitEditing={handleSend}
          editable={!isLoading}
        />
        <Button onPress={handleSend} size="icon" disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="white" /> : <Feather name="send" size={16} color="white" />}
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

