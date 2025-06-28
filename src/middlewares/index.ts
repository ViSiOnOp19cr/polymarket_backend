import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../lib/config'

export const userMiddlewares = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            res.status(401).json({
                message: 'Authorization header required'
            });
            return;
        }

        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;

        if (!token) {
            res.status(401).json({
                message: 'Token required'
            });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
        
        if (decoded && decoded.id) {
            req.userId = decoded.id;
            next();
        } else {
            res.status(403).json({
                message: "Invalid token"
            });
        }
    } catch (e) {
        console.error('Auth middleware error:', e);
        res.status(403).json({
            message: "Invalid or expired token"
        });
    }
}