import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCurrentUser, updateProfile } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.js";

let userRouter = express.Router();

userRouter.get("/currentuser", isAuthenticated, getCurrentUser);
userRouter.post("/updateprofile", isAuthenticated, upload.single("photoUrl"), updateProfile);

export default userRouter;