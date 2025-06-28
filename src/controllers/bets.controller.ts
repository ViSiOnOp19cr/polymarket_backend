import {Request, Response, NextFunction} from "express"
import { prisma } from "../lib/db";
import { placeBetSchema, idParamSchema } from "../lib/validations";



export const Placebets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
  
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      // Validate request body
      const validation = placeBetSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid input",
          errors: validation.error.errors 
        });
      }

      const { amount, marketId, outcome_chosen } = validation.data;
  
      const [user, marketExists] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.market.findUnique({ where: { id: marketId } }),
      ]);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (!marketExists) {
        return res.status(404).json({ message: "Market not found" });
      }
  
      if (!marketExists.isOpen || marketExists.isLocked) {
        return res.status(400).json({ message: "Market is closed." });
      }
  
      if (user.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
  
      
      const result = await prisma.$transaction(async (tx) => {
        
        //lock the market row first to avoid race condition.
        await tx.$executeRawUnsafe(`SELECT * FROM "Market" WHERE id = $1 FOR UPDATE`, marketId);
  
      
        const market = await tx.market.findUnique({
          where: { id: marketId },
          include: { bets: true },
        });
  
        if (!market) throw new Error("Market not found inside tx");
  
       
        let totalYes = 0;
        let totalNo = 0;
  
        for (const bet of market.bets) {
          if (bet.outcome_chosen === "YES") totalYes += bet.amount;
          else if (bet.outcome_chosen === "NO") totalNo += bet.amount;
        }
  
  
        if (outcome_chosen === "YES") totalYes += amount;
        else totalNo += amount;
  
        const total = totalYes + totalNo;
        const oddsYes = totalYes > 0 ? parseFloat((total / totalYes).toFixed(2)) : 1;
        const oddsNo = totalNo > 0 ? parseFloat((total / totalNo).toFixed(2)) : 1;
        const odds = outcome_chosen === "YES" ? oddsYes : oddsNo;
  
        
        await tx.bets.create({
          data: {
            type: "MARKET_BET",
            userId,
            marketId,
            amount,
            outcome_chosen,
            odds,
            status: "PENDING",
          },
        });
  
        await tx.user.update({
          where: { id: userId },
          data: {
            balance: {
              decrement: amount,
            },
          },
        });
  
        await tx.transactions.create({
          data: {
            userId,
            amount,
            type: "BET_PLACED",
          },
        });
  
        await tx.market.update({
          where: { id: marketId },
          data: {
            Oddsyes: oddsYes,
            Oddsno: oddsNo,
          },
        });
  
        return { odds, oddsYes, oddsNo }; 
      });
  
      
      res.status(201).json({
        message: "Bet placed successfully",
        bet: {
          amount,
          outcome_chosen,
          odds: result.odds,
        },
        updatedMarketOdds: {
          oddsYes: result.oddsYes,
          oddsNo: result.oddsNo,
        },
      });
    } catch (error) {
      console.error("Error placing bet:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

export const Getallbets = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const bets = await prisma.bets.findMany({
            where:{
                userId,
            }
        });
        res.status(200).json({bets});
    }
    catch(error){
        res.status(500).json({message:"Something is wrong"});
    }
}
export const GetallbetsMarket = async(req:Request, res:Response, next:NextFunction) =>{
    try{
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    
    // Validate ID parameter
    const paramValidation = idParamSchema.safeParse(req.params);
    if (!paramValidation.success) {
        res.status(400).json({ 
            message: "Invalid market ID",
            errors: paramValidation.error.errors 
        });
        return;
    }
    
    const bets = await prisma.bets.findMany({
        where:{
            marketId : paramValidation.data.id,
            userId
        }
    });
    res.status(200).json({bets});
    }catch(error){
        res.status(500).json({
            message:"something is wrong. Try again later"
        })
    }
}