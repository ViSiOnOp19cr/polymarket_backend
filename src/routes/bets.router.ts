import express ,{Request, Response} from "express"
import { Placebets, Getallbets, GetallbetsMarket } from "../controllers/bets.controller";
import { userMiddlewares } from "../middlewares";

export const betsRoutes = express.Router();

betsRoutes.post("/placebets", userMiddlewares, Placebets);
betsRoutes.get("/getallbets", userMiddlewares, Getallbets);
betsRoutes.get("/getallbetsmarket/:id", userMiddlewares, GetallbetsMarket);


