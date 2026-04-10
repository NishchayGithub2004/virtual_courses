import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLecture, getCreatorById, getCreatorCourses, getPublishedCourses, removeCourse, removeLecture } from "../controllers/course.controller.js";
import upload from "../middlewares/multer.js";

let courseRouter = express.Router();

courseRouter.post("/create", isAuthenticated, createCourse);
courseRouter.get("/getpublishedcoures", getPublishedCourses);
courseRouter.get("/getcreatorcourses", isAuthenticated, getCreatorCourses);
courseRouter.post("/editcourse/:courseId", isAuthenticated, upload.single("thumbnail"), editCourse);
courseRouter.get("/getcourse/:courseId", isAuthenticated, getCourseById);
courseRouter.delete("/removecourse/:courseId", isAuthenticated, removeCourse);
courseRouter.post("/createlecture/:courseId", isAuthenticated, createLecture);
courseRouter.get("/getcourselecture/:courseId", isAuthenticated, getCourseLecture);
courseRouter.post("/editlecture/:lectureId", isAuthenticated, upload.single("videoUrl"), editLecture);
courseRouter.delete("/removelecture/:lectureId", isAuthenticated, removeLecture);
courseRouter.post("/getcreator", isAuthenticated, getCreatorById);

export default courseRouter;