"use client";

import { cn } from "@/lib/utils";

interface VideoTestimonial {
  videoId: string;
  startTime?: number;
  endTime?: number;
  title?: string;
  author?: string;
}

interface VideoTestimonialsProps {
  testimonials: VideoTestimonial[];
  title?: string;
}

function VideoTestimonialCard({
  videoId,
  startTime,
  endTime,
  title,
  author,
}: VideoTestimonial) {
  const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
  if (startTime) embedUrl.searchParams.set("start", startTime.toString());
  if (endTime) embedUrl.searchParams.set("end", endTime.toString());
  embedUrl.searchParams.set("rel", "0");

  const videoTitle = title || "Screenshot Studio testimonial";

  return (
    <article className="flex flex-col gap-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-card shadow-[var(--card-edge-shadow)] ring-1 ring-border">
        <iframe
          width="100%"
          height="100%"
          src={embedUrl.toString()}
          title={videoTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0"
          loading="lazy"
        />
      </div>
      {(title || author) && (
        <div className="px-0.5">
          {title ? (
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          ) : null}
          {author ? (
            <p className="mt-1 text-sm text-muted-foreground">{author}</p>
          ) : null}
        </div>
      )}
    </article>
  );
}

export function VideoTestimonials({
  testimonials,
  title,
}: VideoTestimonialsProps) {
  if (!testimonials || testimonials.length === 0) return null;

  const count = testimonials.length;

  return (
    <section
      aria-label={title || "Creator testimonials"}
      className="bg-background px-6 py-16 sm:py-20 md:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        {title ? (
          <h2
            className="landing-heading mb-12 text-center text-[28px] leading-[34px] font-semibold tracking-[-0.03em] sm:text-[36px] sm:leading-[42px] md:mb-14 md:text-[44px] md:leading-[50px]"
            style={{
              fontFamily:
                'Inter, "Inter Fallback", Arial, Helvetica, sans-serif',
            }}
          >
            {title}
          </h2>
        ) : null}

        <div
          className={cn(
            "grid gap-4",
            count === 1 && "mx-auto max-w-3xl grid-cols-1",
            count === 2 && "grid-cols-1 md:grid-cols-2",
            count === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
            count >= 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {testimonials.map((testimonial) => (
            <VideoTestimonialCard key={testimonial.videoId} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
