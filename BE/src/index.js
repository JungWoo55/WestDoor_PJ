import dotenv from "dotenv";
dotenv.config();
import { setupSwagger } from "./config/swagger.js";
import router from "./router/router.js";
import {setupCommonError, setupExpress} from "./config/express.js";
import cookieParser from "cookie-parser";
 
const app = setupExpress();
const port = process.env.PORT;

setupSwagger(app);

app.use(cookieParser());
app.use("/api", router);
setupCommonError(app);
app.listen(port, () => {
  console.log(`서버 열림 - 포트 : ${port}`);
});
