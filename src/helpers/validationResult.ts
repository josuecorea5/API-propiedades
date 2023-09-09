import { NextFunction, Request, Response } from 'express';
import { validationResult, ValidationError, check } from 'express-validator';
import { unlink } from 'node:fs/promises';

export const validateResult = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(req.body.confirmPassword) {
      await check('password').equals(req.body.confirmPassword).withMessage('Las contraseñas con coinciden').run(req);
    }
    validationResult(req).throw();  
    return next();
  } catch (error) {
    if(req.file) {
      unlink(req.file.path)
        .then(() => console.log('Image deleted'))
        .catch((error) => console.log(error));
    }
    const errors = error as ValidationError[];
    res.status(400).send(errors);
  }
};
