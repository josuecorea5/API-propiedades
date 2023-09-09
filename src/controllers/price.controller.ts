import { prisma } from "../config/db";
import { Request, Response } from "express";

export class PriceController {
  public async getPrices(req: Request, response: Response) {
    const prices = await prisma.price.findMany();
    response.json(prices);
  }
}
