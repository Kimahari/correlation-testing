import { AsyncLocalStorage } from 'async_hooks';

const storage = new AsyncLocalStorage();

export function correlationId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function execucuteWithWId<TResult>(
  id: string,
  func: () => TResult
): Promise<TResult> {
  //console.info('Starting Work With ID', id);
  const test = await storage.run({ id }, () => func());
  //console.info('Completed Work With ID', id);
  return test;
}

export function getCurrentCorrelationId() {
  const currentStore = storage.getStore() as { id: string };
  if (!currentStore || !currentStore.id) return '';
  return currentStore.id;
}
