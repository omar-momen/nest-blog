import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CreateTagDto } from './dtos/create-tag.dto';
import { TagsService } from './providers/tags.service';

/**
 * HTTP controller for creating and deleting tags (including soft delete)
 */
@Controller('tags')
export class TagsController {
  /**
   * Constructor to inject tag-related business logic
   */
  constructor(
    /**
     * Injecting TagsService for persistence and queries
     */
    private readonly tagsService: TagsService,
  ) {}

  /**
   * Method to create a new tag
   */
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({
    status: 201,
    description: 'The tag has been successfully created.',
  })
  @Post()
  public createTag(@Body() body: CreateTagDto) {
    return this.tagsService.create(body);
  }

  /**
   * Method to permanently delete a tag by id
   */
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiResponse({
    status: 200,
    description: 'The tag has been successfully deleted.',
  })
  @Delete(':id')
  public deleteTag(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.delete(id);
  }

  /**
   * Method to soft-delete a tag by id
   */
  @Delete('soft-delete/:id')
  public softDeleteTag(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.softDelete(id);
  }
}
