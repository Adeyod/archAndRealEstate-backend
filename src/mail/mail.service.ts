import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bull';
import { SendEmailJob } from './interface/mail.interface';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail') private mailQueue: Queue<SendEmailJob>) {}
  private app_name = 'Kay Brooks';

  private async sendEmail(data: SendEmailJob) {
    await this.mailQueue.add('send_email', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: true,
      removeOnFail: false,
    });

    return { message: `Email job added to queue for ${data.to}` };
  }

  async sendVerificationEmail(to: string, first_name: string, token: string) {
    return this.sendEmail({
      to,
      subject: 'Verify Your Email',
      templateName: 'verify-email.ejs',
      templateData: { first_name, token, app_name: this.app_name },
    });
  }

  async sendPasswordReset(to: string, first_name: string, token: string) {
    return this.sendEmail({
      to,
      subject: 'Password Reset',
      templateName: 'password-reset.ejs',
      templateData: { first_name, token, app_name: this.app_name },
    });
  }
}
