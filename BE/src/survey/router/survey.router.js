import express from "express";
import {
    handleCreateSurvey,
    handleGetMySurvey,
    handleEditSurvey
} from "../controller/survey.controller.js";
import {
  authenticateAccessToken,
  verifyUserIsActive,
} from "../../auth/middleware/auth.middleware.js";

const router = express.Router();
/* 설문 접근 제한 핸들러
 * 모든 라우트는 인증된 사용자만 접근 가능합니다.
 * AccessToken 인증과 사용자 활성화 여부를 검증합니다.
 */
router.use(authenticateAccessToken);

// 설문 생성
router.post("/",handleCreateSurvey);

router.use( verifyUserIsActive);
// 설문 조회
router.get("/",handleGetMySurvey);

// 설문 수정
router.patch("/",handleEditSurvey);

export default router;