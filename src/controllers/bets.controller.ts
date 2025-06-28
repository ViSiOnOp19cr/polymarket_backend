import {Request, Response, NextFunction} from "express"
import { prisma } from "../lib/db";



export const Placebets = (req:Request, res:Response, next:NextFunction) =>{
    try{
        const userId = req.userId;
        const {amount , marketId , outcome_chosen} = req.body;

        if(!["YES","NO"].includes(outcome_chosen)){
            res.status(400).json({
                message:"Invaild outcome"
            });
            return;
        }
        const [user,market] = await Promise.all([
            prisma.user.findUnique({where:{id:userId}}),
            prisma.market.findUnique({
                where:{id:marketId},
                include:{
                    bets:true,
                },
            }),
        ]);
        if(!user) {
            res.status(404).json({
                message:"user not found"
            });
            return;
        }
        if(!market){
            res.status(404).json({
                message:"market not found"
            });
            return;
        }
        if(!market.isOpen || market.isLocked){
            res.status(400).json({
                message:"market is closed right now."
            });
            return;
        }
        if(user.balance < amount){
            res.status(400).json({
                message:"Insufficient balance"
            });
            return;
        }
        //calculation of dynamic odds.
        let totalYes = 0;
        let totalNo = 0;
        for( const bet of market.bets){
            if(bet.outcome_chosen === "YES") totalYes += bet.amount;
            else if (bet.outcome_chosen === "NO") totalNo += bet.amount;
        }
        //include the current bet to odds.
        if(outcome_chosen === 'YES') totalYes += amount;
        else totalNo += amount;

        const total = totalYes + totalNo;
        const oddsYes = totalYes > 0 ? parseFloat((total/totalYes).toFixed(2)) : 1;
        const oddsNo = totalNo > 0 ? parseFloat((total/totalNo).toFixed(2)) : 1;

        const odds = outcome_chosen === "YES" ? oddsYes : oddsNo;
        // begin transaction.
        await prisma.$transaction(async(tx)=>{
            await tx.bets.create({
                data:{
                    userId,
                    marketId,
                    amount,
                    outcome_chosen,
                    odds,
                    status:'PENDING',
                }
            });
            // deduct balance from user
            await tx.user.update({
                where:{id:userId},
                data:{
                    balance:{
                        decrement:amount
                    }
                }
            });
            //log transactions.
            await tx.transactions.create({
                data:{
                    userId,
                    amount,
                    type:"BET_PLACED"
                }
            });
            //update current market odds.
            await tx.market.update({
                where:{id:marketId},
                data:{
                    Oddsyes:oddsYes,
                    Oddsno:oddsNo
                }
            });
        });
        res.status(201).json({
            message:"bet placed succesfully",
            bet:{
                amount,
                outcome_chosen,
                odds
            },
            updatedMarketOdds:{
                oddsYes,
                oddsNo
            }
        });
        return;
    }catch(error){
        console.error("Error placing bet:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const Getallbets = (req:Request, res:Response, next:NextFunction)=>{
    try{
        const userId = req.userId;
        
    }
}