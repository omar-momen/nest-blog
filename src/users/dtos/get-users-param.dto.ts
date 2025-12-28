import { IsInt, IsOptional } from 'class-validator';

import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersParamDto {
  @ApiPropertyOptional({
    description: 'The ID of the user to retrieve',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number) // Transform to number
  id?: number;
}
