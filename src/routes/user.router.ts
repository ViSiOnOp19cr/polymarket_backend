import express, { Request, Response, NextFunction } from "express"
import { SignUp, SignIn, Me, leaderboard } from "../controllers/user.controller";
import { userMiddlewares } from "../middlewares/index";

export const userRoutes = express.Router();

userRoutes.post("/signup", SignUp);
userRoutes.post("/signin", SignIn);
userRoutes.get("/me", userMiddlewares, Me);
userRoutes.get("/leaderboard", userMiddlewares, leaderboard);

export default userRoutes;