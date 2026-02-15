import { Navigation } from "./Navigation";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { Features } from "./Features";
import { Footer } from "./Footer";
import { MasonryGrid } from "./MasonryGrid";
import { FAQ } from "./FAQ";
import { SponsorButton } from "@/components/SponsorButton";
import { VideoTestimonials } from "./VideoTestimonials";
import { FinalCTA } from "./FinalCTA";
import { StructuredData } from "./StructuredData";
import { ValueProposition } from "./ValueProposition";
import { Marquee } from "./Marquee";

interface Feature {
  title: string;
  description: string;
  icon?: string;
}

interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
}

interface VideoTestimonial {
  videoId: string;
  startTime?: number;
  endTime?: number;
  title?: string;
  author?: string;
}

interface LandingPageProps {
  heroTitle: string;
  heroSubtitle?: string;
  heroDescription: string;
  ctaLabel?: string;
  ctaHref?: string;
  features: Feature[];
  featuresTitle?: string;
  howItWorks?: HowItWorksStep[];
  brandName?: string;
  videoTestimonials?: VideoTestimonial[];
  videoTestimonialsTitle?: string;
  valueProposition?: {
    eyebrow?: string;
    headline?: string;
  };
  marqueeText?: string;
}

export function LandingPage({
  heroTitle,
  heroSubtitle,
  heroDescription,
  ctaLabel = "Start Creating",
  ctaHref = "/home",
  features,
  featuresTitle,
  howItWorks,
  brandName = "Stage",
  videoTestimonials,
  videoTestimonialsTitle,
  valueProposition,
  marqueeText,
}: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StructuredData />

      <Navigation ctaLabel="Open Editor" ctaHref={ctaHref} />

      <Hero
        title={heroTitle}
        subtitle={heroSubtitle}
        description={heroDescription}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
      />

      <MasonryGrid />

      {/* Value Proposition Section */}
      <ValueProposition
        eyebrow={valueProposition?.eyebrow}
        headline={valueProposition?.headline}
      />

      {/* Marquee Section */}
      <Marquee text={marqueeText} />

      {videoTestimonials && videoTestimonials.length > 0 && (
        <VideoTestimonials
          testimonials={videoTestimonials}
          title={videoTestimonialsTitle}
        />
      )}

      {howItWorks && howItWorks.length > 0 && (
        <HowItWorks steps={howItWorks} title="How It Works" />
      )}

      <Features features={features} title={featuresTitle} />

      <FAQ />

      <FinalCTA
        title="Ready to create?"
        description="Join thousands of creators making beautiful images."
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
      />

      <Footer brandName={brandName} />

      <SponsorButton variant="floating" />
    </div>
  );
}
