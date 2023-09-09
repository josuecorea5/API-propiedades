import nodemailer from 'nodemailer'

interface EmailInfo {
  email: string;
  name: string;
  token: string;
}

export const emailConfirmation = async (data: EmailInfo) => {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.USER_GMAIL,
      pass: process.env.PASS_GMAIL
    }
  });

  const { email, name, token } = data;

  await transport.sendMail({
    from: 'Bienes Raices 🏠',
    to: email,
    subject: 'Confirma tu cuenta en Bienes Raices',
    text: 'Confirma tu cuenta en Bienes Raices',
    html: `
      <p> Hola ${name} 😊!, comprueba tu cuenta en Bienes Raices </p>

      <p> 
        Tu cuenta ya está lista, solo debes confirmar tu email en el siguiente enlace: 
        <a href="${process.env.FRONTEND_URL}/auth/confirmaccount/${token}">Confirmar cuenta</a>
      </p>

      <p> Si tu no creaste esta cuenta, ignora este correo 👋</p>
    `,
  })
}

export const emailForgotPassword = async (data: EmailInfo) => {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.USER_GMAIL,
      pass: process.env.PASS_GMAIL
    }
  });

  const { email, name, token } = data;

  await transport.sendMail({
    from: 'Bienes Raices 🏠',
    to: email,
    subject: 'Reestablecer tu contraseña en Bienes Raices',
    text: 'Reestablece tu contraseña en Bienes Raices',
    html: `
      <p> Hola ${name} 😊!,reestablece tu contraseña en Bienes Raices </p>

      <p> 
        Has solicitado reestablecer tu contraseña, para continuar haz click en el siguiente enlace:: 
        <a href="${process.env.FRONTEND_URL}/auth/resetpassword/${token}">Cambiar contraseña</a>
      </p>

      <p> Si tu no has solicitado reestablecer tu contraseña, ignora este correo 👋</p>
    `,
  })
}
