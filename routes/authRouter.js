import express from "express";
const authRouter = express.Router();
import { getLogin } from "../controllers/homes.js";
import { getSignUp } from "../controllers/homes.js";
import { postSignup } from "../controllers/homes.js";
import { postLogin } from "../controllers/homes.js";
import { postLogout } from "../controllers/homes.js";

authRouter.get("/auth/login", getLogin);
authRouter.get("/auth/signUp", getSignUp);
authRouter.post("/auth/signUp", postSignup);
authRouter.post("/auth/login", postLogin);
authRouter.post("/auth/logout", postLogout);

export default authRouter;
