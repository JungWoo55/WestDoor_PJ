import express from "express";
import {getUsers} from "../user/controller/user.controller.js"
import userRouter from "../user/router/user.router.js"

const router = express.Router();

router.get("/", (req,res)=>{
    res.send('백엔드 연결 성공!');
});
router.use("/user", userRouter);
export default router;