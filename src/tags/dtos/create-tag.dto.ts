import {
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data transfer object for creating a tag with slug validation and optional rich fields
 */
export class CreateTagDto {
  /** Display label for the tag */
  @ApiProperty({
    example: 'My First Tag',
    description: 'The name of the tag',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @MinLength(3)
  name: string;

  /** URL-safe unique slug for the tag */
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
  slug: string;

  /** Longer explanatory text shown on tag pages when set */
  @ApiPropertyOptional({
    example: 'This is the description of the tag',
    description: 'The description of the tag',
  })
  @IsString()
  @IsOptional()
  description?: string;

  /** Optional JSON metadata bundle for integrations or SEO */
  @ApiPropertyOptional({
    example: '{"key": "value"}',
    description: 'The JSON schema associated with the tag',
  })
  @IsJSON()
  @IsOptional()
  schema?: string;

  /** Optional banner or thumbnail image for the tag */
  @ApiPropertyOptional({
    example: 'https://example.com/featured-image.jpg',
    description: 'The URL of the featured image for the tag',
  })
  @IsUrl()
  @IsOptional()
  @MaxLength(1024)
  featuredImageUrl?: string;
}
