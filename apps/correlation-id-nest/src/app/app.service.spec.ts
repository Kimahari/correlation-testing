import { Test } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { AppService } from './app.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Scope } from '@nestjs/common';
import { NestLoggerService } from './logger/logger.service';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

function provideMock<TClass extends object>(cls: any) {
  return {
    provide: cls,
    useValue: createMock<TClass>(),
  };
}

describe('AppService', () => {
  let service: AppService;
  let http: DeepMocked<HttpService>;
  let logger: DeepMocked<NestLoggerService>;

  const response: AxiosResponse<any> = {
    data: {},
    headers: {},
    config: { url: 'http://localhost:3000/mockUrl' } as any,
    status: 200,
    statusText: 'OK',
  };

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      imports: [HttpModule.register({})],
      providers: [AppService, NestLoggerService],
    }).compile();

    service = await app.resolve<AppService>(AppService);
    http = await app.resolve(HttpService);
    logger = await app.resolve(NestLoggerService);
  });

  describe('getData', () => {
    it('should return "Hello API"', async () => {
      jest.spyOn(http, 'post').mockImplementationOnce(() => of(response));
      const getData = service.getData();
      await expect(getData).resolves.toEqual({ message: 'Hello API' });
    });
  });
});
