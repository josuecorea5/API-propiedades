import { Response, Request } from "express";
import { prisma } from '../config/db'

import { comparePassword, hashPassword } from '../helpers/hashPassword';
import { generateEmailTokenConfirm } from "../helpers/generateEmailToken";
import { emailConfirmation, emailForgotPassword } from "../helpers/emailConfirmation";
import { generateJWT } from "../helpers/generateJWT";


export class UserController {
  public async login(req: Request, response: Response) {

    const { email, password } = req.body;

    const user = await prisma.user.findFirst({ where: { email }});

    if(!user) {
      return response.status(400).json({ message: 'Usuario no encontrado', error: true });
    }

    if(!user.confirmed) {
      return response.status(400).json({ message: 'Usuario no confirmado, confirma tu email', error: true });
    }

    const isMatchPassword = await comparePassword(password, user.password);

    if(!isMatchPassword) {
      return response.status(400).json({ message: 'Credenciales incorrectas', error: true });
    }

    const userToken = generateJWT(user.id, user.name);

    response.json({ token: userToken})
  }

  public async register(req: Request, response: Response) {
    const { confirmPassword, ...username } = req.body;

    username.updatedAt = new Date();
    username.token = generateEmailTokenConfirm();
    username.confirmed = false;
    username.password = await hashPassword(username.password);
    
    try {
      const user = await prisma.user.create({ data: username })
      const { email, name, token } = user;
      
      if(token) {
        await emailConfirmation({ email, name, token});
      }

      response.json({ message: 'Usuario creado correctamente, revisa tu correo para confirmar tu cuenta'});
    } catch (error) {
      response.status(500).json({ message: 'Error al crear usuario'});
    }
  }

  public async confirm(req: Request, response: Response) {

    const { token } = req.params;
    try {      
      const user = await prisma.user.findFirst({ where: { token }});
      if(!user) {
        return response.status(400).json({ message: 'Token inválido', error: true });
      }

      user.token = null;
      user.confirmed = true;

      await prisma.user.update({ where: { id: user.id }, data: user });
      
      return response.status(200).json({ message: 'cuenta confirmada', error: false});
    } catch (error) {
      return response.status(500).json({ message: 'Error al confirmar cuenta', error: true });
    }
  }

  public async forgotPassword(req: Request, response: Response) {
    const { email } = req.body;

    try {
      const user = await prisma.user.findFirst({ where: { email }});
  
      if(!user) {
        return response.status(400).json({ message: 'El email no pertenece a ningún usuario', error: true });
      }
      if(!user.confirmed) {
        return response.status(400).json({ message: 'Usuario no confirmado confirma tu email', error: true });
      }

      user.token = generateEmailTokenConfirm();

      await prisma.user.update({ where: { id: user.id }, data: user });

      await emailForgotPassword({email: user.email, name: user.name, token: user.token})

      return response.status(200).json({ message: 'Se ha enviado un correo para cambiar tu contraseña', error: false});
    } catch (error) {
      console.log(error)
      return response.status(500).json({ message: 'Error al solicitar cambio de contraseña', error: true });
    }
  }

  public async checkTokenForResetPassword(req: Request, res: Response) {
    const { token } = req.params;
    try {
      const user = await prisma.user.findFirst({ where: { token }});

      if(!user) {
        return res.status(404).json({ message: 'Token inválido', error: true})
      }

      return res.status(200).json({ message: 'Token confirmado', error: false})

    } catch (error) {
      return res.status(500).json({message: 'Error al validar token', error: true})
    }
  }

  public async changePassword(req: Request, res: Response) {
    const { token } = req.params;
    const { password } = req.body;
    
    try {
      const user = await prisma.user.findFirst({ where: {token}})

      if(!user) {
        return res.status(404).json({message: 'Token inválido', error: true})
      }

      user.password = await hashPassword(password);
      user.token = null;
      await prisma.user.update({ where: { id: user.id }, data: user})
      
      return res.status(200).json({ message: 'Contraseña actualizada correctamente'})
      
    } catch (error) {
      return res.status(500).json({ message: 'Error al cambiar contraseña', error: true})
    }
  }
}