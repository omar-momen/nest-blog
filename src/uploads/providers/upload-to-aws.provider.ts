import { Injectable, RequestTimeoutException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { randomUUID } from 'node:crypto';

import { S3 } from 'aws-sdk';

@Injectable()
export class UploadToAwsProvider {
  constructor(
    /**
     * Injecting the ConfigService to get the AWS configuration
     */
    private readonly configService: ConfigService,
  ) {}

  public async uploadFile(file: Express.Multer.File) {
    const s3 = new S3();

    try {
      const uploadResult = await s3
        .upload({
          Bucket: this.configService.getOrThrow<string>(
            'app.aws.publicBucketName',
          ),
          Body: file.buffer,
          Key: this.generateKey(file),
          ContentType: file.mimetype,
          ContentLength: file.size,
        })
        .promise();

      return uploadResult.Key;
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }

  private generateKey(file: Express.Multer.File) {
    // Extract file name
    const fileName = file.originalname.split('.')[0];
    // REmove white spaces
    const fileNameWithoutSpaces = fileName.replace(/\s+/g, '');
    // Extract extension
    const extension = file.originalname.split('.')[1];
    // generate a timestamp
    const timestamp = Date.now();
    // generate a uuid
    const uuid = randomUUID();
    //  return file uuid
    return `${fileNameWithoutSpaces}-${timestamp}-${uuid}.${extension}`;
  }
}
