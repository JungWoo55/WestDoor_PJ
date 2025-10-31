import { prisma } from "../../db.config.js";

/**
 * **[Survey]**
 * **\<📦 Repository\>**
 * ***createSurvey***
 * 'Survey' 기능의 레포지토리 레이어 입니다. DB의 설문 테이블에 새 설문 정보를 삽입하고 새 설문의 ID값을 반환합니다.
 * @param {object} data
 * @returns {number}
 */
export const createSurvey = async (surveyDto, user_id) => {
  const {amount, style, category} = surveyDto;
  const isExistSurvey = await prisma.survey.findUnique({
    where: {
      userId: user_id,
    },
  });
  if (isExistSurvey) return -1;
  try {
    const survey = await prisma.survey.create({
        data: {
        userId: user_id,
        amount: amount,
        style: style,
        category: category
        },
    });
    const user = await prisma.user.update({
        where:{
            id: user_id,
        },
        data:{
            isCompleted: true,
        }
    });
    return survey.id;
  } catch(error){
    console.error("Survey 생성 실패: ", error);
    return null;
  }  
};

/**
 * **[Survey]**
 * **\<📦 Repository\>**
 * ***findSurvey***
 * '설문 찾기' 기능의 레포지토리 레이어 입니다. 지정한 유저의 설문 정보를 수정합니다.
 * @param {object} data
 * @returns {object}
 */
export const findSurvey = async (id) => {
  const survey = await prisma.survey.findUnique({
    where: {
      id: id,
    }
  });
  return survey;
};

/**
 * **[Survey]**
 * **\<📦 Repository\>**
 * ***findSurveyByUserId***
 * '설문 찾기' 기능의 레포지토리 레이어 입니다. 지정한 유저의 설문 정보를 수정합니다.
 * @param {object} data
 * @returns {object}
 */
export const findSurveyByUserId = async (id) => {
  const survey = await prisma.survey.findUnique({
    where: {
      userId: id,
    }
  });
  return survey;
};

/**
 * **[Survey]**
 * **\<📦 Repository\>**
 * ***updateSurvey***
 * '설문 수정' 기능의 레포지토리 레이어 입니다. 지정한 유저의 설문 정보를 수정합니다.
 * @param {object} data
 * @returns {object}
 */
export const updateSurvey = async (surveyDto, user_id) => {
    const {amount, style, category} = surveyDto;
    const survey = await prisma.survey.update({
    where: {
      userId: user_id
    },
    data: {
      amount: amount,
      style: style,
      category: category
    },
  });
  return survey;
};
