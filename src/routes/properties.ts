import { Router } from "express";
import { PropertyController } from "../controllers/property.controller";
import { validateCreateProperty, validateMessageToSeller } from "../validators/properties";
import isAuthenticated from "../middlewares/isAuthenticated";
import upload from "../middlewares/uploadImage";
import { MessageController } from "../controllers/message.controller";

export default class PropertiesRoutes {
  private readonly router: Router;
  constructor(
    private propertyController: PropertyController,
    private messageController: MessageController
  ) {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get('/properties', isAuthenticated, this.propertyController.getProperties)
    this.router.post('/properties',isAuthenticated, upload.single('image'), validateCreateProperty, this.propertyController.createProperty)
    this.router.get('/properties/news', this.propertyController.getNews)
    this.router.get('/properties/latest', this.propertyController.getThreeLatestProperties)
    this.router.get('/properties/search', this.propertyController.searchProperties)
    this.router.get('/properties/:id', isAuthenticated, this.propertyController.getProperty)
    this.router.get('/properties/published/:id', this.propertyController.getPropertyPublished)
    this.router.patch('/properties/:id/publish', isAuthenticated, this.propertyController.updatePropertyPublished)
    this.router.post('/properties/:id/messages', isAuthenticated, validateMessageToSeller, this.propertyController.sendMessagetoSeller)
    this.router.get('/properties/:id/messages', isAuthenticated, this.messageController.getMessagesOfProperty);
    this.router.put('/properties/:id', isAuthenticated, upload.single('image'), validateCreateProperty, this.propertyController.updateProperty)
    this.router.delete('/properties/:id', isAuthenticated, this.propertyController.deleteProperty)
  }

  public getRouter(): Router {
    return this.router;
  }
}
