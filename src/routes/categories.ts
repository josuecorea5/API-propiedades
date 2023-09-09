import express, { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';

export default class CategoryRoutes {
  constructor(private categoryController: CategoryController) {}
  private router = express.Router();

  public routes(): Router {
    this.router.get('/categories', this.categoryController.getCategories)
    this.router.get('/categories/:id/properties', this.categoryController.getPropertiesByCategory)
    return this.router
  }
}
