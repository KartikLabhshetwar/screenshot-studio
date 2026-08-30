import { Metadata } from 'next';
import Link from 'next/link';
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
    'Turn code into a shareable image. 14 themes plus gradient, image, and pattern backgrounds, export a crisp PNG. Free, no signup, no watermark.',
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
  ],
  openGraph: {
    ...OG_DEFAULTS,
    title: 'Code to Image: Create Beautiful Code Screenshots',
    description:
      'Turn code into beautiful, shareable images. 14 themes, gradients, images, and window frames. Free, no signup.',
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
      '14 color themes (Midnight, Candy, Sunset, and more), each pairable with its own gradient, one of Screenshot Studio\'s gradient and image backgrounds, or a simple pattern.',
  },
  {
    question: 'Can I export a transparent background?',
    answer:
      'Yes. Turn the Background switch off before exporting and the PNG keeps a transparent backdrop.',
  },
  {
    question: 'What kind of backgrounds can I use?',
    answer:
      'Pick the theme\'s own gradient, one of dozens of gradient presets, a real image background, or a simple grid, dot, or line pattern, all from the Background picker.',
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
        '14 syntax highlighting themes',
        'Gradient, image, and pattern backgrounds',
        'Resizable window frame with macOS or no title bar',
        'Transparent background export',
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
      <section className="bg-background px-6 pt-16 pb-48">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-3 text-2xl font-semibold tracking-[-0.02em] text-foreground">
            Code to Image Generator
          </h1>
          <p className="mb-10 text-muted-foreground">
            Paste a snippet, pick a theme and background, and export a crisp
            PNG in seconds. No signup, no watermark, everything runs in your
            browser.
          </p>
          <Accordion type="single" collapsible>
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="mt-10 text-sm text-muted-foreground">
            Coming from another tool? See how it compares to{' '}
            <Link href="/compare/carbon" className="underline">Carbon</Link>
            {' '}and{' '}
            <Link href="/compare/ray-so" className="underline">Ray.so</Link>,
            or explore the{' '}
            <Link href="/features/code-snippets" className="underline">
              code snippet feature
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
