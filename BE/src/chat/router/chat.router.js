import express from "express";
import {
  handleSendMessage,
} from "../controller/chat.controller.js";
import { authenticateAccessToken } from "../../auth/middleware/auth.middleware.js";

const router = express.Router();

// 인증이 필요한 엔드포인트
router.post("/", authenticateAccessToken, handleSendMessage);

export default router;
