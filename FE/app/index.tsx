import { Text, View, StyleSheet, Button } from 'react-native';
import { useState } from 'react';
import api from '@/api'; // 우리가 설정한 API 클라이언트

export default function Index() {
  // 1. 서버 메시지를 저장할 상태를 만듭니다.
  const [message, setMessage] = useState('버튼을 눌러 연결을 확인하세요.');

  // 2. 버튼을 누르면 실행될 함수입니다.
  const handlePress = async () => {
    try {
      // 백엔드 기본 경로('/')로 요청을 보냅니다.
      const response = await api.get('/');
      // 성공하면 백엔드가 보내준 메시지로 글자를 바꿉니다.
      setMessage(response.data);
    } catch (error) {
      console.error("API 요청 실패:", error);
      setMessage('❌ 백엔드 연결에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      <Button title="연결 확인하기" onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});