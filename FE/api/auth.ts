import api from './index';

export const updateNickname = async (nickname: string) => {
  const formData = new FormData();
  formData.append('nickname', nickname);

  try {
    const response = await api.post('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating nickname:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    // 로그아웃 API 실패해도 로컬에서 로그아웃 처리
    return true;
  }
};