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
