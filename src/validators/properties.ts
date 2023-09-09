import { check } from 'express-validator';
import { validateResult } from '../helpers/validationResult';
import { NextFunction, Response, Request } from 'express';  

const validateFile = (req: Request) => {
  if(!req.file) {
    throw new Error('Imagen es requerida')
  }
}

export const validateCreateProperty = [
  check('title')
    .isString()
    .notEmpty()
    .withMessage('Título es requerido'),
  check('description')
    .isString()
    .isLength({ min: 20 })
    .notEmpty()
    .withMessage('Descripción debe tener al menos 20 caracteres'),
  check('bedrooms')
    .isInt()
    .notEmpty()
    .withMessage('Número de habitaciones es requerido'),
  check('garages')
    .isInt()
    .notEmpty()
    .withMessage('Número de cocheras es requerido'),
  check('bathrooms')
    .isInt()
    .notEmpty()
    .withMessage('Número de baños es requerido'),
  check('street')
    .isString()
    .notEmpty()
    .withMessage('Calle es requerida'),
  check('lat')
    .isDecimal()
    .notEmpty()
    .withMessage('Latitud es requerida'),
  check('lng')
    .isDecimal()
    .notEmpty()
    .withMessage('Longitud es requerida'),
  check('categoryId')
    .isInt()
    .notEmpty()
    .withMessage('Categoría es requerida'),
  check('priceId')
    .isInt()
    .notEmpty()
    .withMessage('Precio es requerido'),

  (req: Request, res: Response, next:NextFunction) => validateResult(req, res, next)
]

export const validateImageProperty = [
  check('image')
    .custom(validateFile),
  (req: Request, res: Response, next:NextFunction) => validateResult(req, res, next)
]

export const validateMessageToSeller = [
  check('message')
    .notEmpty()
    .isLength({ min: 10})
    .withMessage('Mensaje debe tener al menos 10 caracteres'),
  (req: Request, res: Response, next:NextFunction) => validateResult(req, res, next)
]
