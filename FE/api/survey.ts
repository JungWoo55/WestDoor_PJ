import api from './index';

const readingAmountToNumber = (amount: string | null): number => {
  if (amount === '안읽음') return 0;
  if (amount === '1~2권') return 1;
  if (amount === '3권 이상') return 3;
  return 0;
};

export const submitSurvey = async (surveyData: {
  nickname: string;
  readingAmount: string | null;
  selectedCategories: string[];
  readingStyle: string;
}) => {
  const transformedData = {
    amount: readingAmountToNumber(surveyData.readingAmount),
    category: surveyData.selectedCategories,
    style: surveyData.readingStyle,
  };

  try {
    const response = await api.post('/survey', transformedData);
    return response.data;
  } catch (error) {
    console.error('Error submitting survey:', error);
    throw error;
  }
};

export const getMySurvey = async () => {
  try {
    const response = await api.get('/survey');
    return response.data;
  } catch (error) {
    console.error('Error fetching survey:', error);
    throw error;
  }
};