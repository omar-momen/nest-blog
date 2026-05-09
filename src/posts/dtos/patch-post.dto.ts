import { CreatePostDto } from './create-post.dto';
import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

/**
 * Data transfer object for patching a post; requires id plus any fields to change
 */
export class PatchPostDto extends PartialType(CreatePostDto) {
  /** Identifier of the row to merge partial updates into */
  @ApiProperty({
    description: 'The unique identifier of the post to be updated',
  })
  @IsInt()
  @IsNotEmpty()
  id!: number;
}
