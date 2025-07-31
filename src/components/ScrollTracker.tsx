'use client';

import { useScrollDepthTracking } from '@/hooks/useScrollDepthTracking';

export default function ScrollTracker() {
  useScrollDepthTracking();
  return null;
}