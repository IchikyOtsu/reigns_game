'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const GameMap = dynamic(() => import('./GameMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
      <div className="animate-pulse">Loading Map...</div>
    </div>
  ),
});

export default function MapWrapper(props: any) {
  return <GameMap {...props} />;
}
