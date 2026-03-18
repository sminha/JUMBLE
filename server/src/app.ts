import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import express from "express";
import authRouter from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("서버가 정상적으로 작동 중입니다! 🚀");
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
