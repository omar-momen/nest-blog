import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';

import { AuthModule } from 'src/auth/auth.module';

import { User } from './user.entity';

import { ConfigModule } from '@nestjs/config';
import { FindOneByGoogleIdProvider } from './providers/find-one-by-google-id.provider';
import { CreateGoogleUserProvider } from './providers/create-google-user.provider';
import userConfig from './config/user.config';

/**
 * Feature module for users: REST API, TypeORM repository, and user-scoped configuration
 */
@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    FindOneByGoogleIdProvider,
    CreateGoogleUserProvider,
  ],
  exports: [UsersService],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(userConfig),
  ],
})
export class UsersModule {}
