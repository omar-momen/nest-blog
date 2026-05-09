import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { MetaOption } from '../meta-option.entity';

import { CreateMetaOptionDto } from '../dtos/create-meta-option.dto';

/**
 * Class to connect to meta option related operations for posts
 */
@Injectable()
export class MetaOptionsService {
  /**
   * Constructor to inject the MetaOption repository
   */
  constructor(
    /**
     * Injecting the MetaOption repository to perform database operations related to meta options
     */
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  /**
   * Method to find all meta options
   */
  public findAll() {
    return this.metaOptionsRepository.find();
  }

  /**
   * Method to create and persist a new meta option
   */
  public async create(CreateMetaOptionDto: CreateMetaOptionDto) {
    const metaOption = this.metaOptionsRepository.create(CreateMetaOptionDto);
    return await this.metaOptionsRepository.save(metaOption);
  }

  /**
   * Method to permanently delete a meta option by id
   */
  public async delete(id: number) {
    await this.metaOptionsRepository.delete(id);
  }
}
