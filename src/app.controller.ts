import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Root HTTP controller exposing basic application endpoints
 */
@Controller()
export class AppController {
  /**
   * Constructor wiring the root application service
   */
  constructor(
    /**
     * Injecting AppService for hello-world and related root responses
     */
    private readonly appService: AppService,
  ) {}

  /**
   * Returns a simple greeting string from the application service
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
