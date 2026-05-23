import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';

import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { HashingProvider } from './hashing.provider';
import { GenerateTokenProvider } from './generate-token.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokensProvider } from './refresh-tokens.provider';

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

    /**
     * Injecting the hashing provider to hash passwords
     */
    @Inject()
    private readonly hashingProvider: HashingProvider,

    /**
     * Injecting the GenerateTokenProvider to generate tokens
     */
    @Inject()
    private readonly generateTokenProvider: GenerateTokenProvider,

    /**
     * Injecting the RefreshTokensProvider to refresh tokens
     */
    @Inject()
    private readonly refreshTokensProvider: RefreshTokensProvider,
  ) {}

  /**
   * Method to authenticate a user by id and return a token placeholder
   */
  public async signin(signInDto: SignInDto) {
    const user = await this.usersService.findOneByEmail(signInDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await this.hashingProvider.comparePassword(
      signInDto.password,
      user.password ?? '', // TODO: handle this case with google auth
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // generate a tokens
    return await this.generateTokenProvider.generateTokens(user);
  }

  /**
   * Method to refresh tokens
   */
  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokensProvider.refreshTokens(refreshTokenDto);
  }
}
