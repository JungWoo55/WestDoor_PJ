import { StatusCodes } from "http-status-codes";
import { sendMessage } from "../service/chat.service.js";
import { bodyToChat } from "../dto/request/chat.request.dto.js";

/**
 * **[Chat]**
 * **<🕹️ Controller>**
 * ***handleSendMessage***
 * 사용자 메시지를 처리하고 AI 응답을 반환합니다.
 */
export const handleSendMessage = async (req, res, next) => {
  try {
    /*
      #swagger.summary = 'AI 채팅 메시지 전송'
      #swagger.description = '사용자가 입력한 질문을 AI 모델에 전송하고, 답변과 추천 책 리스트를 받습니다.'
      #swagger.tags = ['Chat']
      #swagger.security = [{"bearerAuth": []}]
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                question: {
                  type: "string",
                  example: "행복한 삶에 대한 책을 추천해줄래?"
                }
              },
              required: ["question"]
            }
          }
        }
      }
      #swagger.responses[200] = {
        description: '메시지 전송 성공',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                statusCode: { type: "number", example: 200 },
                data: {
                  type: "object",
                  properties: {
                    chatId: { type: "number", example: 1 },
                    question: { type: "string" },
                    answer: { type: "string" },
                    books: {
                      type: "array",
                      items: { type: "string" },
                      example: ["978-1-234567-89-0", "978-9-876543-21-0"]
                    },
                    createdAt: { type: "string", format: "date-time" }
                  }
                },
                message: { type: "string", example: "메시지 전송 성공" }
              }
            }
          }
        }
      }
      #swagger.responses[400] = {
        description: '유효하지 않은 요청',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                statusCode: { type: "number", example: 400 },
                error: {
                  type: "object",
                  properties: {
                    errorCode: { type: "string" },
                    reason: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'AI 서비스 연결 실패',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                statusCode: { type: "number", example: 500 },
                error: {
                  type: "object",
                  properties: {
                    errorCode: { type: "string" },
                    reason: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    */

    const { question } = req.body || {};
    const userId = req.user?.id; // 인증 미들웨어에서 설정

    // 입력값 검증
    const validatedData = bodyToChat({ question });

    // 서비스 호출
    const result = await sendMessage(userId, validatedData.question);

    res.status(StatusCodes.OK).success(result, "메시지 전송 성공");
  } catch (error) {
    next(error);
  }
};
