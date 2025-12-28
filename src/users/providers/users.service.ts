import { AuthService } from 'src/auth/providers/auth.service';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { Injectable, Inject, forwardRef } from '@nestjs/common';

/**
 * Class to connect to user related operations
 */
@Injectable()
export class UsersService {
  /**
   * Constructor to inject AuthService to check authentication
   */
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  /**
   * Method to find all the users
   */
  public findAll(
    getUserParamDto: GetUsersParamDto,
    limt: number,
    page: number,
  ) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);

    return [
      {
        firstName: 'John',
        email: 'john@doe.com',
      },
      {
        firstName: 'Alice',
        email: 'alice@doe.com',
      },
    ];
  }

  /**
   * Find a user by ID
   */
  public findOneById(id: string) {
    return {
      id: id,
      firstName: 'Alice',
      email: 'alice@doe.com',
    };
  }
}
