import { getCurrentCorrelationId } from '@correlation-testing/correlation-id';
import { Injectable, Scope } from '@nestjs/common';
import { getLogger, Logger, configure } from 'log4js';

//%utcdate [%CC] %level (%logger) -
//[%d] [%p] %c [%x{user}] %m
//

configure({
  appenders: {
    out: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '%d [#%x{user}#] (%c) [%p] %m',
        tokens: {
          user: function (logEvent) {
            return getCurrentCorrelationId();
          },
        },
      },
    },
  },
  categories: { default: { appenders: ['out'], level: 'info' } },
});

@Injectable({ scope: Scope.REQUEST })
export class NestLoggerService {
  private logger: Logger;

  constructor() {
    this.logger = getLogger('AppService');
  }

  info(message: string, params: any = '') {
    this.logger.info(message, params);
  }
}
