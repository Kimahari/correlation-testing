import { Request, Response, NextFunction } from 'express';

import { CORRELATION_HEADER } from './constants';
import { correlationId, execucuteWithWId } from '@correlation-testing/correlation-id';
import { createWriteHead } from './write-head';

export async function correlate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let corId = correlationId();

  if (req.headers[CORRELATION_HEADER]) {
    corId = req.headers[CORRELATION_HEADER][0];
  }

  console.log('Starting Request...', corId);
  res.setHeader(CORRELATION_HEADER, corId);

  await execucuteWithWId(corId, async () => {
    await new Promise<void>((resolve) => {
      res.writeHead = createWriteHead(res.writeHead, resolve);
      res.write;
      next();
    });
  });

  console.log('Done with request', corId);
}

