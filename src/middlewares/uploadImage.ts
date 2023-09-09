import { Request } from 'express';
import multer from 'multer';
import path from 'node:path';
import { generateEmailTokenConfirm } from '../helpers/generateEmailToken';

type DestinationCallback = (error: Error | null, destination: string) => void;

const storage = multer.diskStorage({
  filename: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
    cb(null, generateEmailTokenConfirm() + path.extname(file.originalname))
  }
})

const upload = multer({ storage, fileFilter: (req, file, cb) => {
  if(!file) {
    return cb(new Error('Imagen es requerida'))
  }

  const extensionsAllowed = ['png', 'jpg', 'jpeg']
  const extensionFile = file?.mimetype.split('/').pop();
  if(!extensionsAllowed.includes(extensionFile as string)) {
    return cb(new Error('Formato de imagen no permitido'))
  }
  cb(null, true)
} })

export default upload;
