/**
 * **[Survey]**
 * **\<🧺⬆️ Response DTO\>**
 * ***responseFromSurvey***
 * '설문 조사' 기능의 요청 결과값을 서비스 레이어에서 컨트롤러로 반환하기 위한 DTO
 * @param {Object} surveyDto
 * @returns {Object}
 */
export const responseFromSurvey = (surveyDto) => {
    const {id, userId, amount, style, category} = surveyDto;
    return {
    id: id,
    userId: userId,
    amount: amount,
    style: style,
    category: category
  };
};