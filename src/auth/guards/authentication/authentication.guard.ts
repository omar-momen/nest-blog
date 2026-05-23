import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { AccessTokenGuard } from '../access-token/access-token.guard';

import { AuthType } from 'src/auth/enums/auth-type.enum';

export const AUTH_TYPE_KEY = 'auth';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType: AuthType = AuthType.Barer;

  private readonly authTypeGuardsMap: Record<AuthType, CanActivate>;

  constructor(
    /**
     * Injecting the Reflector to get the metadata from the controller
     */
    private readonly reflector: Reflector,

    /**
     * Injecting the access token guard to verify the token
     */
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    this.authTypeGuardsMap = {
      [AuthType.Barer]: this.accessTokenGuard,
      [AuthType.None]: {
        canActivate: () => true,
      },
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // authTypes from reflector
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    // array of guards to apply
    const guards = authTypes
      .map((type) => this.authTypeGuardsMap[type])
      .filter((guard) => guard !== undefined);

    // Default Error
    const defaultError = new UnauthorizedException('Invalid credentials');

    // Loop guards canActivate
    for (const guard of guards) {
      const canActivate = await guard.canActivate(context);
      if (canActivate) {
        return true;
      }
    }
    throw defaultError;
  }
}
