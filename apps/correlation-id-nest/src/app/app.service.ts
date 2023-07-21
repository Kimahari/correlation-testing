import { Injectable, Scope } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { getCurrentCorrelationId } from '@correlation-testing/correlation-id';
import { NestLoggerService } from './logger/logger.service';
import { WeatherForecast } from '@correlation-testing/generated/my-api-types';
import { CORRELATION_HEADER } from './../constants'

@Injectable({ scope: Scope.REQUEST })
export class AppService {
  constructor(private http: HttpService, private logger: NestLoggerService) {}

  async getData(): Promise<{ message: string }> {
    const data = { message: 'Hello API' };

    this.logger.info('Requesting Stuff From a server');

    const weatherData = (await firstValueFrom(
      this.http.get<WeatherForecast[]>(
        'http://localhost:5289/WeatherForecast',
        {
          headers: {
            [CORRELATION_HEADER] : getCurrentCorrelationId(),
          },
        }
      )
    )).data;

    this.logger.info('Done Getting Stuff From a server', weatherData);

    return data;
  }
}
