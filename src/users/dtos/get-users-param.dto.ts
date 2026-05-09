import { IsInt, IsOptional } from 'class-validator';

import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Route/query parameters when fetching users (optional id filter)
 */
export class GetUsersParamDto {
  /** When present, restricts the listing to a single user id */
  @ApiPropertyOptional({
    description: 'The ID of the user to retrieve',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number) // Transform to number
  id?: number;
}
