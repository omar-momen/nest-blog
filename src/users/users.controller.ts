// === NestJS Imports
import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Body,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';

// === DTOs
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';

// === Services
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

/**
 * HTTP controller for user listing, creation, and partial updates
 */
@Controller('users')
export class UsersController {
  /**
   * Constructor to inject user-related business logic
   */
  constructor(
    /**
     * Injecting UsersService for persistence and queries
     */
    private readonly usersService: UsersService,
  ) {}

  /**
   * Method to retrieve users with optional id filter and pagination
   */
  @ApiOperation({ summary: 'Retrieve users with optional filtering' })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of users to return',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @Get('/{:id}')
  public getUsers(
    @Param() params: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.findAll(params, limit, page);
  }

  /**
   * Method to create a new user account
   */
  @Post()
  public createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  /**
   * Method to partially update user fields (placeholder — returns body as-is)
   */
  @Patch()
  public patchUser(@Body() body: PatchUserDto) {
    return body;
  }
}
