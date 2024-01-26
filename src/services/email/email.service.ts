import nodemailer, { Transporter } from 'nodemailer';
import config from '../config/dotenv.config';

export default class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: config.mail.service,
      auth: {
        user: config.mail.user,
        pass: config.mail.password,
      },
    });
  }
  
  public async sendResetPasswordEmail(email: string, resetLink: string): Promise<void> {
    const subject = 'Restablecer contraseña';
    const html = `
      <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
      <a href="${resetLink}">${resetLink}</a>
    `;
    try {
      await this.sendEmail(email, subject, html);
      console.log(`Correo de restablecimiento de contraseña enviado a ${email}.`);
    } catch (error) {
      console.error(`Error al enviar el correo de restablecimiento de contraseña a ${email}:`, error);
      throw new Error('Error al enviar el correo de restablecimiento de contraseña.');
    }
  }

  public async sendEmail(to: string, subject: string, html: string, attachments: any[] = []): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: config.mail.user,
        to,
        subject,
        html,
        attachments,
      });
      console.log('Correo electrónico enviado correctamente.');
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
      throw new Error('Error al enviar el correo electrónico.');
    }
  }
}
