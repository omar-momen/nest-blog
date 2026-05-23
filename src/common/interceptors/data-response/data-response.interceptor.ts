import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, map } from 'rxjs';

interface DataResponseBody<T> {
  data: T;
  apiVersion: string;
}

@Injectable()
export class DataResponseInterceptor<T = unknown>
  implements NestInterceptor<T, DataResponseBody<T>>
{
  constructor(private readonly configService: ConfigService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<DataResponseBody<T>> {
    console.log('Before .... ');

    return next.handle().pipe(
      map(
        (data): DataResponseBody<T> => ({
          data,
          apiVersion: this.configService.get<string>('app.apiVersion') ?? '',
        }),
      ),
    );
  }
}
