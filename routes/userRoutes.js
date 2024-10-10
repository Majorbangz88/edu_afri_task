import express from 'express';
import { registerUser, loginUser, buyCourse } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    addCourse,
    updateCourse,
    findCourse,
    findCourseByName,
    deleteCourse,
    deleteCourseByName
} from "../controllers/instructorController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/buy", authMiddleware, buyCourse);
userRouter.post('/add', authMiddleware, addCourse);
userRouter.patch("/update/:courseId", authMiddleware, updateCourse);
userRouter.get('/find', authMiddleware, findCourse);
userRouter.get('/find/name', authMiddleware, findCourseByName);
userRouter.delete('/delete', authMiddleware, deleteCourse);
userRouter.delete('/delete/name', authMiddleware, deleteCourseByName);

export default userRouter;