import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsController } from './posts.controller';
import { PostsService } from './providers/posts.service';

// External Modules
import { UsersModule } from 'src/users/users.module';
import { MetaOptionsModule } from 'src/meta-options/meta-options.module';
import { TagsModule } from 'src/tags/tags.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';

// Entities
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { Post } from './post.entity';

/**
 * Feature module for posts: REST API, Post/MetaOption entities, and cross-module imports
 */
@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    UsersModule,
    MetaOptionsModule,
    TagsModule,
    PaginationModule,
    TypeOrmModule.forFeature([Post, MetaOption]),
  ],
})
export class PostsModule {}
