import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { UsersService } from 'src/users/providers/users.service';

/**
 * Class to connect to authentication-related operations (login, auth state)
 */
@Injectable()
export class AuthService {
  /**
   * Constructor to inject user lookups required for login flows
   */
  constructor(
    /**
     * Injecting UsersService (forwardRef) to resolve circular dependency with UsersModule
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  /**
   * Method to authenticate a user by id and return a token placeholder
   */
  public async login(email: string, password: string, id: number) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // login
    return 'SAMPLE_TOKEN';
  }

  /**
   * Method to indicate whether the current context is considered authenticated (stub)
   */
  public isAuth() {
    return true;
  }
}
