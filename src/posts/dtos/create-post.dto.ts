import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import { postType } from '../enums/postType.enum';
import { PostStatus } from '../enums/post-status.enum';

import { CreatePostMetaOptionsDto } from './create-post-meta-options.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: 'My First Post',
    description: 'The title of the post',
  })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: postType,
    description: 'The type of the post (e.g., page, post, story, series)',
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({
    example: 'my-first-post',
    description:
      'The slug of the post used in the URL. It should be lowercase and can include hyphens.',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug can only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen. For example: my-post-slug',
  })
  slug: string;

  @ApiProperty({
    enum: PostStatus,
    description:
      'The status of the post (e.g., draft, published, archived, scheduled)',
  })
  @IsEnum(PostStatus)
  @IsNotEmpty()
  status: PostStatus;

  @ApiPropertyOptional({
    example: 'This is the content of my first post.',
    description: 'The main content/body of the post',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    example: '{"key": "value"}',
    description: 'The JSON schema associated with the post',
  })
  @IsJSON()
  @IsOptional()
  schema?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/featured-image.jpg',
    description: 'The URL of the featured image for the post',
  })
  @IsUrl()
  @IsOptional()
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    example: '2024-06-01T12:00:00Z',
    description: 'The date and time when the post should be published',
  })
  @IsISO8601()
  @IsOptional()
  publishOn?: Date;

  @ApiPropertyOptional({
    example: ['nestjs', 'typescript', 'backend'],
    description: 'Tags associated with the post',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // 'each: true' ensures that each element in the array is a string
  @MinLength(3, { each: true })
  tags?: string[];

  @ApiPropertyOptional({
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        key: { type: 'string', example: 'seoTitle' },
        value: { type: 'any', example: 'My First Post - Learn NestJS' },
      },
    },
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // Added decorator to validate each item in the array
  @Type(() => CreatePostMetaOptionsDto) // Transform each item to CreatePostMetaOptionsDto
  metaOptions?: CreatePostMetaOptionsDto[];
}
