import { StatusCodes } from "http-status-codes";
import {
  login,
  refresh,
  signUp,
  logout,
  setProfile,
} from "../service/auth.service.js";
import {
  bodyToLogin,
  bodyToRefresh,
  bodyToSignUp,
  bodyToLogout,
  bodyToProfile,
} from "../dto/request/auth.request.dto.js";
import { InvalidInputValueError } from "../../error.js";
import { DateTime } from "luxon";
import { clearTokenCookies, setTokenCookies } from "../../utils/cookie.js";
// 입력값을 검증하기위한 정규표현식
const regex = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password:
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[.!@#$%^&*])[A-Za-z\d.!@#$%^&*]{7,12}$/,
  phone: /^\d{10,11}$/,
};
/**
 * **[Auth]**
 *  **\<🕹️ Controller\>**
 *  ***handleSignUp***
 *  '회원가입' 기능 담당 API의 컨트롤러
 */
export const handleSignUp = async (req, res, next) => {
  /*
    #swagger.summary = '회원가입'
    #swagger.description = '사용자 회원가입을 처리합니다.'
    #swagger.tags = ['Auth']
    #swagger.requestBody = {
      required : true,
      content:{
        "application/json":{
          schema:{
            type:"object",
            properties:{
              email:{
                type:"string",
                format:"email",
                example:"example@example.com"
              },
              password:{
                type:"string",
                format:"password",
                example:"password123!"
              }
            }
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: '회원가입 성공',
      content:{
        "application/json":{
          schema:{
            type:"object",
            properties:{
              resultType:{
                type:"string",
                example:"SUCCESS"
              },
              error:{
                type:"object",
                nullable:true,
                example:"null"
              },
              data:{
                type:"object",
                properties:{
                  id:{
                    type:"number",
                    example:1
                  },
                  email:{
                    type:"string",
                    format:"email",
                    example:"example@example.com"
                  },
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "회원가입 실패 (올바르지 않은 입력 값)",
      content:{
        "application/json":{
          examples:{
            InvalidEmail :{
              summary:"올바르지 않은 이메일 형식",
              value:{
                resultType: "FAIL",
                error:{
                  errorCode:"I001",
                  reason: "이메일 형식이 올바르지 않습니다.",
                  data:{
                    email: "exampleexample.com",
                    password: "password"
                  }
                },
                data:null
              }
            },
            InvalidPassword:{
              summary: "올바르지 않은 비밀번호 형식",
              value:{
                resultType: "FAIL",
                error:{
                  errorCode:"I001",
                  reason: "비밀번호 형식이 올바르지 않습니다.",
                  data:{
                    email: "example@example.com",
                    password: "password"
                  }
                },
                data:null
              }
            }
          }
        }
      }
    }
    #swagger.responses[409] = {
      description: "회원가입 실패 (이미 존재하는 이메일)",
      content:{
        "application/json":{
          schema:{
            type:"object",
            properties:{
              resultType:{type:"string", example:"FAIL"},
              error:{
                type:"object",
                properties:{
                  errorCode:{type:"string", example:"U001"},
                  reason:{type:"string", example:"이미 존재하는 이메일 입니다."},
                  data:{type:"object", example:{email:"example@example.com", password:"password"}}
                }
              },
              data:{type:"object", nullable:true, example:null}
            }
          }
        }
      }
    }
  */
  console.log("회원가입이 요청되었습니다!");
  console.log("body:", req.body);
  // ✅ 유효성 검사 (이메일)
  if (!req.body.email || !regex.email.test(req.body.email)) {
    throw new InvalidInputValueError(
      "이메일 형식이 올바르지 않습니다.",
      req.body
    );
  }
  // ✅ 유효성 검사 (비밀번호)
  if (!req.body.password || !regex.password.test(req.body.password)) {
    throw new InvalidInputValueError(
      "비밀번호 형식이 올바르지 않습니다.",
      req.body
    );
  }
  const auth = await signUp(bodyToSignUp(req.body));
  res.status(StatusCodes.CREATED).success(auth);
};
/**
 * **[Auth]**
 *  **\<🕹️ Controller\>**
 *  ***handleLogin***
 *  '로그인' 기능 담당 API의 컨트롤러
 */
export const handleLogin = async (req, res, next) => {
  // #region 📚 Swagger: 로그인
  /*
    #swagger.summary = '로그인'
    #swagger.description = '사용자 로그인을 처리합니다. 로그인 성공시 브라우저 쿠키 저장소에 엑세스 / 리프레시 토큰이 저장됩니다.'
    #swagger.tags = ['Auth']
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email', example: 'example@example.com' },
              password: { type: 'string', example: 'password123!' }
            },
            required: ['email', 'password']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: '로그인 성공',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              resultType : {type: 'string', example: 'success'},
              error: {type: "object", nullable: true, example: null},
              data: {
                type: "object",
                properties: {
                  id:{type: "number", example:20},
                  email:{type: "string", example:"user@example.com"},
                  nickname:{type: "string", example:"길동이"},
                  profileImage:{type: "string", example:"profile.jpg"},
                  isCompleted: {type:"boolean", example: true},
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "로그인 실패 (올바르지 않은 입력 값)",
      content: {
        "application/json":{
          examples:{
            invalidEmailFormat:{
              summary:"올바르지 않은 이메일 형식",
              value:{
                "resultType": "FAIL",
                "error": {
                  "errorCode": "I001",
                  "reason": "이메일 형식이 올바르지 않습니다.",
                  "data": {
                    "email": "userexample.com",
                    "password": "p@ssword123"
                  }
                },
                "data": null
              }
            },
            invalidPasswordFormat:{
              summary:"비밀번호가 입력되지 않음",
              value:{
                "resultType": "FAIL",
                "error": {
                  "errorCode": "I001",
                  "reason": "비밀번호를 입력하지 않았습니다.",
                  "data": {
                    "email": "user@example.com"
                  }
                },
                "data": null
              }
            },
            InvalidPassword:{
              summary:"비밀번호가 일치하지 않음",
              value:{
                "resultType": "FAIL",
                "error": {
                  "errorCode": "I001",
                  "reason": "비밀번호가 일치하지 않습니다.",
                  "data": {
                    "email": "user@example.com",
                    "password": "p@ssword123"
                  }
                },
                "data": null
              }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: "로그인 실패 (존재하지 않는 계정)",
      content: {
        "application/json":{
          schema:{
            type:"object",
            properties: {
              resultType: {
                type: "string",
                example:"U001"
              },
              error:{
                type:"object",
                properties:{
                  errorCode:{
                    type:"string",
                    example:"U001"
                  },
                  reason:{
                    type:"string",
                    example:"존재하지 않는 계정입니다."
                  },
                  data:{
                    type:"object",
                    properties:{
                      email:{
                        type:"string",
                        example:"user@example.com"
                      },
                      password:{
                        type:"string",
                        example:"p@ssword123"
                      }
                    }
                  }
                }
              },
              data:{
                type:"object",
                nullable:true,
                example:null
              }
            }
          }
        }
      }
    }
  */
  // #endregion

  console.log("로그인이 요청되었습니다!");
  console.log("body:", req.body);
  // ✅ 유효성 검사 (이메일)
  if (!req.body.email || !regex.email.test(req.body.email)) {
    throw new InvalidInputValueError(
      "이메일 형식이 올바르지 않습니다.",
      req.body
    );
  }
  // ✅ 유효성 검사 (비밀번호)
  if (!req.body.password) {
    throw new InvalidInputValueError(
      "비밀번호를 입력하지 않았습니다.",
      req.body
    );
  }
  const user = await login(bodyToLogin(req.body));
  console.log("user: ", user)
  setTokenCookies(res, user.accessToken, user.refreshToken);
  res.status(StatusCodes.OK).success(user.user);
};
/**
 * **[Auth]**
 *  **\<🕹️ Controller\>**
 *  ***handleRefresh***
 *  '토큰 리프레시' 기능 담당 API의 컨트롤러
 */
export const handleRefresh = async (req, res, next) => {
  // #region 📚 Swagger: 토큰 리프레시
  /*
    #swagger.summary = '토큰 리프레시'
    #swagger.tags = ['Auth']
    #swagger.description = '토큰을 리프레시합니다. 리프레시 토큰은 요청시 자동으로 첨부됩니다.'
    #swagger.responses[200] = {
      description:"토큰 리프레시 성공 (쿠키 저장소에 자동 저장 됨)",
      content:{
        "application/json":{
          schema:{
            type:"object",
            properties:{
              resultType: {type: "string", example: "SUCCESS"},
              error: {type: "object", nullable: true, example: null},
              data: {type: "object", properties:{
                id: {type:"number", example: 1},
                email: {type:"string", example: "example@example.com"},
                nickname: {type:"string", example: "길동이"},
                isCompleted: {type:"boolean", example: true},
              }}
            }
          }
        }
      }
    }
    #swagger.responses[401] ={
      description:"토큰 리프레시 실패 (유효하지 않은 리프레시 토큰)",
      content:{
        "application/json":{
          schema:{
            type:"object",
            properties:{
              resultType: {type: "string", example: "FAIL"},
              error: {
                type: "object",
                properties:{
                  errorCode: {type: "string", example: "I003"},
                  reason: {type: "string", example: "유효하지 않은 인증 토큰입니다."},
                  data: {type: "object", nullable: true, example: null}
                }
              },
              data: {type: "object", nullable: true, example: null}
            }
          }
        }
      }
    }
    #swagger.responses[404] ={
      description:"토큰 리프레시 실패 (존재하지 않는 사용자)",
      content:{
        "application/json":{
          schema:{
            type:"object",
            properties:{
              resultType: {type: "string", example: "FAIL"},
              error: {
                type: "object",
                properties:{
                  errorCode: {type: "string", example: "I003"},
                  reason: {type: "string", example: "존재하지 않는 사용자입니다."},
                  data: {type: "object", nullable: true, example: null}
                }
              },
              data: {type: "object", nullable: true, example: null}
            }
          }
        }
      }
    }
  */
  // #endregion

  console.log("엑세스 토큰 리프레시가 요청되었습니다!");
  console.log("cookies:", req.cookies);
  const result = await refresh(bodyToRefresh(req.cookies));
  // 🍪 토큰을 쿠키로 저장(Http-only)
  setTokenCookies(res, result.accessToken, result.refreshToken);
  res.status(StatusCodes.OK).success(result.user);
};
/**
 * **[Auth]**
 *  **\<🕹️ Controller\>**
 *  ***handleLogout***
 *  '로그아웃' 기능 담당 API의 컨트롤러
 */
export const handleLogout = async (req, res, next) => {
  // #region 📚 Swagger: 로그아웃
  /*
    #swagger.summary = '로그아웃'
    #swagger.tags = ['Auth']
    #swagger.description = '로그아웃합니다.'
    #swagger.responses[200] = {
      description:"로그아웃 성공 (쿠키 저장소에서 자동 삭제 됨)",
      content:{
        "application/json":{
          schema:{
            type:"object",
            properties:{
              resultType: {type: "string", example: "SUCCESS"},
              error: {type: "object", nullable: true, example: null},
              data: {type: "object", nullable: true, example: null}
            }
          }
        }
      }
    }
    #swagger.responses[401] ={
      description:"로그아웃 실패 (유효하지 않은 리프레시 토큰 - 토큰 입력 안됨)",
      content:{
        "application/json":{
          schema:{
            type:"object",
            properties:{
              resultType: {type: "string", example: "FAIL"},
              error: {
                type: "object",
                properties:{
                  errorCode: {type: "string", example: "I003"},
                  reason: {type: "string", example: "유효하지 않은 인증 토큰입니다."},
                  data: {type: "object", nullable: true, example: null}
                }
              },
              data: {type: "object", nullable: true, example: null}
            }
          }
        }
      }
    }
  */
  // #endregion
  console.log("로그아웃이 요청되었습니다!");
  console.log("cookies:", req.cookies);
  const token = req.cookies?.refreshToken;
  if (!token){
    console.log("token:", token);
    return res.status(204).send();
  }
  // 리프레시 토큰을 DB로부터 제거
  await logout(bodyToLogout(req.cookies));
  // 🍪 토큰을 쿠키 저장소에서 제거
  clearTokenCookies(res);
  res.status(StatusCodes.OK).success(null);
};
/**
 * **[Auth]**
 *  **\<🕹️ Controller\>**
 *  ***handleProfile***
 *  '프로필 설정' 기능 담당 API의 컨트롤러
 */
export const handleProfile = async (req, res, next) => {
  // #region 📚 Swagger: 프로필 설정
  /*
    #swagger.summary = '프로필 설정'
    #swagger.tags = ['Auth']
    #swagger.description = '사용자의 프로필 정보를 설정합니다.'
    #swagger.requestBody = {
      required: true,
      content: {
          "multipart/form-data":{
            schema:{
              type: "object",
              properties:{
                nickname: {type: "string",description: "닉네임", example: "길동이"},
              }
            }
          }
      }
    }
    #swagger.responses[200] = {
      description: "프로필 설정 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties:{
              resultType: {type: "string", example: "SUCCESS"},
              error:{type: "object", nullable: true, example: null},
              data : {
                type: "object",
                properties:{
                  id: {type: "number", example: 1},
                  email: {type: "string", example: "example@example.com"},
                  nickname: {type: "string", example: "길동이"}
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description : "프로필 설정 실패 응답 (존재하지 않는 사용자)",
      content: {
        "application/json":{
          schema:{
            type: "object",
            properties:{
              resultType: {type: "string", example: "FAIL"},
              error: {
                type: "object",
                properties:{
                  errorCode: {type: "string", example: "U001"},
                  reason: {type: "string", example: "존재하지 않는 사용자입니다."},
                  data: {type: "object",
                    properties:{
                      nickname: {type: "string", example: "길동이"}
                    }
                  }
                }
              },
              data: {type: "object", nullable: true, example: null}
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description : "프로필 설정 실패 응답 (올바르지 않은 입력값)",
      content: {
      "application/json":{
        examples:{
          InvalidNicknameInput:{
            summary: "올바르지 않은 닉네임",
            value:{
              resultType: "FAIL",
              error: {
                errorCode :"I001",
                reason: "닉네임이 올바르지 않습니다.",
                data:{
                  nickname:""
                }
              },
              data:null
            }
          },
        }
      }
      }
    }
  */
  // #endregion
  console.log("프로필 설정이 요청되었습니다!");
  console.log("body:", req.body);
  // ✅ 유효성 검사 (닉네임)
  if (!req.body.nickname) {
    throw new InvalidInputValueError("닉네임이 올바르지 않습니다.", req.body);
  }
  const profile = await setProfile(
    bodyToProfile(req.body, req.payload)
  );
  res.status(StatusCodes.OK).success(profile);
};
