import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import { postType } from '../enums/postType.enum';
import { PostStatus } from '../enums/post-status.enum';

import { CreateMetaOptionDto } from '../../meta-options/dtos/create-meta-option.dto';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data transfer object for creating a post including tags, meta options, and author reference
 */
export class CreatePostDto {
  /** Human-readable headline for the post */
  @ApiProperty({
    example: 'My First Post',
    description: 'The title of the post',
  })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @MaxLength(512)
  title!: string;

  /** Whether this record is a standard post, page, story, or series */
  @ApiProperty({
    enum: postType,
    description: 'The type of the post (e.g., page, post, story, series)',
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType!: postType;

  /** URL segment identifier (lowercase, hyphen-separated) */
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
  @MaxLength(256)
  slug!: string;

  /** Editorial/publication state (draft, published, etc.) */
  @ApiProperty({
    enum: PostStatus,
    description:
      'The status of the post (e.g., draft, published, archived, scheduled)',
  })
  @IsEnum(PostStatus)
  @IsNotEmpty()
  @MaxLength(96)
  status!: PostStatus;

  /** Main body copy when present */
  @ApiPropertyOptional({
    example: 'This is the content of my first post.',
    description: 'The main content/body of the post',
  })
  @IsString()
  @IsOptional()
  content?: string;

  /** Optional JSON payload for structured content or schema hints */
  @ApiPropertyOptional({
    example: '{"key": "value"}',
    description: 'The JSON schema associated with the post',
  })
  @IsJSON()
  @IsOptional()
  schema?: string;

  /** Hero or card image URL when provided */
  @ApiPropertyOptional({
    example: 'https://example.com/featured-image.jpg',
    description: 'The URL of the featured image for the post',
  })
  @IsUrl()
  @IsOptional()
  @MaxLength(1024)
  featuredImageUrl?: string;

  /** Scheduled publish instant in ISO 8601 form when status implies scheduling */
  @ApiPropertyOptional({
    example: '2024-06-01T12:00:00Z',
    description: 'The date and time when the post should be published',
  })
  @IsISO8601()
  @IsOptional()
  publishOn?: Date;

  /** Foreign keys of tags to attach to this post */
  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: 'The IDs of the tags associated with the post',
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tags?: number[];

  /** Optional nested meta option object persisted with the post */
  @ApiPropertyOptional({
    required: false,
    items: {
      type: 'object',
      properties: {
        value: {
          type: 'json',
          description: 'The JSON value of the meta option',
          example: '{"isEnabled": "True"}',
        },
      },
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateMetaOptionDto) // Transform each item to CreateMetaOptionDto
  metaOptions?: CreateMetaOptionDto;

  /** Primary key of the user who owns this post */
  @ApiPropertyOptional({
    example: '1',
    description: 'The ID of the author of the post',
  })
  @IsNotEmpty()
  @IsInt()
  authorId: number;
}
