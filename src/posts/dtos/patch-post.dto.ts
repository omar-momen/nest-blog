import { CreatePostDto } from './create-post.dto';
import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class PatchPostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: 'The unique identifier of the post to be updated',
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
