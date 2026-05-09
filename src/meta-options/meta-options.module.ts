import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { MetaOptionsController } from './meta-options.controller';
import { MetaOptionsService } from './providers/meta-options.service';
import { MetaOption } from './meta-option.entity';

/**
 * Feature module for meta options: REST API and exported service for cascade-related usage
 */
@Module({
  imports: [TypeOrmModule.forFeature([MetaOption])],
  controllers: [MetaOptionsController],
  providers: [MetaOptionsService],
  exports: [MetaOptionsService],
})
export class MetaOptionsModule {}
