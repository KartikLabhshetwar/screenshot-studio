import { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "Screenshot Studio - Free Screenshot Beautifier & Mockup Tool",
  description:
    "Transform plain screenshots into professional graphics with Screenshot Studio. 100+ gradient backgrounds, Safari and Chrome browser mockups, 3D effects, animations, and video export. Import tweets and code snippets. Better free alternative to Pika Style and Shots.so. No signup, no watermarks.",
  keywords: [
    "screenshot beautifier",
    "screenshot mockup maker",
    "beautify screenshots online",
    "screenshot background editor",
    "image presentation tool",
    "pika style alternative",
    "shots.so alternative",
    "browser window mockup",
    "safari browser mockup generator",
    "chrome browser frame generator",
    "screenshot wrapper online",
    "tweet to screenshot",
    "code snippet to image",
  ],
  openGraph: {
    title: "Screenshot Studio - Free Screenshot Beautifier & Mockup Tool",
    description:
      "Transform screenshots into professional graphics. 100+ backgrounds, browser mockups, 3D effects, animations, and video export. No signup required.",
    url: "/landing",
  },
  alternates: {
    canonical: "/landing",
  },
};

// How It Works - 3 steps
const howItWorks = [
  {
    step: 1,
    title: "Drop Your Image",
    description: "Drag any screenshot or photo",
  },
  {
    step: 2,
    title: "Style It",
    description: "Add backgrounds, shadows, text",
  },
  {
    step: 3,
    title: "Export",
    description: "Download in seconds",
  },
];

// Video testimonials
const videoTestimonials = [
  {
    videoId: "NAS4BEP2KtA",
    startTime: 3562,
    endTime: 3768,
  },
  {
    videoId: "29S4pv64Tbg",
    startTime: 222,
  },
];

export default function LandingPageRoute() {
  return (
    <LandingPage
      heroTitle="Beautiful images."
      heroSubtitle="Zero effort."
      heroDescription="The free browser editor that makes your screenshots, tweets, and code snippets look professional. Add Safari and Chrome browser mockups, 3D effects, and more."
      ctaLabel="Open Editor"
      ctaHref="/"
      howItWorks={howItWorks}
      videoTestimonials={videoTestimonials}
      videoTestimonialsTitle="Creators Love Screenshot Studio"
      brandName="Screenshot Studio"
    />
  );
}
