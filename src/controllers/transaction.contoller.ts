import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/db"

export const getAllTransacitons = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const userId = req.userId;
        const transactions = await prisma.transactions.findMany({
            where:{userId}
        });
        if(!transactions){
            res.status(400).json({message:"NO Transaction found for the user."});
            return;
        }
        res.status(200).json({transactions});
    }catch(error){
        res.status(500).json({message:"something went wrong. try again later."})
    }
}