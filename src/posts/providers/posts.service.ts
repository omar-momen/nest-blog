import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';

import { Post } from '../post.entity';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TagsService } from 'src/tags/providers/tags.service';

import { PatchPostDto } from '../dtos/patch-post.dto';

/**
 * Class to connect to post related operations
 */
@Injectable()
export class PostsService {
  /**
   * Constructor to inject repositories and collaborators for post workflows
   */
  constructor(
    /**
     * Injecting UsersService to resolve authors when creating posts
     */
    private readonly usersService: UsersService,

    /**
     * Injecting the Post repository to perform database operations related to posts
     */
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    /**
     * Injecting TagsService to resolve tag entities by id when creating or updating posts
     */
    private readonly tagsService: TagsService,
  ) {}

  /**
   * Method to find all the posts
   */
  public findAll(userId: number) {
    let user;
    if (!userId) {
      user = this.usersService.findOneById(userId);
      console.log(user);
    }

    const posts = this.postRepository.find({
      // Or with eager loading in the entity
      relations: ['tags', 'metaOptions', 'author'],
    });
    return posts;
  }

  /**
   * Method to create a new post
   */
  public async create(createPostDto: CreatePostDto) {
    // Get the author
    const author = await this.usersService.findOneById(createPostDto.authorId);
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    // Find the tags
    const tags = await this.tagsService.findMultipleTags(
      createPostDto.tags ?? [],
    );

    // Create a new post
    const post = this.postRepository.create({
      ...createPostDto,
      author,
      tags,
    });

    // Return the post
    return await this.postRepository.save(post);
  }

  /**
   * Method to update a post
   */
  public async update(patchPostDto: PatchPostDto) {
    // find the tags
    const tags = await this.tagsService.findMultipleTags(
      patchPostDto.tags ?? [],
    );
    if (tags.length !== patchPostDto.tags?.length) {
      throw new NotFoundException('One or more tag IDs are invalid');
    }

    // find the post
    const post = await this.postRepository.findOne({
      where: { id: patchPostDto.id },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // update the properties of the post
    Object.assign(post, patchPostDto);

    // assign the tags to the post
    post.tags = tags;

    // save the post
    await this.postRepository.save(post);
    return post;
  }

  /**
   * Method to delete a post
   */
  public async delete(id: number) {
    await this.postRepository.delete(id);

    return { message: 'Post deleted successfully' };
  }
}
