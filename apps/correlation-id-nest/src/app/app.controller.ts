import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { NestLoggerService } from './logger/logger.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private logger: NestLoggerService
  ) {}

  @Get()
  async getData() {
    this.logger.info('------------------------------------------------');
    this.logger.info('Starting Controller Method Request');

    const data = await this.appService.getData();

    this.logger.info('Done with Controller Method', data);
    this.logger.info('------------------------------------------------');
    return data;
  }
}
