import express from "express";
import multer from "multer";
import { getAddHome, postAddHome } from "../controllers/homes.js";

export const hostRouter = express.Router();

// Ye line sabse important hai - bas yehi rakho
const upload = multer({ dest: '/tmp' });

hostRouter.get("/add-home", getAddHome);
hostRouter.post("/add-home", upload.single("file"), postAddHome);