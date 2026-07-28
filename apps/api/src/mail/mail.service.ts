import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {}

  async sendStudentInvite(toEmail: string, toName: string, password: string) {
    const apiKey = this.configService.get<string>('BREVO_API_KEY');
    const webOrigin = this.configService.get<string>('WEB_ORIGIN');
    const fromEmail = this.configService.get<string>('MAIL_FROM_EMAIL') || 'no-reply@infinitusdigital.com';
    const fromName = this.configService.get<string>('MAIL_FROM_NAME') || 'Infinitus Digital Cursos';

    if (!apiKey) {
      this.logger.warn('BREVO_API_KEY não configurada — email de convite não enviado.');
      return { sent: false };
    }

    const loginUrl = `${webOrigin}/login`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#111;">Bem-vindo(a) à Infinitus Digital Cursos</h2>
        <p>Olá ${toName},</p>
        <p>A tua conta de aluno foi criada. Já podes aceder à plataforma com os dados abaixo:</p>
        <table style="margin: 16px 0;">
          <tr><td style="padding:4px 8px; color:#666;">Link:</td><td style="padding:4px 8px;"><a href="${loginUrl}">${loginUrl}</a></td></tr>
          <tr><td style="padding:4px 8px; color:#666;">Email:</td><td style="padding:4px 8px;">${toEmail}</td></tr>
          <tr><td style="padding:4px 8px; color:#666;">Palavra-passe:</td><td style="padding:4px 8px;"><strong>${password}</strong></td></tr>
        </table>
        <p><a href="${loginUrl}" style="background:#FF6B00;color:#fff;padding:10px 20px;border-radius:24px;text-decoration:none;display:inline-block;">Entrar na plataforma</a></p>
        <p style="color:#999; font-size:12px; margin-top:24px;">Recomendamos que alteres a palavra-passe após o primeiro acesso.</p>
      </div>
    `;

    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          sender: { email: fromEmail, name: fromName },
          to: [{ email: toEmail, name: toName }],
          subject: 'O teu acesso à Infinitus Digital Cursos',
          htmlContent: html,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        this.logger.error(`Falha ao enviar email via Brevo: ${res.status} ${errText}`);
        return { sent: false };
      }
      return { sent: true };
    } catch (err) {
      this.logger.error('Erro ao enviar email via Brevo', err as Error);
      return { sent: false };
    }
  }
}
