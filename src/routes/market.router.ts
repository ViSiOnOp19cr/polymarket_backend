import express, {Request, Response} from "express";
import { userMiddlewares } from "../middlewares/index";
import { createMarket, updateMarket, getAllMarkets, ResolveMarket, LockBets, openMarket, getMarketById, getMarketsByCatagory } from "../controllers/market.controller";

export const marketRoutes = express.Router();

marketRoutes.post("/create", userMiddlewares, createMarket);
marketRoutes.put("/update/:id", userMiddlewares, updateMarket);
marketRoutes.get("/getallmarkets", userMiddlewares, getAllMarkets);
marketRoutes.get("/getmarket/:id", userMiddlewares, getMarketById);
marketRoutes.get("/openmarkets", userMiddlewares, openMarket);
marketRoutes.get("/getmarketsbycatagory/:catagory", userMiddlewares, getMarketsByCatagory);
marketRoutes.post("/lockbets/:id", userMiddlewares, LockBets);
marketRoutes.post("/resolvemarket/:id", userMiddlewares, ResolveMarket);





