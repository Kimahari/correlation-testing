import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { HttpModule } from '@nestjs/axios';
import { getCurrentCorrelationId } from '@correlation-testing/correlation-id';
import { NestLoggerService } from './logger/logger.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => {
        return {
          timeout: 50000,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, NestLoggerService],
})
export class AppModule {}
