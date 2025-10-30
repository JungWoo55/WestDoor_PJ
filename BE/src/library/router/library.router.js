import express from "express";
import {
    handleAddBook,
    handleGetMyLibrary,
    handleRemoveBook,
    handleReadBook
} from "../controller/library.controller.js";
import {
  authenticateAccessToken,
  verifyUserIsActive,
} from "../../auth/middleware/auth.middleware.js";

const router = express.Router();
/* 내 서재 접근 제한 핸들러
 * 모든 라우트는 인증된 사용자만 접근 가능합니다.
 * AccessToken 인증과 사용자 활성화 여부를 검증합니다.
 */
router.use(authenticateAccessToken, verifyUserIsActive);

// 내 서재 목록 조회
router.get("/", handleGetMyLibrary);

// 내 서재 추가
router.post("/", handleAddBook);

// 내 서재 삭제
router.delete("/:isbn/:page", handleRemoveBook);

// 내 서재 읽은 책 추가
router.patch("/", handleReadBook);
export default router;