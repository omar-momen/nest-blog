import { Global, Module } from '@nestjs/common';
import { MailService } from './providers/mail.service';

import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { join } from 'node:path';
import { EjsAdapter } from '@nestjs-modules/mailer/adapters/ejs.adapter';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('app.mail.host'),
          secure: false,
          port: config.get<number>('app.mail.port'),
          auth: {
            user: config.get<string>('app.mail.user'),
            pass: config.get<string>('app.mail.password'),
          },
        },
        default: {
          from: 'MY Blog <noreply@myblog.com>',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter({
            inlineCssEnabled: true,
          }),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
