import { Controller, Get, Post, Body } from '@nestjs/common';
import { MetaOptionsService } from './providers/meta-options.service';

import { CreateMetaOptionDto } from './dtos/create-meta-option.dto';

/**
 * HTTP controller for listing and creating post meta options
 */
@Controller('meta-options')
export class MetaOptionsController {
  /**
   * Constructor to inject meta-option persistence logic
   */
  constructor(
    /**
     * Injecting MetaOptionsService for CRUD-style meta option operations
     */
    private readonly metaOptionsService: MetaOptionsService,
  ) {}

  /**
   * Method to return all meta options stored in the database
   */
  @Get()
  public getMetaOptions() {
    return this.metaOptionsService.findAll();
  }

  /**
   * Method to create a meta option from the request body
   */
  @Post()
  public createMetaOption(@Body() CreateMetaOptionDto: CreateMetaOptionDto) {
    return this.metaOptionsService.create(CreateMetaOptionDto);
  }
}
