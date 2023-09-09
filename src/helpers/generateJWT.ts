import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET as string;

export const generateJWT = (id: number, name: string) => {
  return jwt.sign({id, name}, SECRET, { expiresIn: '1d'})
}
