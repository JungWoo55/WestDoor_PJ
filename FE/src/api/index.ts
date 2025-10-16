import axios from 'axios';

// 백엔드 BE에서 제공하는 API의 기본 URL
const baseURL = 'http://localhost:3000';

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;