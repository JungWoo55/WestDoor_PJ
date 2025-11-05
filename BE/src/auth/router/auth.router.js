import express from "express";
import {
  handleSignUp,
  handleLogin,
  handleRefresh,
  handleLogout,
  handleProfile,
  handleResign
} from "../controller/auth.controller.js";
import { authenticateAccessToken } from "../middleware/auth.middleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
});
router.post("/signup", handleSignUp);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);
router.delete("/resign",authenticateAccessToken, handleResign);
router.post("/refresh", handleRefresh);
router.post(
  "/profile",
  authenticateAccessToken,
  upload.single(),
  handleProfile,
);
export default router;
