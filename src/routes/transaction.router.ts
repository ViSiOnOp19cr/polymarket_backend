import express from "express"
import { userMiddlewares } from "../middlewares";
import { getAllTransacitons } from "../controllers/transaction.contoller";

export const transactionRoutes = express.Router();

transactionRoutes.get("/getalltransactions", userMiddlewares,getAllTransacitons);