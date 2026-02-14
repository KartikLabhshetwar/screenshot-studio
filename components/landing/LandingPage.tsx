import { Navigation } from "./Navigation";
import { Hero } from "./Hero";
import { SocialProof } from "./SocialProof";
import { HowItWorks } from "./HowItWorks";
import { Features } from "./Features";
import { Footer } from "./Footer";
import { MasonryGrid } from "./MasonryGrid";
import { FAQ } from "./FAQ";
import { Sponsors, Sponsor } from "./Sponsors";
import { SponsorButton } from "@/components/SponsorButton";
import { VideoTestimonials } from "./VideoTestimonials";
import { FinalCTA } from "./FinalCTA";
import { StructuredData } from "./StructuredData";

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

interface SocialProofData {
  stats?: { value: string; label: string }[];
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
  socialProof?: SocialProofData;
  sponsors?: Sponsor[];
  sponsorsTitle?: string;
  brandName?: string;
  videoTestimonials?: VideoTestimonial[];
  videoTestimonialsTitle?: string;
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
  socialProof,
  sponsors,
  sponsorsTitle,
  brandName = "Stage",
  videoTestimonials,
  videoTestimonialsTitle,
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

      {socialProof && <SocialProof stats={socialProof.stats} />}

      <MasonryGrid />

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

      <Sponsors sponsors={sponsors} title={sponsorsTitle} />

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
