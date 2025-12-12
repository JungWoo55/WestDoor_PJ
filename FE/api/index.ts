import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// 백엔드 BE에서 제공하는 API의 기본 URL
const baseURL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // httpOnly 쿠키 전송을 위한 설정
});

// 요청 인터셉터 추가
api.interceptors.request.use(
    async (config) => {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

