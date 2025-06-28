import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validateBody = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
      res.status(400).json({
        message: "Validation error",
        errors: result.error.errors
      });
      return;
    }
    
    req.body = result.data;
    next();
  };
};

export const validateParams = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    
    if (!result.success) {
      res.status(400).json({
        message: "Invalid parameters",
        errors: result.error.errors
      });
      return;
    }
    
    req.params = result.data as any;
    next();
  };
};

export const validateQuery = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    
    if (!result.success) {
      res.status(400).json({
        message: "Invalid query parameters",
        errors: result.error.errors
      });
      return;
    }
    
    req.query = result.data as any;
    next();
  };
}; 