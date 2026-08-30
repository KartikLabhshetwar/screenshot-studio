import { Metadata } from 'next';
import { CodeImageEditorLoader } from '@/components/code-image/CodeImageEditorLoader';
import { OG_DEFAULTS } from '@/lib/seo/metadata';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const metadata: Metadata = {
  title: 'Code to Image: Create Beautiful Code Screenshots',
  description:
    'Turn code into a shareable image. 32 themes, gradients, and window styles, export a crisp PNG or animate it in Studio. Free, no signup, no watermark.',
  keywords: [
    'code to image',
    'code snippet screenshot',
    'code screenshot generator',
    'ray.so alternative',
    'carbon alternative',
    'carbon.now.sh alternative',
    'code to png',
    'syntax highlighting screenshot',
    'beautiful code screenshots',
    'code image generator free',
    'share code as image',
    'code snippet generator',
    'animated code screenshot',
  ],
  openGraph: {
    ...OG_DEFAULTS,
    title: 'Code to Image: Create Beautiful Code Screenshots',
    description:
      'Turn code into beautiful, shareable images. 32 themes, gradients, line numbers, and window frames. Free, no signup.',
    url: '/code',
  },
  alternates: {
    canonical: '/code',
  },
};

const faqs = [
  {
    question: 'Is this code to image tool free?',
    answer:
      'Yes. Every theme, background, and export option is free, with no signup and no watermark.',
  },
  {
    question: 'How many syntax themes are included?',
    answer:
      'Over 30 themes ported from ray.so, including its full color set (Midnight, Candy, Sunset, and more) and partner themes like Vercel, Supabase, and Tailwind.',
  },
  {
    question: 'Can I export a transparent background?',
    answer:
      'Yes. Turn the Background switch off before exporting and the PNG keeps a transparent backdrop.',
  },
  {
    question: 'Can I animate my code screenshot?',
    answer:
      'Yes. Use "Animate in Studio" to send your code image into the full Screenshot Studio editor, where you can add motion and export it as a video or GIF.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Screenshot Studio - Code to Image',
      applicationCategory: 'DesignApplication',
      operatingSystem: 'Web Browser',
      description:
        'Free tool that turns code into a beautiful, shareable image with syntax themes, gradient backgrounds, and window styles.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        '32 syntax themes ported from ray.so',
        'Vercel, Supabase, Tailwind, and other partner themes',
        'Resizable window frame with macOS or no title bar',
        'Transparent background export',
        'Animate in Studio for video and GIF export',
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ],
};

export default function CodeImagePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <CodeImageEditorLoader />
      <section className="bg-background px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-3 text-2xl font-semibold tracking-[-0.02em] text-foreground">
            Code to Image Generator
          </h1>
          <p className="mb-10 text-muted-foreground">
            Paste a snippet, pick from 32 themes ported from ray.so, and
            export a crisp PNG in seconds. No signup, no watermark, and
            everything runs in your browser. Want motion? Send your code
            image into Screenshot Studio and animate it as a video or GIF.
          </p>
          <Accordion type="single" collapsible>
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}
