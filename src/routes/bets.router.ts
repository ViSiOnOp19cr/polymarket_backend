import express ,{Request, Response} from "express"
import { Placebets } from "../controllers/bets.controller";
import { userMiddlewares } from "../middlewares";

export const betsRoutes = express.Router();

betsRoutes.post("/placebets", userMiddlewares, Placebets);


