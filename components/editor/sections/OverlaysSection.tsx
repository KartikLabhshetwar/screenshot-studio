'use client';

import * as React from 'react';
import { SectionWrapper } from './SectionWrapper';
import { ArrowGallery, OverlayShadowsGallery, OverlayGallery, OverlayControls } from '@/components/overlays';

export function OverlaysSection() {
  return (
    <SectionWrapper title="Overlays & Effects" defaultOpen={true}>
      <div className="space-y-5">
        {/* Arrow Gallery */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-text-tertiary uppercase tracking-wide">Arrows</span>
          <ArrowGallery />
        </div>

        {/* Shadow Overlays */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-text-tertiary uppercase tracking-wide">Shadow Effects</span>
          <OverlayShadowsGallery />
        </div>

        {/* Stickers */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-text-tertiary uppercase tracking-wide">Stickers</span>
          <OverlayGallery />
        </div>

        {/* Overlay Controls */}
        <OverlayControls />
      </div>
    </SectionWrapper>
  );
}
