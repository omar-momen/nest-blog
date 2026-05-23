import { SignInDto } from './dtos/signin.dto';
import { AuthService } from './providers/auth.service';
import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';

import { RefreshTokenDto } from './dtos/refresh-token.dto';

/**
 * HTTP controller for authentication-related routes (reserved for future auth endpoints)
 */
@Controller('auth')
export class AuthController {
  /**
   * Constructor wiring authentication business logic
   */
  constructor(
    /**
     * Injecting AuthService for login and auth checks
     */
    private readonly authService: AuthService,
  ) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  public signin(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  public refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }
}
