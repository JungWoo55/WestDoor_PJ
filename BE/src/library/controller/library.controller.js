import { StatusCodes } from "http-status-codes";
import { InvalidInputValueError } from "../../error.js";
import {bodyToAddBook, queryToGetLibrary, paramsToBook, bodyToReadBook} from "../dto/request/library.request.dto.js"
import { LibraryEntryResponseDto, LibraryListResponseDto, RemoveBookResponseDto } from "../dto/response/library.response.dto.js";
import { addBookToUserLibrary, getLibraryList, removeBookFromUserLibrary,readBookToUserLibrary  } from "../service/library.service.js";

/**
 * **[Library]**
 * **\<📚 Controller\>**
 * ***addBook***
 * 내 서재에 도서를 추가합니다.
 * 1. 요청 바디를 AddBookRequestDto로 변환
 * 2. 서비스의 addBookToLibrary 호출
 * 3. 생성된/업데이트된 서재 항목을 LibraryEntryResponseDto로 변환하여 응답
 */

export const handleAddBook = async (req, res, next) => {
    /* 
       // #region 📚 Swagger: 도서 추가/수정
       #swagger.tags = ['Library']
       #swagger.summary = '도서 추가/수정'
       #swagger.description = '내 서재에 도서를 추가하거나, 이미 존재하는 도서라면 읽음/추천 플래그를 업데이트합니다.'
       #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                isbn: { type: "string", example: "9788966262583" },
                isRead: { type: "boolean", example: true },
                isRecom: { type: "boolean", example: false }
              },
              required: ["isbn", "isRead", "isRecom"]
            }
          }
        }
      }
      #swagger.responses[201] = {
        description: '도서가 성공적으로 추가/수정되었습니다.',
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
                        isbn: { type: "string", example: "9788966262583" },
                        isRead: { type: "boolean", example: true },
                        isRecom: { type: "boolean", example: false },
                        createdAt: { type: "string", format: "date-time", example: "2025-10-29T00:00:00Z" }
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
    console.log("내 서재 책 추가가 요청되었습니다.")
    console.log("body:", req.body);
    console.log("user:", req.user);
    
    try{
        const {id: userId} = req.user; // auth 미들웨어에서 주입된 userId
        if (!req.body.isbn){
            throw new InvalidInputValueError("ISBN이 누락되었습니다.", req.body);
        }
        if (
            typeof req.body.isRead !== 'boolean' || 
            typeof req.body.isRecom !== 'boolean'
        ){
            throw new InvalidInputValueError("isRead와 isRecom은 boolean 값이어야 합니다.", req.body);
        }
        
        const newEntry = await addBookToUserLibrary(userId, bodyToAddBook(req.body));
        const responseDto = new LibraryEntryResponseDto(newEntry);
        res.status(StatusCodes.CREATED).success(responseDto);
    } catch(error) {
        next(error);
    }
};

/**
 * ** [Library]**
 * **\<📚 Controller\>**
 * ***getMyLibrary***
 * 내 서재 목록을 조회합니다.
 * 1. 쿼리 파라미터를 LibraryQueryDto로 변환
 * 2. 서비스의 getLibraryList 호출
 * 3. 조회된 서재 항목들을 LibraryListResponseDto로 변환하여 응답
 */
export const handleGetMyLibrary = async (req, res, next) => {
    /* 
       // #region 📚 Swagger: 내 서재 목록 조회
       #swagger.tags = ['Library']
       #swagger.summary = '내 서재 목록 조회'
       #swagger.description = '내 서재에서 읽은 책 또는 추천 책 목록을 조회합니다.'
       #swagger.parameters = [{
         "in": "query",
         "name": "page",
         "description": "조회할 목록 유형을 지정합니다.",
         "required": true,
         "type": "string",
        "enum": ["isRead", "isRecom"],
        
       }]
    #swagger.responses[200] = {
        description: '내 서재 목록이 성공적으로 조회되었습니다.',
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
                            books: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    id: { type: "integer", example: 1 },
                                    isbn: { type: "string", example: "9788966262583" },
                                    isRead: { type: "boolean", example: true },
                                    isRecom: { type: "boolean", example: false },
                                    createdAt: { type: "string", format: "date-time", example: "2025-10-29T00:00:00Z" }
                                    }
                                }
                            },
                            count: { type: "integer", example: 10 }                                }
                        }
                    }
                }
            }
        }
    }
    #swagger.responses[400] = {
        description: '잘못된 요청입니다. 쿼리 파라미터가 유효하지 않을 때 발생합니다.',
        content: {
            "application/json": {
                schema: { type: "object" },
                examples: {
                    InvaildPageQuery: {
                        summary: "잘못된 'page' 쿼리 값",
                        value: {
                            resultType: "fail",
                            error: {
                                errorCode: "I001",
                                reason: "'page' 쿼리 값은 'isRead' 또는 'isRecom'이어야 합니다.",
                                data: { page: "wrong_query" }
                            }
                        },
                        data: null
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
    console.log("내 서재 목록 조회가 요청되었습니다.");
    console.log("query:", req.query);
    console.log("user:", req.user);
    try{
        const {id: userId} = req.user;
        const {page} = queryToGetLibrary(req.query);

        if (!page || (page !== 'isRead' && page !== 'isRecom')){
            throw new InvalidInputValueError(
                "'page' 쿼리 값은 'isRead' 또는 'isRecom'이어야 합니다.", req.query
            );
        }

        const entries = await getLibraryList(userId, page);
        
        const responseDto = new LibraryListResponseDto(entries);
        res.status(StatusCodes.OK).success(responseDto);
    }catch(error){
        next(error);
    }
};

/**
 * ** [Library]**
 * **\<📚 Controller\>**
 * ***removeBook***
 * 서재에서 도서를 삭제/수정합니다.
 * 1. 경로 파라미터를 LibraryParamDto로 변환
 * 2. 쿼리 파라미터를 LibraryQueryDto로 변환
 * 3. 서비스의 removeBookFromLibrary 호출
 * 4. 결과를 RemoveBookResponseDto로 변환하여 응답
 */
export const handleRemoveBook = async (req, res, next) => {
    /* 
       // #region 📚 Swagger: 서재 도서 삭제/수정
       #swagger.tags = ['Library']
       #swagger.summary = '서재 도서 삭제/수정'
       #swagger.description = '서재에서 도서를 삭제하거나, 읽음/추천 플래그를 수정합니다.'
       #swagger.parameters = [{
         "in": "path",
         "name": "isbn",
         "description": "삭제/수정할 도서의 ISBN",
         "required": true,
         "schema": { 
           "type": "string",
         },
       },
       {
         "in": "path",
         "name": "page",
         "description": "false로 변경한 플래그 타입",
         "required": true,
         "schema": {
           "type": "string",
           "enum": ["isRead", "isRecom"],
         },
        "example": "isRead"
       }]
    #swagger.responses[200] = {
        description: '서재 도서가 성공적으로 삭제/수정되었습니다.',
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
                                status: { type: "string", enum: ["updated", "deleted"] },
                                entryData: {
                                  description: "status가 'updated'일 때만 반환됨",
                                  nullable: true,
                                  type: "object",
                                  properties: {
                                     id: { type: "integer", example: 1 },
                                     isbn: { type: "string", example: "9788966262583" },
                                     isRead: { type: "boolean", example: true },
                                     isRecom: { type: "boolean", example: false },
                                     createdAt: { type: "string", format: "date-time", example: "2025-10-29T00:00:00Z" }
                                  }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    #swagger.responses[400] = {
        description: "잘못된 요청",
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
                        data: { type: "null" }
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
                        data: { type: "null" }
                    }
                }
            }
        }
    }
    #swagger.responses[404] = {
        description: "요청한 도서를 찾을 수 없습니다.",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: {
                            type: "object",
                            properties: {
                                errorCode: { type: "string", example: "I004" },
                                reason: { type: "string", example: "요청한 도서를 찾을 수 없습니다." },
                                data: {
                                    type: "object",
                                    properties: {
                                        isbn: { type: "string", example: "9788966262583" }
                                    }
                                }
                            }
                        },
                        data: { type: "null" }
                    }
                }
            }
        }
    }
    */
   // #endregion
    console.log("서재 도서 삭제/수정이 요청되었습니다.");
    console.log("params:", req.params);
    console.log("user:", req.user);
    try{
        const {id: userId} = req.user;
        const {isbn, page} = paramsToBook(req.params);
        console.log("userId:", userId);
        if (!isbn){
            throw new InvalidInputValueError("ISBN이 누락되었습니다.", req.params);
        }
        if (!page || (page !== 'isRead' && page !== 'isRecom')){
            throw new InvalidInputValueError(
                "'page' 쿼리 값은 'isRead' 또는 'isRecom'이어야 합니다.", req.query
            );
        }
        const result = await removeBookFromUserLibrary(userId, isbn, page);

        const responseDto = new RemoveBookResponseDto(result);
        res.status(StatusCodes.OK).success(responseDto);
    } catch(error) {
        next(error);
    }
};

/**
 * ** [Library]**
 * **\<📚 Controller\>**
 * ***ReadBook***
 * 
 */
export const handleReadBook = async (req, res, next) => {
    /* 
       // #region 📚 Swagger: 도서 완독
       #swagger.tags = ['Library']
       #swagger.summary = '도서 완독'
       #swagger.description = '내 서재에 도서를 완독 횟수를 증가시킵니다.'
       #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                isbn: { type: "string", example: "9788966262583" },
              },
              required: ["isbn"]
            }
          }
        }
      }
      #swagger.responses[201] = {
        description: '도서의 완독 횟수가 성공적으로 증가되었습니다.',
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
                        isbn: { type: "string", example: "9788966262583" },
                        count: {type:"integer", example: 1},
                        createdAt: { type: "string", format: "date-time", example: "2025-10-29T00:00:00Z" }
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
    console.log("내 서재 책 완독 요청되었습니다.")
    console.log("body:", req.body);
    console.log("user:", req.user);
    
    try{
        const {id: userId} = req.user; // auth 미들웨어에서 주입된 userId
        if (!req.body.isbn){
            throw new InvalidInputValueError("ISBN이 누락되었습니다.", req.body);
        }
        const newEntry = await readBookToUserLibrary(userId, bodyToReadBook(req.body));
        const responseDto = new LibraryEntryResponseDto(newEntry);
        res.status(StatusCodes.OK).success(responseDto);
    } catch(error) {
        next(error);
    }
};