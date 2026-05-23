import {
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';

import { OAuth2Client } from 'google-auth-library';

import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokenProvider } from 'src/auth/providers/generate-token.provider';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    /**
     * Injecting the UsersService to find a user by googleId
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    /**
     * Injecting the GenerateTokenProvider to generate tokens
     */
    @Inject()
    private readonly generateTokenProvider: GenerateTokenProvider,
  ) {}

  onModuleInit() {
    this.oauthClient = new OAuth2Client(
      this.jwtConfiguration.googleClientId,
      this.jwtConfiguration.googleClientSecret,
    );
  }

  async authenticate(googleTokenDto: GoogleTokenDto) {
    // verify the token
    const loginTicket = await this.oauthClient.verifyIdToken({
      idToken: googleTokenDto.token,
    });

    const payload = loginTicket?.getPayload();

    if (
      !payload?.email ||
      !payload.sub ||
      !payload.given_name ||
      !payload.family_name
    ) {
      throw new UnauthorizedException('Invalid Google token');
    }

    const {
      email,
      sub: googleId,
      given_name: firstName,
      family_name: lastName,
    } = payload;

    // find the user by googleId in DB
    const user = await this.usersService.findOneByGoogleId(googleId);

    // if googleId found, generate tokens
    if (user) {
      return await this.generateTokenProvider.generateTokens(user);
    }

    // if googleId not found, create a new user and generate tokens
    const newUser = await this.usersService.createGoogleUser({
      email,
      googleId,
      firstName,
      lastName,
    });
    return await this.generateTokenProvider.generateTokens(newUser);
  }
}
