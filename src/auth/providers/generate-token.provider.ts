import { Inject, Injectable } from '@nestjs/common';

import jwtConfig from '../config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';

import { User } from 'src/users/user.entity';

import { AccessTokenPayload } from '../interfaces/access-token-payload.interface';

@Injectable()
export class GenerateTokenProvider {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly jwtService: JwtService,
  ) {}

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
      },
    );
  }

  public async generateTokens(user: User) {
    // generate access token
    const accessToken = await this.signToken<Partial<AccessTokenPayload>>(
      user.id,
      this.jwtConfiguration.accessTokenTTL,
      {
        email: user.email,
      },
    );

    // generate refresh token
    const refreshToken = await this.signToken(
      user.id,
      this.jwtConfiguration.refreshTokenTTL,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
