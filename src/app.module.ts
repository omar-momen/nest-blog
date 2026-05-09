import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';

// Importing modules
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';

import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ConfigModule, ConfigService } from '@nestjs/config';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { environmentValidationSchema } from './config/environment.validation';

/**
 * Current Node environmental used to pick `.env.<ENV>` for ConfigModule (falls back to `.env` when unset)
 */
const ENV = process.env.NODE_ENV;

/**
 * Root module wiring configuration, TypeORM, and feature modules for the blog API
 */
@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    MetaOptionsModule,
    TagsModule,
    ConfigModule.forRoot({
      isGlobal: true, // Make the config module available globally
      envFilePath: ENV ? `.env.${ENV}` : '.env',
      load: [appConfig, databaseConfig],
      validationSchema: environmentValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: Number(configService.get<string>('database.port')),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        synchronize: configService.get<boolean>('database.synchronize'),
        autoLoadEntities: configService.get<boolean>(
          'database.autoLoadEntities',
        ),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
