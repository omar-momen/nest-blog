import { Injectable } from '@nestjs/common';

/**
 * Application-level service for generic root behavior (e.g. health-style greeting)
 */
@Injectable()
export class AppService {
  /**
   * Method to return the default hello message for the root route
   */
  getHello(): string {
    return 'Hello From NestJS!';
  }
}
