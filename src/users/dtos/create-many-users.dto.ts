import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';

import { CreateUserDto } from './create-user.dto';

import { ApiProperty } from '@nestjs/swagger';

/**
 * Body for creating several users in one transactional operation
 */
export class CreateManyUsersDto {
  @ApiProperty({
    description: 'Array of users to create',
    type: [CreateUserDto],
    required: true,
    items: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        email: { type: 'string', example: 'john.doe@example.com' },
        password: { type: 'string', example: 'Password123#' },
      },
    },
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  users!: CreateUserDto[];
}
