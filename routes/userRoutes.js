import express from 'express';
import { registerUser, loginUser, buyCourse } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/buy", authMiddleware, buyCourse);

export default userRouter;