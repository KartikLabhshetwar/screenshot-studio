"use client";

import { motion } from "motion/react";
import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

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

  const videoTitle = title || "Stage testimonial";

  return (
    <article className="space-y-4">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted/30">
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
        <div className="px-1">
          {title && (
            <h3 className="font-semibold text-foreground">{title}</h3>
          )}
          {author && (
            <p className="text-sm text-muted-foreground">{author}</p>
          )}
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

  return (
    <section className="py-20 sm:py-28 px-6 bg-background">
      <div className="container mx-auto max-w-4xl">
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16 ${instrumentSerif.className}`}
          >
            {title}
          </motion.h2>
        )}

        <div className="flex flex-wrap justify-center gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="w-full max-w-2xl"
            >
              <VideoTestimonialCard {...testimonial} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
