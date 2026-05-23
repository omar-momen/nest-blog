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

import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { User } from '../user.entity';
import { Post } from 'src/posts/post.entity';

import { CreateUserDto } from '../dtos/create-user.dto';

import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { GoogleUser } from '../interfaces/goggle-user.interface';
import { CreateGoogleUserProvider } from './create-google-user.provider';

import { MailService } from 'src/mail/providers/mail.service';

/**
 * Class to connect to user related operations
 */
@Injectable()
export class UsersService {
  constructor(
    /**
     * Injecting the User repository to perform database operations related to users
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    /**
     * Default TypeORM connection for transactions spanning multiple operations
     */
    @InjectDataSource()
    private readonly dataSource: DataSource,

    /**
     * Injecting the HashingProvider to hash passwords
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    /**
     * Injecting the FindOneByGoogleIdProvider to find a user by googleId
     */
    @Inject()
    private readonly findOneByGoogleIdProvider: FindOneByGoogleIdProvider,

    /**
     * Injecting the CreateGoogleUserProvider to create a new user
     */
    @Inject()
    private readonly createGoogleUserProvider: CreateGoogleUserProvider,

    /**
     * Injecting the MailService to send welcome email
     */
    private readonly mailService: MailService,
  ) {}

  /**
   * Method to find all the users
   */
  public findAll(
    getUserParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    console.log(getUserParamDto, limit, page);

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
   * Find a user by email
   */
  public async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return null;
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

    // Hash the password
    const hashedPassword = await this.hashingProvider.hashPassword(
      user.password,
    );

    // Create a new user entity and save it to the database
    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword,
    });

    // Send welcome email
    await this.mailService.sendUserWelcome(newUser);

    return this.userRepository.save(newUser);
  }

  /**
   * Create multiple users in a single database transaction.
   * If any insert fails or validation fails inside the callback, all changes roll back.
   */
  public async createMany(users: CreateManyUsersDto['users']) {
    const emails = users.map((u) => u.email);
    if (new Set(emails).size !== emails.length) {
      throw new BadRequestException('Duplicate emails in the same request');
    }

    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(User);
      const saved: User[] = [];

      for (const dto of users) {
        const existingUser = await repo.findOne({
          where: { email: dto.email },
        });
        if (existingUser) {
          throw new BadRequestException(
            `User with email ${dto.email} already exists`,
          );
        }

        const entity = repo.create(dto);
        saved.push(await repo.save(entity));
      }

      return saved;
    });
  }

  /**
   * Delete a user and their dependent posts in a single transaction
   */
  public async delete(id: number) {
    await this.dataSource.transaction(async (manager) => {
      const user = await manager.getRepository(User).findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const posts = await manager.getRepository(Post).find({
        where: { author: { id } },
        select: { id: true },
      });

      if (posts.length > 0) {
        await manager.getRepository(Post).delete(posts.map((post) => post.id));
      }

      await manager.getRepository(User).delete(id);
    });

    return { message: 'User deleted successfully' };
  }

  /**
   * Find a user by googleId
   */
  public async findOneByGoogleId(googleId: string) {
    return await this.findOneByGoogleIdProvider.findOneByGoogleId(googleId);
  }

  /**
   * Create a new google user
   */
  public async createGoogleUser(user: GoogleUser) {
    return await this.createGoogleUserProvider.createGoogleUser(user);
  }
}
