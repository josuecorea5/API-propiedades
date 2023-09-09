import e, { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { prisma } from "../config/db";

export interface RequestWithUserId extends Request {
  userId?: number;
}

const isAuthenticated = async (req: RequestWithUserId, response: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if(!authorization) {
    return response.status(401).json({ message: 'Unauthorized' });
  }
  const token = authorization.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    const { id } = decoded as { id: number}
    
    const user = await prisma.user.findFirst({ where: {  id }, select: { id: true}})

    if(!user) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    req.userId = user.id;

    return next();
  } catch (error: any) {

    return response.status(500).json({ message: 'Internal server error' });
  }
}

export default isAuthenticated;