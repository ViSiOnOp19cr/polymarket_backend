import { prisma } from "../lib/db"
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;




const validation = z.object({
    email: z.string()
            .email("invalid email")
            .min(3,"email must be min 3 letters"),
    password: z.string()
            .min(8,"password must be min 8 letters")
            .max(30,"password must be max 30 letters")
})

export const SignUp = async(req: Request, res: Response, next: NextFunction): Promise<Response<any> | void> => {
    try {
        const validateSignup = validation.safeParse(req.body);

        if(!validateSignup.success){
            return res.status(400).json({
                message:"Invalid input"
            })
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
            return res.status(400).json({error:"user already exists"});
        }
        
        const newuser = await prisma.user.create({
            data:{
                email: email,
                password: hash,
                balance: 10000,
                isAdmin:false,
            }
        });
        
        return res.status(201).json({message:"user created successfully"});
    }
    catch(e){
        console.error('SignUp error:', e);
        return res.status(500).json({message:"something is fishy try again later."})
    }
}

export const SignIn = async(req: Request, res: Response, next: NextFunction): Promise<Response<any> | void> => {
    try{
        const Loginvalidation = validation.safeParse(req.body);
        if(!Loginvalidation.success){
            return res.status(400).json({
                message:"invalid input form"
            })
        }
        const {email, password} = Loginvalidation.data;
        
        const user = await prisma.user.findUnique({
            where:{
                email: email
            }
        });
        
        if(!user){
            return res.status(400).json({
                message:"username doesn't exist"
            })
        }
        
        const hashedpassword = await bcrypt.compare(password, user.password);
        if(!hashedpassword){
            return res.status(400).json({
                message:"invalid password"
            })
        }
        
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment");
        }
        
        const token = jwt.sign(
            {id: user.id},
            JWT_SECRET,
        )
        
        return res.status(200).json({
            message:"logged in successfully",
            token: token
        })

    } catch(error){
        console.error('SignIn error:', error);
        return res.status(500).json({
            message:"something seems to be fishy"
        })
    }
}
export const Me = async(req:Request, res:Response, next:NextFunction): Promise<Response<any> | void> => {
    try{
        const user = await prisma.user.findUnique({
            where:{
                id: req.userId
            }
        })
        if(!user){
            return res.status(400).json({
                message:"user not found"
            })
        }
        return res.status(200).json({
            message:"user found",
            user: user
        })
    }
    catch(error){
        console.error('Me error:', error);
    }
}

