import express from "express";
import authRouter from "../auth/router/auth.router.js";
import libraryRouter from "../library/router/library.router.js";
import surveyRouter from "../survey/router/survey.router.js";

const router = express.Router({ mergeParams: true });
router.get("/", (req, res) => {
  /* #swagger.summary = '서버 연결 테스트'
    #swagger.description = '서버가 정상적으로 실행 중인지 확인합니다.'
    #swagger.tags = ['Default']
    #swagger.responses[200] = {
      description: '연결 성공',
      content: { "text/plain": { schema: { type: "string", example: "백엔드 연결 성공!" } } }
    }
  */
  res.send('백엔드 연결 성공!');
});
router.use("/auth", authRouter);
router.use("/library", libraryRouter);
router.use("/survey", surveyRouter);
export default router;