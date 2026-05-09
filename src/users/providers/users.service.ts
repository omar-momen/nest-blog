import { AuthService } from 'src/auth/providers/auth.service';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import {
  Injectable,
  Inject,
  forwardRef,
  BadRequestException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../user.entity';

import { CreateUserDto } from '../dtos/create-user.dto';

import type { ConfigType } from '@nestjs/config';
import userConfig from '../config/user.config';

/**
 * Class to connect to user related operations
 */
@Injectable()
export class UsersService {
  /**
   * Constructor to inject AuthService to check authentication
   */
  constructor(
    /**
     * Injecting the AuthService to check authentication
     */
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    /**
     * Injecting the User repository to perform database operations related to users
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    /**
     * Injecting the user configuration
     */
    @Inject(userConfig.KEY)
    private readonly userConfiguration: ConfigType<typeof userConfig>,
  ) {}

  /**
   * Method to find all the users
   */
  public findAll(
    getUserParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    const isAuth = this.authService.isAuth();
    console.log(getUserParamDto, limit, page);
    console.log(isAuth);

    throw new HttpException(
      {
        statusCode: HttpStatus.MOVED_PERMANENTLY,
        message: 'Moved Permanently',
        error: 'This is a test error',
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error('This is a test error with a cause'),
        description: 'This is a test description',
      },
    );
  }

  /**
   * Find a user by ID
   */
  public async findOneById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Method to create a new user
   */
  public async create(user: CreateUserDto) {
    // Check if user with the same email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });

    // If user with the same email exists, throw an error
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Create a new user entity and save it to the database
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }
}
