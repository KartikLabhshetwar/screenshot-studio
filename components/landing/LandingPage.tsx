import { Navigation } from "./Navigation";
import { HeroAtmosphere } from "./HeroAtmosphere";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { Footer } from "./Footer";
import { FAQ } from "./FAQ";
import { VideoTestimonials } from "./VideoTestimonials";
import { StructuredData } from "./StructuredData";
import { FeaturesBento } from "./FeaturesBento";
import { ProductOverview } from "./ProductOverview";
import { MasonryGrid } from "./MasonryGrid";

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
  features?: { title: string; description: string; icon?: string }[];
  featuresTitle?: string;
  howItWorks?: HowItWorksStep[];
  brandName?: string;
  videoTestimonials?: VideoTestimonial[];
  videoTestimonialsTitle?: string;
  marqueeText?: string;
}

export function LandingPage({
  heroTitle,
  heroSubtitle,
  heroDescription,
  ctaLabel = "Start Creating",
  ctaHref = "/",
  howItWorks,
  brandName = "Screenshot Studio",
  videoTestimonials,
  videoTestimonialsTitle,
}: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StructuredData />

      <div className="relative isolate">
        <HeroAtmosphere />
        <Navigation brandName={brandName} />
        <Hero
          title={heroTitle}
          subtitle={heroSubtitle}
          description={heroDescription}
          ctaLabel={ctaLabel}
          ctaHref={ctaHref}
        />
      </div>

      <ProductOverview />

      <FeaturesBento />

      {howItWorks && howItWorks.length > 0 && <HowItWorks steps={howItWorks} />}

      <MasonryGrid />

      {videoTestimonials && videoTestimonials.length > 0 && (
        <VideoTestimonials
          testimonials={videoTestimonials}
          title={videoTestimonialsTitle}
        />
      )}

      <FAQ ctaLabel={ctaLabel} ctaHref={ctaHref} />

      <Footer brandName={brandName} />
    </div>
  );
}
