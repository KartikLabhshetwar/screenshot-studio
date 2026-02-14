'use client';

import * as React from 'react';
import { SectionWrapper } from './SectionWrapper';
import { MockupGallery, MockupControls } from '@/components/mockups';

export function DeviceFramesSection() {
  return (
    <SectionWrapper title="Device Frames" defaultOpen={false}>
      <div className="space-y-4">
        <MockupGallery />
        <MockupControls />
      </div>
    </SectionWrapper>
  );
}
