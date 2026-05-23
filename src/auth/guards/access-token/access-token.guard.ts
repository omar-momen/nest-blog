import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import jwtConfig from 'src/auth/config/jwt.config';
import type { ConfigType } from '@nestjs/config';

import type { Request } from 'express';

import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';

import type { AccessTokenPayload } from 'src/auth/interfaces/access-token-payload.interface';

@Injectable()
export class AccessTokenGuard implements CanActivate {
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
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the request from the context
    const request = context.switchToHttp().getRequest<Request>();

    // Get the token from the request
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // Verify the token
    try {
      const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(
        token,
        this.jwtConfiguration,
      );
      request[REQUEST_USER_KEY] = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
