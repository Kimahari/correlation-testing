import { correlationId } from './correlation-id';

describe('correlationId', () => {
  it('should work', () => {
    expect(correlationId()).toBeTruthy();
  });
});
