import { NextFunction, Request, Response } from "express";

export const multerErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  return res.status(400).json({ message: err.message })
}
