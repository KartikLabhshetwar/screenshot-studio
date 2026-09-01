'use client';

import * as React from 'react';
import { MockupGallery, MockupControls } from '@/components/mockups';
import { useImageStore } from '@/lib/store';
import { useDeviceUIStore } from '@/lib/store/device-ui';
import { SectionWrapper } from './SectionWrapper';

export function DeviceFramesSection(): React.JSX.Element {
  const mockups = useImageStore((state) => state.mockups);
  const galleryOpen = useDeviceUIStore((state) => state.galleryOpen);
  const reconcileMockups = useDeviceUIStore((state) => state.reconcileMockups);
  const mockupCount = mockups.length;
  const view = galleryOpen || mockupCount === 0 ? 'gallery' : 'controls';
  const [contentKey, setContentKey] = React.useState(view);
  const [transitioning, setTransitioning] = React.useState(false);

  React.useEffect(() => {
    reconcileMockups(mockups.map((mockup) => mockup.id));
  }, [mockups, reconcileMockups]);

  React.useEffect(() => {
    if (view === contentKey) return;

    setTransitioning(true);
    const timeout = window.setTimeout(() => {
      setContentKey(view);
      setTransitioning(false);
    }, 120);

    return () => window.clearTimeout(timeout);
  }, [contentKey, view]);

  return (
    <SectionWrapper title="Devices">
      <div
        className="min-w-0 transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? 'translateY(4px)' : 'translateY(0)',
        }}
      >
        {contentKey === 'gallery' ? <MockupGallery /> : <MockupControls />}
      </div>
    </SectionWrapper>
  );
}
