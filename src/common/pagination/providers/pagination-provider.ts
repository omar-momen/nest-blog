import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';

import { PaginationQueryDto } from '../dto/pagination-query.dto';

import { Paginated } from '../interfaces/paginated.interface';

function getRequestOrigin(req: Request): string {
  const xfProto = req.get('x-forwarded-proto');
  const protocol = (
    xfProto?.split(',')[0]?.trim() ||
    req.protocol ||
    'http'
  ).replace(/:$/, '');
  const xfHost = req.get('x-forwarded-host');
  const host = xfHost?.split(',')[0]?.trim() || req.get('host') || 'localhost';
  const proto = protocol === 'http' || protocol === 'https' ? protocol : 'http';
  return `${proto}://${host}`;
}

function getRequestPathname(req: Request): string {
  try {
    return new URL(req.originalUrl || '/', 'http://localhost').pathname;
  } catch {
    return '/';
  }
}

function buildPageUrl(req: Request, page: number, limit: number): string {
  const origin = getRequestOrigin(req);
  const pathname = getRequestPathname(req);
  const params = new URLSearchParams();
  try {
    const parsed = new URL(req.originalUrl || req.url || '/', `${origin}/`);
    parsed.searchParams.forEach((value, key) => {
      if (key !== 'page' && key !== 'limit') {
        params.append(key, value);
      }
    });
  } catch {
    // ignore malformed URLs; still emit page/limit
  }
  params.set('page', String(page));
  params.set('limit', String(limit));
  return `${origin}${pathname}?${params.toString()}`;
}

@Injectable({ scope: Scope.REQUEST })
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  public async paginate<T extends ObjectLiteral>(
    paginationQueryDto: PaginationQueryDto,
    repository: Repository<T>,
    options?: Omit<FindManyOptions<T>, 'skip' | 'take'>,
  ): Promise<Paginated<T>> {
    const [result, total] = await repository.findAndCount({
      ...options,
      take: paginationQueryDto.limit,
      skip: (paginationQueryDto.page - 1) * paginationQueryDto.limit,
    });

    const totalPages = Math.ceil(total / paginationQueryDto.limit) || 1;
    const currentPage = paginationQueryDto.page;
    const link = (page: number) =>
      buildPageUrl(this.request, page, paginationQueryDto.limit);

    return {
      data: result,
      meta: {
        itemsPerPage: paginationQueryDto.limit,
        totalItems: total,
        currentPage,
        totalPages,
      },
      links: {
        first: link(1),
        last: link(totalPages),
        next: currentPage < totalPages ? link(currentPage + 1) : null,
        previous: currentPage > 1 ? link(currentPage - 1) : null,
        current: link(currentPage),
      },
    };
  }
}
