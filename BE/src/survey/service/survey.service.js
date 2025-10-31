import {
  responseFromSurvey
} from "../dto/response/survey.response.dto.js";
import {
  createSurvey, findSurvey, updateSurvey, findSurveyByUserId
} from "../repository/survey.repository.js";

/**
 * **[survey]**
 * **\<🛠️ Service\>**
 * ***createUserSurvey***
 * '설문 생성' 기능의 서비스 레이어 입니다. 새로운 설문을 생성하고, 해당 설문의 정보를 반환합니다.
 * @param {Object} body
 * @returns {Object}
 */
export const createUserSurvey = async (userId, surveyDto) => {
  const surveyId = await createSurvey(surveyDto, userId);
  // ✅ 유효성 검사 (설문)
  if (surveyId == -1) {
    const error = new Error("이미 존재하는 설문입니다.");
    error.statusCode = 409;
    throw error;
  }
  const survey = await findSurvey(surveyId);
  return survey;
};


/**
 * **[Survey]**
 * **\<🛠️ Service\>**
 * ***findUserSurvey***
 * '설문 찾기' 기능의 서비스 레이어 입니다. 해당 설문 정보를 반환합니다.
 */
export const findUserSurvey = async (userId) => {
    const survey = await findSurveyByUserId(userId);
    if (!survey) {
        const error = new Error("해당 설문이 없습니다.");
        error.statusCode = 404;
        throw error;
    }
    console.log("(service) survey: ", survey);
    return survey;
}

/**
 * **[Survey]**
 * **\<🛠️ Service\>**
 * ***editUserSurvey***
 * '설문 수정' 기능의 서비스 레이어 입니다. 설문 정보를 업데이트합니다.
 * @param {Object} data
 * @returns {Object}
 */
export const editUserSurvey = async (surveyDto, user_id) => {
  const survey = await findSurveyByUserId(user_id);
  console.log(surveyDto);
  // 존재하는 유저인지 검사
  if (!survey) {
    const error = new Error("해당 설문이 없습니다.");
    error.statusCode = 404;
    throw error;
  }
  const updateUserSurvey = await updateSurvey(surveyDto, user_id);
  return responseFromSurvey(updateUserSurvey);
};
