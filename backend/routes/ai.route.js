import express from "express";
import { searchWithAi } from "../controllers/ai.controller.js";

let aiRouter = express.Router();

aiRouter.post("/search", searchWithAi);

export default aiRouter;