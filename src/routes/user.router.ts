import express, { Request, Response, NextFunction } from "express"
import { SignUp, SignIn,Me } from "../controllers/user.controller";

export const userRoutes = express.Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

userRoutes.post("/signup", asyncHandler(SignUp));
userRoutes.post("/signin", asyncHandler(SignIn));
userRoutes.get("/me", asyncHandler(Me));
