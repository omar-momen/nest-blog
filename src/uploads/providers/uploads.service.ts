import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Upload } from '../upload.entity';
import { UploadToAwsProvider } from './upload-to-aws.provider';

import { UploadedFile } from '../interfaces/upload-file.interface';

import { ConfigService } from '@nestjs/config';

import { FileTypes } from '../enums/file-types';

@Injectable()
export class UploadsService {
  constructor(
    /**
     * Injecting the Upload repository to perform database operations related to uploads
     */
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,

    /**
     * Injecting the UploadToAwsProvider to upload files to AWS
     */
    private readonly uploadToAwsProvider: UploadToAwsProvider,

    /**
     * Injecting the ConfigService to get the AWS configuration
     */
    private readonly configService: ConfigService,
  ) {}

  public async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // throw an error if file type is not image
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} not supported`);
    }

    // Upload to S3
    const uploadedFileKey = await this.uploadToAwsProvider.uploadFile(file);

    // generate a new entity in database
    const uploadFile: UploadedFile = {
      name: uploadedFileKey,
      path: `https://${this.configService.getOrThrow<string>('app.aws.cloudFrontUrl')}/${uploadedFileKey}`,
      type: FileTypes.IMAGE,
      mime: file.mimetype,
      size: file.size,
    };

    try {
      const newUpload = this.uploadRepository.create(uploadFile);
      return this.uploadRepository.save(newUpload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
