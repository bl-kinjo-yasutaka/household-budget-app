import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// デバッグ用：登録されているハンドラーを確認
if (process.env.NODE_ENV === 'development') {
  console.log('MSW handlers:', handlers.map(h => `${h.info.method} ${h.info.path}`));
}