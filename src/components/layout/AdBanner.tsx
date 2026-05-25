import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function AdBanner() {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      // Push ad to Google AdSense
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40">
      <div className="max-w-screen-lg mx-auto" style={{ height: '50px', overflow: 'hidden' }}>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{
            display: 'inline-block',
            width: '100%',
            height: '50px'
          }}
          data-ad-client="ca-pub-7578637774996217"
          data-ad-slot="1422171146"
        />
      </div>
    </div>
  );
}
