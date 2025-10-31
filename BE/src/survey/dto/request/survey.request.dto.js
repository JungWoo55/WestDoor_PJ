
/**
 * **[Survey]**
 * **\<🧺⬇️ Request DTO\>**
 * ***bodyToSurvey***
 * '설문 조사'기능의 요청 값을 서비스 레이어로 옮기기 위한 DTO
 * @param {Object} body
 * @returns {Object}
 */
export const bodyToSurvey = (body) => {
  return {
    amount: body.amount,
    style: body.style,
    category: body.category
  };
};