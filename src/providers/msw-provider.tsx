'use client';

import { useEffect, useState } from 'react';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const shouldUseMSW = process.env.NEXT_PUBLIC_USE_MSW === 'true';
    
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && shouldUseMSW) {
      import('@/src/mocks/browser').then(({ worker }) => {
        worker.start({
          onUnhandledRequest: 'bypass',
          serviceWorker: {
            url: '/mockServiceWorker.js',
          },
        }).then(() => {
          console.log('MSW started');
          setIsReady(true);
        });
      });
    } else {
      setIsReady(true);
    }
  }, []);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}