import express, { Router } from 'express';

import { UserController } from '../controllers/user.controller';
import { validateChangePassword, validateCreateUser, validateEmail, validateEmailForResetPassword, validateLogin } from '../validators/users';

const userRoutes = (userController: UserController): Router => {
  const router = express.Router();

  router.post('/login', validateLogin, userController.login)

  router.post('/register', validateCreateUser, validateEmail, userController.register)

  router.get('/confirm/:token', userController.confirm)

  router.post('/forgot-password', validateEmailForResetPassword, userController.forgotPassword)

  router.get('/reset-password/:token', userController.checkTokenForResetPassword)

  router.post('/reset-password/:token', validateChangePassword, userController.changePassword)

  return router;
}

export default userRoutes;
