import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { TagsController } from './tags.controller';
import { TagsService } from './providers/tags.service';

import { Tag } from './tag.entity';

/**
 * Feature module for tags: REST API and exported TagsService for PostsModule
 */
@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [TypeOrmModule.forFeature([Tag])],
  exports: [TagsService],
})
export class TagsModule {}
