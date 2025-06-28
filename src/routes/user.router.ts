import express, { Request, Response, NextFunction } from "express"
import { SignUp, SignIn, Me } from "../controllers/user.controller";
import { userMiddlewares } from "../middlewares/index";

export const userRoutes = express.Router();

userRoutes.post("/signup", SignUp);
userRoutes.post("/signin", SignIn);
userRoutes.get("/me", userMiddlewares, Me);

export default userRoutes;