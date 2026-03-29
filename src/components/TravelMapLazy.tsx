'use client';

import dynamic from 'next/dynamic';

const TravelMap = dynamic(() => import('@/components/TravelMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 animate-pulse" />
  ),
});

export default TravelMap;
