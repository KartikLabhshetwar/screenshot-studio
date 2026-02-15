"use client";

import { motion } from "motion/react";
import { Instrument_Serif } from "next/font/google";
import { StarIcon } from "hugeicons-react";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

interface TestimonialProps {
  quote?: string;
  author?: string;
  title?: string;
  company?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export function Testimonial({
  quote = "Stage has completely transformed how I create content. What used to take me hours in Photoshop now takes minutes. It's honestly magical.",
  author = "Sarah Chen",
  title = "Content Creator",
  company = "@sarahcreates",
  imageSrc = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60",
  imageAlt = "Testimonial author",
}: TestimonialProps) {
  return (
    <section className="relative py-32 sm:py-40 px-6 overflow-hidden">
      {/* Background with gradient mesh effect */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 max-w-screen-xl mx-auto">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-4 h-4 text-brand fill-brand" />
              ))}
            </div>
            <span className="text-sm text-white/60">Loved by creators</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-center">
          {/* Quote Side - Takes 3 columns */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-3 order-2 lg:order-1"
          >
            {/* Large decorative quote mark */}
            <div className="relative mb-8">
              <svg
                className="w-16 h-16 sm:w-20 sm:h-20 text-brand"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L9.373 5c-.8.396-1.56.898-2.26 1.505-.71.607-1.34 1.305-1.9 2.094s-.98 1.68-1.25 2.69-.346 2.04-.217 3.1c.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.003zm9.124 0c0-.88-.23-1.618-.69-2.217-.326-.42-.768-.695-1.327-.825-.55-.13-1.07-.14-1.54-.03-.16-.94.09-1.95.75-3.02.66-1.06 1.514-1.86 2.557-2.4L18.49 5c-.8.396-1.555.898-2.26 1.505-.708.607-1.34 1.305-1.894 2.094-.556.79-.97 1.68-1.24 2.69-.273 1-.345 2.04-.217 3.1.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l-.007.003z" />
              </svg>
            </div>

            {/* Quote Text */}
            <blockquote
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-normal leading-[1.15] tracking-tight text-white mb-10 ${instrumentSerif.className}`}
            >
              {quote}
            </blockquote>

            {/* Author Info */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-brand/30 ring-offset-2 ring-offset-[#0a0a0a]">
                  <img
                    src={imageSrc}
                    alt={author}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-brand rounded-full border-2 border-[#0a0a0a]" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{author}</p>
                <p className="text-white/50">
                  {title} <span className="text-brand">{company}</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Image Side - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 3 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-2 order-1 lg:order-2"
          >
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-brand/20 via-purple-500/10 to-transparent blur-xl" />

              {/* Main image container */}
              <div className="relative aspect-[3/4] rounded-[24px] overflow-hidden bg-surface-3 border border-white/10">
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="w-full h-full object-cover"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Floating stats card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wider">Images created</p>
                      <p className="text-2xl font-bold text-white">2,847</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-brand/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, type: "spring" }}
                className="absolute -top-3 -right-3 px-4 py-2 rounded-full bg-brand text-brand-foreground text-sm font-semibold shadow-lg shadow-brand/25"
              >
                Pro User
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
