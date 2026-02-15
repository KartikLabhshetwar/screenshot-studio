'use client';

import * as React from 'react';
import { useImageStore } from '@/lib/store';
import { getClipInterpolatedProperties } from '@/lib/animation/interpolation';
import { DEFAULT_ANIMATABLE_PROPERTIES } from '@/types/animation';

export function useTimelinePlayback() {
  const {
    timeline,
    animationClips,
    setPlayhead,
    setTimeline,
    setPerspective3D,
    setImageOpacity,
  } = useImageStore();

  const { isPlaying, playhead, duration, isLooping, tracks } = timeline;
  const lastTimeRef = React.useRef<number | null>(null);
  const animationFrameRef = React.useRef<number | null>(null);

  // Animation loop
  React.useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const animate = (currentTime: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = currentTime;
      }

      const deltaMs = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Calculate new playhead position
      let newPlayhead = playhead + deltaMs;

      // Handle end of timeline
      if (newPlayhead >= duration) {
        if (isLooping) {
          newPlayhead = newPlayhead % duration;
        } else {
          newPlayhead = duration;
          setTimeline({ isPlaying: false });
        }
      }

      // Update playhead
      setPlayhead(newPlayhead);

      // Get interpolated properties at current time using clip-aware interpolation
      const interpolated = getClipInterpolatedProperties(
        animationClips,
        tracks,
        newPlayhead,
        DEFAULT_ANIMATABLE_PROPERTIES
      );

      // Apply interpolated properties to store
      setPerspective3D({
        perspective: interpolated.perspective,
        rotateX: interpolated.rotateX,
        rotateY: interpolated.rotateY,
        rotateZ: interpolated.rotateZ,
        translateX: interpolated.translateX,
        translateY: interpolated.translateY,
        scale: interpolated.scale,
      });

      if (interpolated.imageOpacity !== undefined) {
        setImageOpacity(interpolated.imageOpacity);
      }

      // Continue animation
      if (isPlaying && !(newPlayhead >= duration && !isLooping)) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playhead, duration, isLooping, tracks, animationClips, setPlayhead, setTimeline, setPerspective3D, setImageOpacity]);

  // Apply interpolated properties when playhead changes (for scrubbing)
  React.useEffect(() => {
    if (isPlaying) return; // Skip during playback (handled in animation loop)
    if (tracks.length === 0) return;

    const interpolated = getClipInterpolatedProperties(
      animationClips,
      tracks,
      playhead,
      DEFAULT_ANIMATABLE_PROPERTIES
    );

    setPerspective3D({
      perspective: interpolated.perspective,
      rotateX: interpolated.rotateX,
      rotateY: interpolated.rotateY,
      rotateZ: interpolated.rotateZ,
      translateX: interpolated.translateX,
      translateY: interpolated.translateY,
      scale: interpolated.scale,
    });

    if (interpolated.imageOpacity !== undefined) {
      setImageOpacity(interpolated.imageOpacity);
    }
  }, [playhead, isPlaying, tracks, animationClips, setPerspective3D, setImageOpacity]);
}
