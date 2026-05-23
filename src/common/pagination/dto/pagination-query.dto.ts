import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({
    description: 'The number of items to return',
    example: 10,
  })
  @IsOptional()
  @IsPositive()
  @Max(20)
  @Min(1)
  limit: number = 10;
  @ApiProperty({
    description: 'The page number',
    example: 1,
  })
  @IsOptional()
  @IsPositive()
  page: number = 1;
}
