import { Router } from 'express';
import { PriceController } from '../controllers/price.controller';

export default class PriceRoutes {
  private readonly router: Router;
  constructor(private priceController: PriceController) {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get('/prices', this.priceController.getPrices)
  }

  public getRouter(): Router {
    return this.router
  }
}
