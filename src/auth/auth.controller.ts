import { AuthService } from './providers/auth.service';
import { Controller } from '@nestjs/common';

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
}
