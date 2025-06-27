import {Request,Response,NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

interface userRequest extends Request{
    userId?:number
}
const JWT_SECRET = process.env.JWT_SECRET;

export const userMiddlewares = async(req:userRequest,res:Response,next:NextFunction)=>{
    try{
    const token = req.headers.authorization;
    if(!token){
        res.status(401).send({
            message:'unauthorized'
        });
        return;
    }
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment");
    }
    const decoded = jwt.verify(token,JWT_SECRET) as {id:string};
    if(decoded){
        if(typeof decoded === 'string'){
            res.status(403).json({
                message:"Not logged in"
            });
            return;
        }
        req.userId = parseInt(decoded.id);
        next();
    }
    }catch(e){
        res.status(500).json({
            message:"auth failed"
        });
    }

}