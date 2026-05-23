import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';

import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';

import { GetPostsDto } from './dtos/get-posts-dto';

import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import type { AccessTokenPayload } from 'src/auth/interfaces/access-token-payload.interface';

/**
 * HTTP controller for listing, creating, updating, and deleting posts
 */
@Controller('posts')
export class PostsController {
  /**
   * Constructor to inject post-related business logic
   */
  constructor(
    /**
     * Injecting PostsService for persistence and related lookups
     */
    private readonly postsService: PostsService,
  ) {}

  /**
   * Method to list posts for a given user id (route: GET /posts/:userId)
   */
  @Get('/{:userId}')
  public getPosts(
    @Param('userId') userId: number,
    @Query() query: GetPostsDto,
  ) {
    return this.postsService.findAll(query, userId);
  }

  /**
   * Method to create a new post (route: POST /posts)
   */
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  @Post()
  public createPost(
    @Body() body: CreatePostDto,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    return this.postsService.create(body, user);
  }

  /**
   * Method to update an existing post (route: PATCH /posts)
   */
  @ApiOperation({ summary: 'Update an existing post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.',
  })
  @Patch()
  public updatePost(@Body() body: PatchPostDto) {
    return this.postsService.update(body);
  }

  /**
   * Method to delete a post by id (route: DELETE /posts/:id)
   */
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully deleted.',
  })
  @Delete(':id')
  public deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
