import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { UsersService } from './users.service';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { MailService } from 'src/mail/providers/mail.service';
import { User } from '../user.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { Post } from 'src/posts/post.entity';
import { CreateUserDto } from '../dtos/create-user.dto';

describe('UsersService', () => {
  let usersService: UsersService;

  const mockUser: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'hashed-password',
  };

  const createUserDto: CreateUserDto = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'Password1#',
  };

  const userRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const dataSource = {
    transaction: jest.fn(),
  };

  const hashingProvider = {
    hashPassword: jest.fn(),
  };

  const mailService = {
    sendUserWelcome: jest.fn(),
  };

  const findOneByGoogleIdProvider = {
    findOneByGoogleId: jest.fn(),
  };

  const createGoogleUserProvider = {
    createGoogleUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: CreateGoogleUserProvider,
          useValue: createGoogleUserProvider,
        },
        {
          provide: FindOneByGoogleIdProvider,
          useValue: findOneByGoogleIdProvider,
        },
        {
          provide: MailService,
          useValue: mailService,
        },
        {
          provide: DataSource,
          useValue: dataSource,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
        {
          provide: HashingProvider,
          useValue: hashingProvider,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findAll', () => {
    it('should throw HttpException with MOVED_PERMANENTLY status', () => {
      expect(() => usersService.findAll({ id: 1 }, 10, 1)).toThrow(
        HttpException,
      );

      try {
        usersService.findAll({ id: 1 }, 10, 1);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(
          HttpStatus.MOVED_PERMANENTLY,
        );
      }
    });
  });

  describe('findOneById', () => {
    it('should return the user when found', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await usersService.findOneById(1);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(usersService.findOneById(99)).rejects.toThrow(
        NotFoundException,
      );
      await expect(usersService.findOneById(99)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('findOneByEmail', () => {
    it('should return the user when found', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await usersService.findOneByEmail('john@example.com');

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await usersService.findOneByEmail('missing@example.com');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should hash password, send welcome email, and save the user', async () => {
      userRepository.findOne.mockResolvedValue(null);
      hashingProvider.hashPassword.mockResolvedValue('hashed-password');
      const createdUser = { ...createUserDto, password: 'hashed-password' };
      userRepository.create.mockReturnValue(createdUser);
      userRepository.save.mockResolvedValue({ ...createdUser, id: 1 });

      const result = await usersService.create(createUserDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(hashingProvider.hashPassword).toHaveBeenCalledWith(
        createUserDto.password,
      );
      expect(userRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashed-password',
      });
      expect(mailService.sendUserWelcome).toHaveBeenCalledWith(createdUser);
      expect(userRepository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual({ ...createdUser, id: 1 });
    });

    it('should throw BadRequestException when email already exists', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      await expect(usersService.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(usersService.create(createUserDto)).rejects.toThrow(
        'User with this email already exists',
      );
      expect(hashingProvider.hashPassword).not.toHaveBeenCalled();
      expect(mailService.sendUserWelcome).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('createMany', () => {
    const users: CreateUserDto[] = [
      {
        firstName: 'Alice',
        email: 'alice@example.com',
        password: 'Password1#',
      },
      {
        firstName: 'Bob',
        email: 'bob@example.com',
        password: 'Password1#',
      },
    ];

    const setupTransaction = (repo: {
      findOne: jest.Mock;
      create: jest.Mock;
      save: jest.Mock;
    }) => {
      dataSource.transaction.mockImplementation(async (callback) =>
        callback({
          getRepository: jest.fn().mockReturnValue(repo),
        }),
      );
    };

    it('should create and save all users in a transaction', async () => {
      const repo = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn((dto: CreateUserDto) => dto),
        save: jest
          .fn()
          .mockImplementation((entity) =>
            Promise.resolve({ ...entity, id: Math.random() }),
          ),
      };
      setupTransaction(repo);

      const result = await usersService.createMany(users);

      expect(dataSource.transaction).toHaveBeenCalled();
      expect(repo.findOne).toHaveBeenCalledTimes(2);
      expect(repo.save).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
    });

    it('should throw BadRequestException for duplicate emails in the same request', async () => {
      const duplicateUsers: CreateUserDto[] = [
        { ...users[0] },
        { ...users[0], firstName: 'Alice2' },
      ];

      await expect(usersService.createMany(duplicateUsers)).rejects.toThrow(
        BadRequestException,
      );
      await expect(usersService.createMany(duplicateUsers)).rejects.toThrow(
        'Duplicate emails in the same request',
      );
      expect(dataSource.transaction).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when a user email already exists in the database', async () => {
      const repo = {
        findOne: jest.fn().mockImplementation(({ where: { email } }) => {
          if (email === users[1].email) {
            return Promise.resolve(mockUser);
          }
          return Promise.resolve(null);
        }),
        create: jest.fn(),
        save: jest.fn(),
      };
      setupTransaction(repo);

      await expect(usersService.createMany(users)).rejects.toThrow(
        new BadRequestException(
          `User with email ${users[1].email} already exists`,
        ),
      );
      expect(repo.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    const setupDeleteTransaction = (options: {
      user: User | null;
      posts?: { id: number }[];
    }) => {
      const userRepo = {
        findOne: jest.fn().mockResolvedValue(options.user),
        delete: jest.fn().mockResolvedValue(undefined),
      };
      const postRepo = {
        find: jest.fn().mockResolvedValue(options.posts ?? []),
        delete: jest.fn().mockResolvedValue(undefined),
      };

      dataSource.transaction.mockImplementation(async (callback) =>
        callback({
          getRepository: jest.fn().mockImplementation((entity) => {
            if (entity === User) return userRepo;
            if (entity === Post) return postRepo;
            return {};
          }),
        }),
      );

      return { userRepo, postRepo };
    };

    it('should delete user and return success message when user has no posts', async () => {
      setupDeleteTransaction({ user: mockUser });

      const result = await usersService.delete(1);

      expect(result).toEqual({ message: 'User deleted successfully' });
    });

    it('should delete user posts before deleting the user', async () => {
      const { postRepo, userRepo } = setupDeleteTransaction({
        user: mockUser,
        posts: [{ id: 10 }, { id: 20 }],
      });

      await usersService.delete(1);

      expect(postRepo.find).toHaveBeenCalledWith({
        where: { author: { id: 1 } },
        select: { id: true },
      });
      expect(postRepo.delete).toHaveBeenCalledWith([10, 20]);
      expect(userRepo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      setupDeleteTransaction({ user: null });

      await expect(usersService.delete(99)).rejects.toThrow(NotFoundException);
      await expect(usersService.delete(99)).rejects.toThrow('User not found');
    });
  });

  describe('findOneByGoogleId', () => {
    it('should delegate to FindOneByGoogleIdProvider', async () => {
      findOneByGoogleIdProvider.findOneByGoogleId.mockResolvedValue(mockUser);

      const result = await usersService.findOneByGoogleId('google-123');

      expect(findOneByGoogleIdProvider.findOneByGoogleId).toHaveBeenCalledWith(
        'google-123',
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('createGoogleUser', () => {
    it('should delegate to CreateGoogleUserProvider', async () => {
      const googleUser = {
        email: 'john@example.com',
        googleId: 'google-123',
        firstName: 'John',
        lastName: 'Doe',
      };
      createGoogleUserProvider.createGoogleUser.mockResolvedValue(mockUser);

      const result = await usersService.createGoogleUser(googleUser);

      expect(createGoogleUserProvider.createGoogleUser).toHaveBeenCalledWith(
        googleUser,
      );
      expect(result).toEqual(mockUser);
    });
  });
});
