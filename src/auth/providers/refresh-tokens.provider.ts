import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { GenerateTokenProvider } from './generate-token.provider';

import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';

import { AccessTokenPayload } from '../interfaces/access-token-payload.interface';

import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    /**
     * Injecting the JwtService to verify the token
     */
    private readonly jwtService: JwtService,

    /**
     * Injecting the JWT configuration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    /**
     * Injecting the GenerateTokenProvider to generate tokens
     */
    @Inject()
    private readonly generateTokenProvider: GenerateTokenProvider,

    /**
     * Injecting the UsersService to find a user by id
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      // verify refresh token
      const { sub } = await this.jwtService.verifyAsync<
        Pick<AccessTokenPayload, 'sub'>
      >(refreshTokenDto.refreshToken, this.jwtConfiguration);

      // Fetch user by id
      const user = await this.usersService.findOneById(sub);

      // Generate new tokens
      return await this.generateTokenProvider.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
