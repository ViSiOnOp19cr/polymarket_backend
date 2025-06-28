import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/db";
import { MarketCatagory } from "@prisma/client";
import { 
    createMarketSchema, 
    updateMarketSchema, 
    idParamSchema, 
    categoryParamSchema,
    resolveMarketSchema,
    searchQuerySchema 
} from "../lib/validations";

export const createMarket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.userId;
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user || !user.isAdmin) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        // Validate request body
        const validation = createMarketSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ 
                message: "Invalid input",
                errors: validation.error.errors 
            });
            return;
        }

        const { title, description, end_time, catagory } = validation.data;
        const market = await prisma.market.create({
            data: {
                title,
                description,
                isOpen: true,
                catagory,
                end_time: new Date(end_time),
                creator: {
                    connect: { id: userId }
                },
                isLocked: false
            }
        });

        res.status(201).json({
            message: "Market created successfully",
            market
        });
    }
    catch (error) {
        console.error("Error creating market:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const updateMarket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.userId;
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!user || !user.isAdmin) {
            res.status(401).json({ message: "Unauthorized" })
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
        
        // Validate request body
        const bodyValidation = updateMarketSchema.safeParse(req.body);
        if (!bodyValidation.success) {
            res.status(400).json({ 
                message: "Invalid input",
                errors: bodyValidation.error.errors 
            });
            return;
        }
        
        const { title, description, end_time, catagory } = bodyValidation.data;
        const market = await prisma.market.update({
            where: {
                id: paramValidation.data.id
            },
            data: {
                ...(title && { title }),
                ...(description && { description }),
                ...(catagory && { catagory }),
                ...(end_time && { end_time: new Date(end_time) })
            }
        })
        res.status(200).json({ message: "Market updated successfully", market })
    }
    catch (error) {
        console.error("Error updating market:", error);
        res.status(500).json({ message: "Internal server error" })
    }
}
export const getAllMarkets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const markets = await prisma.market.findMany();
        res.status(200).json({ message: "All markets fetched successfully", markets })
    }
    catch (error) {
        console.error("Error fetching markets:", error);
        res.status(500).json({ message: "Internal server error" })
    }
}
export const getMarketById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Validate ID parameter
        const paramValidation = idParamSchema.safeParse(req.params);
        if (!paramValidation.success) {
            res.status(400).json({ 
                message: "Invalid market ID",
                errors: paramValidation.error.errors 
            });
            return;
        }
        
        const market = await prisma.market.findUnique({
            where: {
                id: paramValidation.data.id
            }
        })
        if (!market) {
            res.status(404).json({ message: "Market not found" })
            return;
        }
        res.status(200).json({ message: "Market fetched successfully", market })
    }
    catch (error) {
        console.error("Error fetching market:", error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const openMarket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // i need to find all markets where isOpen is true.
    try {
        const markets = await prisma.market.findMany({
            where: {
                isOpen: true,
                end_time: {
                    gt: new Date()
                }
            }
        });
        if (markets.length === 0) {
            res.status(404).json({ message: "No open markets found" })
            return;
        }
        res.status(200).json({ message: "All open markets fetched successfully", markets })
    }
    catch (error) {
        console.error("Error fetching open markets:", error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const LockBets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        //check for admin
        const userId = req.userId;
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!user || !user.isAdmin) {
            res.status(401).json({ message: "Unauthorized" })
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
        
        //check if market exists
        const market = await prisma.market.findUnique({
            where: {
                id: paramValidation.data.id
            }
        })
        if (!market) {
            res.status(404).json({ message: "Market not found" })
            return;
        }
        if (market.isLocked) {
            res.status(400).json({ message: "Bets already locked" })
            return;
        }
        const lockedMarket = await prisma.market.update({
            where: {
                id: paramValidation.data.id
            },
            data: {
                isLocked: true
            }
        })
        res.status(200).json({ message: "Bets locked successfully", lockedMarket })
    }
    catch (error) {
        console.error("Error locking bets:", error);
        res.status(500).json({ message: "Internal server error" })
    }
}
export const getMarketsByCatagory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Validate category parameter
        const paramValidation = categoryParamSchema.safeParse(req.params);
        if (!paramValidation.success) {
            res.status(400).json({ 
                message: "Invalid category",
                errors: paramValidation.error.errors 
            });
            return;
        }
        
        const markets = await prisma.market.findMany({
            where: {
                catagory: paramValidation.data.catagory
            }
        })
        res.status(200).json({ message: "Markets fetched successfully", markets })
    }
    catch (error) {
        console.error("Error fetching markets by catagory:", error);
        res.status(500).json({ message: "Internal server error" })
    }
}
export const ResolveMarket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        //check for admin 
        const userId = req.userId;
        
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!user || !user.isAdmin) {
            res.status(401).json({ message: "unauthorized" })
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
        
        // Validate request body
        const bodyValidation = resolveMarketSchema.safeParse(req.body);
        if (!bodyValidation.success) {
            res.status(400).json({ 
                message: "Invalid input",
                errors: bodyValidation.error.errors 
            });
            return;
        }
        
        const { outcome } = bodyValidation.data;
        
        const market = await prisma.market.findUnique({
            where: {
                id: paramValidation.data.id
            },
            include:{
                bets:{
                    include:{
                        user:true
                    }
                }
            }
        });

        if (!market || !market.isOpen) {
            res.status(404).json({
                message: "Market not found or it is resolved already"
            })
            return;
        }

        if(outcome === "YES" && (market.Oddsyes === 0 || market.Oddsyes === null)){
            res.status(400).json({message:"Odds for YES are not set"})
            return;
        }

        if(outcome === "NO" && (market.Oddsno === 0 || market.Oddsno === null)){
            res.status(400).json({message:"Odds for NO are not set"})
            return;
        }

        //begin transaction.
        await prisma.$transaction(async (tx) => {
            //update market
            await tx.market.update({
                where: {
                    id: paramValidation.data.id
                },
                data: {
                    isOpen: false,
                    outcome: outcome,
                    end_time: new Date()
                }
            });
            //calcualte the moneys for users. 
            for (const bet of market.bets) {
                const winner = bet.outcome_chosen === outcome;
                //update bets
                await tx.bets.update({
                    where: {
                        id: bet.id
                    },
                    data: {
                        status: winner ? "WON" : "LOST"
                    }
                });
                if (winner) {
                    // Use the odds that were locked in when the bet was placed
                    const payout = Math.floor(bet.amount * bet.odds);
                    //updaet user balance.
                    await tx.user.update({
                        where: {
                            id: bet.userId
                        },
                        data: {
                            balance: {
                                increment: payout
                            }
                        }
                    });
                    //update transaction.
                    await tx.transactions.create({
                        data: {
                            amount: payout,
                            userId: bet.userId,
                            type: "BET_WON"
                        }
                    })
                } else {
                    // update transaction for losers.
                    await tx.transactions.create({
                        data: {
                            userId: bet.userId,
                            amount: bet.amount,
                            type: "BET_PLACED"
                        }
                    });
                }
            }
        });
        res.status(200).json({
            message: "Market resolved successfully"
        })
    }
    catch (error) {
        console.error("Error resolving market:", error);
        res.status(500).json({ message: "Internal server error" })
    }
}
export const searchMarketByTitle = async(req:Request, res:Response, next:NextFunction): Promise<void> =>{
    try{
        // Validate query parameters
        const queryValidation = searchQuerySchema.safeParse(req.query);
        if (!queryValidation.success) {
            res.status(400).json({ 
                message: "Invalid query",
                errors: queryValidation.error.errors 
            });
            return;
        }
        
        const { title: titleQuery } = queryValidation.data;
        
        const markets = await prisma.market.findMany({
            where:{
                title:{
                    contains:titleQuery,
                    mode:'insensitive'
                }
            },
            orderBy:{
                createdAt:'desc'
            }
        });
        res.status(200).json({
            markets
        });
    }catch(error){
        res.status(500).json({
            message:"somthing is wrong. Try again later."
        })
    }
}



