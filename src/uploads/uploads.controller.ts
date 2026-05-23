import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Post,
} from '@nestjs/common';
import { UploadsService } from './providers/uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';

import type { Express } from 'express';
import { ApiHeaders, ApiOperation } from '@nestjs/swagger';

@Controller('uploads')
export class UploadsController {
  constructor(
    /**
     * Injecting UploadsService for persistence and queries
     */
    private readonly uploadsService: UploadsService,
  ) {}

  @UseInterceptors(FileInterceptor('file'))
  @ApiHeaders([
    {
      name: 'Content-Type',
      description: 'multipart/form-data',
      required: true,
    },
    {
      name: 'Authorization',
      description: 'Bearer <access_token>',
      required: true,
    },
  ])
  @ApiOperation({ summary: 'Upload a new image' })
  @Post('file')
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.uploadFile(file);
  }
}
