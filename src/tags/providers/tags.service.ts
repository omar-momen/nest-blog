import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Tag } from '../tag.entity';
import { CreateTagDto } from '../dtos/create-tag.dto';

/**
 * Class to connect to tag related operations
 */
@Injectable()
export class TagsService {
  /**
   * Constructor to inject the Tag repository
   */
  constructor(
    /**
     * Injecting the Tag repository to perform database operations related to tags
     */
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  /**
   * Method to create a new tag
   */
  public async create(createTagDto: CreateTagDto) {
    const tag = this.tagsRepository.create(createTagDto);
    return await this.tagsRepository.save(tag);
  }

  /**
   * Method to load multiple tags by their primary keys
   */
  public async findMultipleTags(ids: number[]) {
    return await this.tagsRepository.find({ where: { id: In(ids) } });
  }

  /**
   * Method to permanently delete a tag by id
   */
  public async delete(id: number) {
    await this.tagsRepository.delete(id);
    return { message: 'Tag deleted successfully' };
  }

  /**
   * Method to soft-delete a tag by id (sets deletedAt when using soft delete columns)
   */
  public async softDelete(id: number) {
    await this.tagsRepository.softDelete(id);
    return { message: 'Tag soft deleted successfully' };
  }
}
