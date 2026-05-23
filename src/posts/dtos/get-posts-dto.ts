import { IsDate, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

import { IntersectionType } from '@nestjs/swagger';

class GetPostsQueryDto {
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;
}

export class GetPostsDto extends IntersectionType(
  GetPostsQueryDto,
  PaginationQueryDto,
) {}
