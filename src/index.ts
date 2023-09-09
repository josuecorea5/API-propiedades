import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import userRoutes from './routes/users'
import categoryRoutes from './routes/categories'
import priceRoutes from './routes/prices'
import propertyRoutes from './routes/properties'
import { UserController } from './controllers/user.controller'
import { CategoryController } from './controllers/category.controller';
import { PriceController } from './controllers/price.controller';
import { PropertyController } from './controllers/property.controller';
import { multerErrorHandler } from './middlewares/multerErrorHandler';
import { MessageController } from './controllers/message.controller';

const app = express()

app.use(cors())

app.use(cookieParser());

const userController = new UserController()
const categoryController = new CategoryController()
const priceController = new PriceController()
const propertyController = new PropertyController()
const messageController = new MessageController()

app.use(express.json())

const userRouter = userRoutes(userController)
const categoryRouter = new categoryRoutes(categoryController)
const priceRouter = new priceRoutes(priceController)
const propertyRouter = new propertyRoutes(propertyController, messageController)

app.use('/api/v1',  userRouter)
app.use('/api/v1', categoryRouter.routes())
app.use('/api/v1', priceRouter.getRouter())
app.use('/api/v1', propertyRouter.getRouter())

app.use(multerErrorHandler);

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
