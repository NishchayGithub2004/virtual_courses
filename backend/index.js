import express from "express";
import dotenv from "dotenv";
import connectDb from "./configs/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import courseRouter from "./routes/course.route.js";
import paymentRouter from "./routes/payment.route.js";
import aiRouter from "./routes/ai.route.js";
import reviewRouter from "./routes/review.route.js";

dotenv.config();

let port = process.env.PORT || 5000;

let app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/ai", aiRouter);
app.use("/api/review", reviewRouter);

app.get("/", (_, res) => {
  res.send("Hello from server");
});

app.listen(port, () => {
  console.log("Server Started");
  connectDb();
});