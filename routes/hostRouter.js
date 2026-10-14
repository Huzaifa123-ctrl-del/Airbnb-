import express from "express";

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
export const hostRouter = express.Router();
import { getAddHome, postAddHome } from "../controllers/homes.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "public", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

hostRouter.get("/add-home", getAddHome);
hostRouter.post("/add-home", upload.single("file"), postAddHome);
