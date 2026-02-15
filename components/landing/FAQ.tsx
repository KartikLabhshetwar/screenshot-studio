"use client";

import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  faqs?: FAQItem[];
}

const defaultFAQs: FAQItem[] = [
  {
    question: "Is Stage really free?",
    answer:
      "Yes. Stage is 100% free with no hidden costs. Unlimited exports, all features, no watermarks. No signup required.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. Just open the editor and start creating. Your work saves automatically in your browser with unlimited undo/redo.",
  },
  {
    question: "What frames and styles are available?",
    answer:
      "macOS and Windows browser frames, Arc-style rounded frames, Polaroid borders, 3D perspective transforms, and customizable shadows with blur, spread, and color controls.",
  },
  {
    question: "What export formats are supported?",
    answer:
      "PNG (with transparency) or JPG. Export up to 5x resolution for crisp, high-quality output on any platform.",
  },
  {
    question: "Which aspect ratios can I use?",
    answer:
      "Instagram (1:1, 4:5, 9:16), YouTube (16:9), Twitter, LinkedIn, Open Graph, and standard photo ratios—all optimized for their platforms.",
  },
  {
    question: "What file types can I upload?",
    answer:
      "PNG, JPG, JPEG, or WEBP up to 100MB. All processing happens locally in your browser—fast and completely private.",
  },
  {
    question: "Can I add text and overlays?",
    answer:
      "Yes. Add multiple text layers with custom fonts, sizes, colors, and shadows. Plus decorative overlays like arrows and icons.",
  },
  {
    question: "Is my data stored on your servers?",
    answer:
      "No. Stage runs entirely in your browser. Your images never leave your device unless you export them yourself.",
  },
];

export function FAQ({
  title = "Questions",
  faqs = defaultFAQs,
}: FAQProps) {
  return (
    <section className="py-20 sm:py-28 md:py-32 px-6 bg-background">
      <div className="container mx-auto max-w-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16 ${instrumentSerif.className}`}
        >
          {title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-border/40"
              >
                <AccordionTrigger className="text-left text-base sm:text-lg font-medium py-5 hover:no-underline hover:text-primary transition-colors gap-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
