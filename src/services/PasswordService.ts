import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

export class PasswordService {
  async sendPasswordResetEmail(toEmail: string, token: string) {
    const resetLink = `${APP_URL}/api/auth/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: toEmail,
      subject: "Reset de Senha",
      html: `
      <p>Olá!</p>
      <p>Você solicitou a redefinição da sua senha. Clique no link abaixo:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>Este link é válido por um tempo limitado.</p>
      <p>Se você não solicitou isso, por favor, ignore este email.</p>
    `,
    };

    console.log(
      `Enviando email de reset de senha para ${toEmail} com link ${resetLink}`
    ); 
    await transporter.sendMail(mailOptions);
  }
}
