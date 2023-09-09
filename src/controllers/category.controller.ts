import { Response, Request } from 'express';
import { prisma } from '../config/db';

export class CategoryController {
  public async getCategories(req: Request, response: Response) {
    const categories = await prisma.category.findMany();
    response.json(categories);
  }

  public async getPropertiesByCategory(req: Request, response: Response) {
    const { id } = req.params;
    const properties = await prisma.property.findMany({ where: { categoryId: Number(id) }, include: { category: true, price: true} });
    response.json(properties);
  }
}
