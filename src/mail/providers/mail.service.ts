import { MailerService } from '@nestjs-modules/mailer';

import { Injectable } from '@nestjs/common';

import { User } from 'src/users/user.entity';

@Injectable()
export class MailService {
  constructor(
    /**
     * Injecting the MailerService to send emails
     */
    private readonly mailerService: MailerService,
  ) {}

  public async sendUserWelcome(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      from: `Onboarding Team <onboarding@Moamen.com>`,
      subject: 'Welcome to our website <nestjs-new>',
      template: './welcome',
      context: {
        name: user.firstName,
      },
    });
  }
}
