'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import { Button } from './button';

const SLIDE_WIDTH: Record<1 | 2 | 3, string> = {
  1: 'w-full shrink-0',
  2: 'w-1/2 shrink-0',
  3: 'w-1/3 shrink-0',
};

export interface CarouselProps {
  /** One entry per slide, in order. */
  slides: ReactNode[];
  /** Accessible name announced with the carousel region. */
  label?: string;
  slidesPerView?: 1 | 2 | 3;
  showControls?: boolean;
  showDots?: boolean;
  /** Wrap from the last slide back to the first. */
  loop?: boolean;
  className?: string;
  /** Extra classes for every slide panel. */
  slideClassName?: string;
}

/**
 * Carousel — native scroll snapping, no emulation.
 *
 * The track is a real scroll container with `scroll-snap`, so touch gestures,
 * trackpads, and the scrollbar work for free. Buttons and arrow keys only ever
 * call `scrollBy`, and the active dot is derived from `scrollLeft` — there is no
 * second source of truth to desynchronise.
 */
export function Carousel({
  slides,
  label = 'Carousel',
  slidesPerView = 1,
  showControls = true,
  showDots = true,
  loop = false,
  className,
  slideClassName,
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  const slideWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    return track.clientWidth / slidesPerView;
  }, [slidesPerView]);

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const width = slideWidth() || 1;
    setActive(Math.min(slides.length - 1, Math.round(track.scrollLeft / width)));
    setEdges({
      start: track.scrollLeft <= 1,
      end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 1,
    });
  }, [slideWidth, slides.length]);

  useEffect(() => {
    sync();
  }, [sync]);

  // Slide width is a fraction of the track, so a viewport change moves every
  // snap point. Re-derive the index instead of trusting the pre-resize value.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => sync());
    observer.observe(track);
    return () => observer.disconnect();
  }, [sync]);

  function scrollTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    track.scrollTo({ left: clamped * slideWidth(), behavior: 'smooth' });
  }

  function step(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    const atStart = track.scrollLeft <= 1;
    if (direction === 1 && atEnd) {
      if (loop) track.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }
    if (direction === -1 && atStart) {
      if (loop) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
      return;
    }
    track.scrollBy({ left: direction * slideWidth(), behavior: 'smooth' });
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      step(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      step(-1);
    }
  }

  const prevDisabled = !loop && edges.start;
  const nextDisabled = !loop && edges.end;

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn('flex flex-col gap-3', className)}
    >
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={sync}
          tabIndex={0}
          aria-label={`${label} slides`}
          className="flex w-full snap-x snap-mandatory gap-0 overflow-x-auto rounded-lg scroll-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
              className={cn(SLIDE_WIDTH[slidesPerView], 'snap-start', slideClassName)}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {showControls || showDots ? (
        <div className="flex items-center justify-between gap-3">
          {showDots ? (
            <div className="flex items-center gap-1.5" role="tablist" aria-label={`${label} position`}>
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => scrollTo(index)}
                  className={cn(
                    'h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    index === active ? 'w-5 bg-brand-600' : 'w-1.5 bg-border-strong hover:bg-fg-subtle',
                  )}
                />
              ))}
            </div>
          ) : (
            <span />
          )}

          {showControls ? (
            <div className="flex items-center gap-1.5">
              <Button
                size="icon"
                variant="secondary"
                aria-label="Previous slide"
                disabled={prevDisabled}
                onClick={() => step(-1)}
              >
                <ChevronLeftIcon className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                aria-label="Next slide"
                disabled={nextDisabled}
                onClick={() => step(1)}
              >
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
