import { prisma } from "../lib/db"
import { Request, Response, NextFunction } from 'express';
import { signupSchema, signinSchema } from '../lib/validations';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../lib/config';

export const SignUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const validateSignup = signupSchema.safeParse(req.body);

        if(!validateSignup.success){
            res.status(400).json({
                message: "Invalid input",
                errors: validateSignup.error.errors
            });
            return;
        }
        const {email, password} = validateSignup.data;
        
        const salt = 12;
        const hash = await bcrypt.hash(password, salt);
        
        const user = await prisma.user.findUnique({
            where:{
                email: email
            }
        });
        
        if(user){
            res.status(400).json({error:"user already exists"});
            return;
        }
        
        const newuser = await prisma.user.create({
            data:{
                email: email,
                password: hash,
                balance: 10000,
                isAdmin: false,
            }
        });
        
        res.status(201).json({message:"user created successfully"});
    }
    catch(e){
        console.error('SignUp error:', e);
        res.status(500).json({message:"something is fishy try again later."});
    }
}

export const SignIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const Loginvalidation = signinSchema.safeParse(req.body);
        if(!Loginvalidation.success){
            res.status(400).json({
                message: "Invalid input",
                errors: Loginvalidation.error.errors
            });
            return;
        }
        const {email, password} = Loginvalidation.data;
        
        const user = await prisma.user.findUnique({
            where:{
                email: email
            }
        });
        
        if(!user){
            res.status(400).json({
                message:"email doesn't exist"
            });
            return;
        }
        
        const hashedpassword = await bcrypt.compare(password, user.password);
        if(!hashedpassword){
            res.status(400).json({
                message:"invalid password"
            });
            return;
        }
        
        const token = jwt.sign(
            {id: user.id},
            JWT_SECRET,
        );
        
        res.status(200).json({
            message:"logged in successfully",
            token: token
        });

    } catch(error){
        console.error('SignIn error:', error);
        res.status(500).json({
            message:"something seems to be fishy"
        });
    }
}

export const Me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        if (!req.userId) {
            res.status(401).json({
                message: "User ID not found in request"
            });
            return;
        }

        const user = await prisma.user.findUnique({
            where:{
                id: req.userId
            },
            select: {
                id: true,
                email: true,
                balance: true,
                isAdmin: true,
                // Don't return password
            }
        });
        
        if(!user){
            res.status(404).json({
                message:"user not found"
            });
            return;
        }
        
        res.status(200).json({
            message:"user found",
            user: user
        });
    }
    catch(error){
        console.error('Me error:', error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}
export const leaderboard = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const bets = await prisma.bets.findMany({
            where:{status:"WON"},
            select:{
                userId:true,
                amount:true,
                odds:true
            }
        });
        const userMap:Record<number, number> = {};
        for (const bet of bets){
            const winnings = Math.floor(bet.amount * bet.odds);
            userMap[bet.userId] = (userMap[bet.userId] || 0) + winnings;
        }
        const userIds = Object.keys(userMap).map(id => parseInt(id));
        const users = await prisma.user.findMany({
            where:{id:{in:userIds}},
            select:{
                id:true,
                email:true
            }
        });
        const leaderboards = users.map(user=>({
            userId:user.id,
            email:user.email,
            totalWinnings:userMap[user.id] || 0      
        }));
        leaderboards.sort((a,b) =>b.totalWinnings - a.totalWinnings);
        res.status(200).json({
            leaderboard: leaderboards
        });
    }catch(error){
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

