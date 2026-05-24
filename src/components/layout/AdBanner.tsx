import { useState } from 'react';

export function AdBanner() {
  const [adContent] = useState<string | null>(null);

  // Future: Load ad from network
  // For now: always null

  if (!adContent) return null; // NO space reserved

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800">
      <div className="max-w-screen-sm mx-auto h-[50px] md:h-[90px] flex items-center justify-center">
        {/* Ad content will go here */}
        <div className="text-text-secondary text-sm">Advertisement</div>
      </div>
    </div>
  );
}
