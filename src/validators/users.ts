import { check } from 'express-validator'
import { validateResult } from '../helpers/validationResult'
import { NextFunction, Response, Request } from 'express';
import { prisma }  from '../config/db'

export const validateCreateUser = [
  check('name')
    .isString()
    .notEmpty()
    .isLength({ min: 3})
    .withMessage('Nombre es requerido y debe tener al menos 3 caracteres'),
  check('email')
    .normalizeEmail()
    .notEmpty()
    .isEmail()
    .withMessage('Email no válido'),
  check('password')
    .isString()
    .notEmpty()
    .isLength({ min: 6})
    .withMessage('Contraseña debe tener al menos 6 caracteres'),
  check('confirmPassword')
    .isString()
    .notEmpty()
    .withMessage('Confirmar contraseña es requerida'),
  (req: Request, res: Response, next:NextFunction) => validateResult(req, res, next)
];

export const validateLogin = [
  check('email')
    .isEmail()
    .withMessage('Email no válido')
    .notEmpty(),
  check('password')
    .isString()
    .notEmpty()
    .withMessage('Contraseña es requerida'),
  (req: Request, res: Response, next:NextFunction) => validateResult(req, res, next)
]

const isEmailExist = async (email: string) => {
  const isExistEmail = await prisma.user.findFirst({ where: { email }})
  if (isExistEmail) {
    throw new Error('Email ya existe')
  }
}

export const validateEmail = [
  check('email')
    .custom(isEmailExist),
  (req: Request, res: Response, next:NextFunction) => validateResult(req, res, next)
]

export const validateEmailForResetPassword = [
  check('email')
    .isEmail()
    .notEmpty()
    .withMessage('Email no válido'),
  (req: Request, res: Response, next:NextFunction) => validateResult(req, res, next)
];

export const validateChangePassword = [
  check('password')
    .isLength({ min: 6})
    .isString()
    .withMessage('Contraseña debe tener al menos 6 caracteres'),
    (req: Request, res: Response, next: NextFunction) => validateResult(req, res, next)
]
