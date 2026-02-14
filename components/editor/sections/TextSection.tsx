'use client';

import * as React from 'react';
import { SectionWrapper } from './SectionWrapper';
import { TextOverlayControls } from '@/components/text-overlay/text-overlay-controls';

export function TextSection() {
  return (
    <SectionWrapper title="Text Overlay" defaultOpen={true}>
      <TextOverlayControls />
    </SectionWrapper>
  );
}
