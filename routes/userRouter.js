import express from "express";
const userRouter = express.Router();
import { getHomes } from "../controllers/homes.js";
import { getHomesDetails } from "../controllers/homes.js";

userRouter.get("/", getHomes);
userRouter.get("/homes/:homeId", getHomesDetails);

export default userRouter;
