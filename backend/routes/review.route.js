import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { addReview, getAllReviews } from "../controllers/review.controller.js";

let reviewRouter = express.Router();

reviewRouter.post("/givereview", isAuthenticated, addReview);
reviewRouter.get("/allReview", getAllReviews);

export default reviewRouter;