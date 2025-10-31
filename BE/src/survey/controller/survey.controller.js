import { StatusCodes } from "http-status-codes";
import {createUserSurvey, editUserSurvey, findUserSurvey} from "../service/survey.service.js"
import {bodyToSurvey} from "../dto/request/survey.request.dto.js"
import {responseFromSurvey} from "../dto/response/survey.response.dto.js"
/**
 * **[Survey]**
 * **\<📚 Controller\>**
 * ***handleCreateSurvey***
 * 유저의 설문을 생성합니다.
 * 1. 요청 바디를 SurveyRequestDto로 변환
 * 2. 서비스의 createUserSurvey 호출
 * 3. 생성된/업데이트된 서재 항목을 responseFromSurvey로 변환하여 응답
 */

export const handleCreateSurvey = async (req, res, next) => {
    /* 
       // #region 📚 Swagger: 설문 생성
       #swagger.tags = ['Survey']
       #swagger.summary = '설문 생성'
       #swagger.description = '해당 유저의 설문을 생성합니다.'
       #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                amount: {type:"integer", example: "10"},
                style: {type:"string", example: "시리즈 책을 보는 것을 좋아해요."},
                category:{ type: "array", items: {"type": "string"}, example: ["소설", "시"]}
              },
              required: ["amount", "style", "category"]
            }
          }
        }
      }
      #swagger.responses[201] = {
        description: '설문이 성공적으로 생성되었습니다.',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                resultType: { type: "string", example: "success" },
                error: {type: "null", nullable: true, example: null },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        user_id: { type: "integer", example: 1 },
                        amount: {type:"integer", example: "10"},
                        style: {type:"string", example: "시리즈 책을 보는 것을 좋아해요."},
                        category:{ type: "array", items: {"type": "string"}, example: ["소설", "시"]}
                    }
                }
              }
            }
          }
        }
      }
      #swagger.responses[400] = {
        description: '잘못된 요청입니다. 요청 데이터가 유효하지 않을 때 발생합니다.',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                resultType: { type: "string", example: "FAIL" },
                error: {
                  type: "object",
                  properties: {
                    errorCode: { type: "string", example: "I001" },
                    reason: { type: "string", example: "잘못된 입력입니다." },
                    data: { type: "object", nullable: true }
                  }
                },
                data: { type: "null", nullable: true, example: null}
              }
            }
          }
        }
      }
      #swagger.responses[401] = {
        description: "인증 실패",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                resultType: { type: "string", example: "FAIL" },
                error: {
                  type: "object",
                  properties: {
                    errorCode: { type: "string", example: "I003" },
                    reason: { type: "string", example: "유효하지 않은 인증 토큰입니다." },
                    data: { type: "null" }
                  }
                },
                data: { type: "null", nullable: true, example: null}
              }
            }
          }
        }
      }
    */
   // #endregion
    console.log("설문 생성이 요청되었습니다.")
    console.log("body:", req.body);
    console.log("user:", req.user);
    
    try{
        const {id: userId} = req.user; // auth 미들웨어에서 주입된 userId
        if (!req.body.amount){
            throw new InvalidInputValueError("amount가 누락되었습니다.", req.body);
        }
        if (!req.body.category){
            throw new InvalidInputValueError("category가 누락되었습니다.", req.body);
        }
        const newSurvey = await createUserSurvey(userId,bodyToSurvey(req.body));
        const responseDto = responseFromSurvey(newSurvey);
        res.status(StatusCodes.CREATED).success(responseDto);
    } catch(error) {
        next(error);
    }
};

/**
 * ** [Survey]**
 * **\<📚 Controller\>**
 * ***getMySurvey***
 * 내 설문을 조회합니다.
 */
export const handleGetMySurvey = async (req, res, next) => {
    /* 
       // #region 📚 Swagger: 내 설문 조회
       #swagger.tags = ['Survey']
       #swagger.summary = '내 설문 조회'
       #swagger.description = '프로필에서 내 설문 내역을 조회합니다.'
       
    #swagger.responses[200] = {
        description: '내 설문이 성공적으로 조회되었습니다.',
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "success" },
                        error: { type: "null", nullable: true, example: null },
                        data: { 
                            type: "object",
                            properties: {
                            survey: {
                                  type: "object",
                                  properties: {
                                    id: { type: "integer", example: 1 },
                                    userId: { type: "integer", example: 1 },
                                    amount: { type: "integer", example: "10" },
                                    style: { type: "string", example: "시리즈 책 보는 것을 좋아해요" },
                                    category:{ type: "array", items: {"type": "string"}, example: ["소설", "시"]}
                                    }
                                }
                            },
                        }
                    }
                }
            }
        }
    }
    #swagger.responses[401] = {
        description: "인증 실패",
        content: {
            "application/json": {
                schema: { type: "object" },
                examples: {
                    Unauthorized: {
                        summary : "인증 실패",
                        value: {
                            resultType: "fail",
                            error: {
                                errorCode: "I003",
                                reason: "유효하지 않은 인증 토큰 입니다.",
                                data: null
                            },
                            data:null
                        }
                    }
                }
            }   
        }
    }
    */
   // #endregion
    console.log("내 설문 조회가 요청되었습니다.");
    console.log("user:", req.user);
    try{
        const {id: userId} = req.user;
        const survey = await findUserSurvey(userId);
        const responseDto = responseFromSurvey(survey);
        res.status(StatusCodes.OK).success(responseDto);
    }catch(error){
        next(error);
    }
};

/**
 * ** [Survey]**
 * **\<📚 Controller\>**
 * ***handleEditSurvey***
 */
export const handleEditSurvey = async (req, res, next) => {
    /* 
       // #region 📚 Swagger: 설문 수정
       #swagger.tags = ['Survey']
       #swagger.summary = '설문 수정'
       #swagger.description = '프로필 수정에서 내 설문을 수정합니다'
       #swagger.requestBody = {
        required: true,
        
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                amount: {type:"integer", example: "10"},
                style: {type:"string", example: "시리즈 책을 보는 것을 좋아해요."},
                category:{ type: "array", items: {"type": "string"}, example: ["소설", "시"]}
              },
              required: ["amount", "style", "category"]
            }
          }
        }
      }
      #swagger.responses[201] = {
        description: '설문 수정이 성공하였습니다.',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                resultType: { type: "string", example: "success" },
                error: {type: "null", nullable: true, example: null },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        userId: { type: "integer", example: 1 },
                        amount: { type: "integer", example: "10" },
                        style: { type: "string", example: "시리즈 책 보는 것을 좋아해요" },
                        category:{ type: "array", items: {"type": "string"}, example: ["소설", "시"]}
                    }
                }
              }
            }
          }
        }
      }
      #swagger.responses[400] = {
        description: '잘못된 요청입니다. 요청 데이터가 유효하지 않을 때 발생합니다.',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                resultType: { type: "string", example: "FAIL" },
                error: {
                  type: "object",
                  properties: {
                    errorCode: { type: "string", example: "I001" },
                    reason: { type: "string", example: "잘못된 입력입니다." },
                    data: { type: "object", nullable: true }
                  }
                },
                data: { type: "null", nullable: true, example: null}
              }
            }
          }
        }
      }
      #swagger.responses[401] = {
        description: "인증 실패",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                resultType: { type: "string", example: "FAIL" },
                error: {
                  type: "object",
                  properties: {
                    errorCode: { type: "string", example: "I003" },
                    reason: { type: "string", example: "유효하지 않은 인증 토큰입니다." },
                    data: { type: "null" }
                  }
                },
                data: { type: "null", nullable: true, example: null}
              }
            }
          }
        }
      }
    */
   // #endregion
    console.log("설문 수정이 요청되었습니다.")
    console.log("body:", req.body);
    console.log("user:", req.user);
    
    try{
        const {id: userId} = req.user; // auth 미들웨어에서 주입된 userId
        if (!req.body.amount){
            throw new InvalidInputValueError("amount가 누락되었습니다.", req.body);
        }
        if (!req.body.category){
            throw new InvalidInputValueError("category가 누락되었습니다.", req.body);
        }
        const updatedSurvey = await editUserSurvey(bodyToSurvey(req.body),userId);
        const responseDto = responseFromSurvey(updatedSurvey);
        res.status(StatusCodes.OK).success(responseDto);
    } catch(error) {
        next(error);
    }
};