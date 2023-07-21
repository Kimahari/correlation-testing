import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpService, HttpModule } from '@nestjs/axios';
import { Scope } from '@nestjs/common';
import { NestLoggerService } from './logger/logger.service';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

describe('AppController', () => {
  let app: TestingModule;
  let httpService: HttpService;
  const response: AxiosResponse<any> = {
    data: {},
    headers: {},
    config: { url: 'http://localhost:3000/mockUrl' } as any,
    status: 200,
    statusText: 'OK',
  };

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      imports: [HttpModule.register({})],
      providers: [AppService, NestLoggerService],
    }).compile();

    //httpService = app.get(HttpService);
  });

  describe('getData', () => {
    it('should return "Hello API"', async () => {
      httpService = await app.resolve(HttpService);
      jest
        .spyOn(httpService, 'post')
        .mockImplementationOnce(() => of(response));

      const appController = await app.resolve<AppController>(AppController);
      const data = appController.getData();
      await expect(data).resolves.toEqual({ message: 'Hello API' });
      //expect(appController.getData()).toEqual({  });
    });
  });
});
