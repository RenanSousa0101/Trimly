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

export class EmailService {
    async sendVerificationEmail(toEmail: string, token: string) {
        const verificationLink = `${APP_URL}/api/auth/verify-email?token=${token}`;

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: toEmail,
            subject: 'Confirme seu email',
            html: `
              <p>Olá!</p>
              <p>Obrigado por se cadastrar. Por favor, clique no link abaixo para verificar seu email:</p>
              <p><a href="${verificationLink}">${verificationLink}</a></p>
              <p>Este link é válido por um tempo limitado.</p>
              <p>Se você não se cadastrou, por favor, ignore este email.</p>
            `,
        };

        console.log(`Sending verification email to ${toEmail} with link ${verificationLink}`);
        await transporter.sendMail(mailOptions);
    }
}