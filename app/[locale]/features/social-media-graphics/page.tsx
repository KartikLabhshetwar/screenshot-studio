import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { ArrowRight, Twitter, Instagram, Linkedin, Share2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Social Media Graphics Maker - Create Stunning Posts",
  description:
    "Create professional social media graphics for Twitter, LinkedIn, and Instagram. Transform screenshots into shareable content with perfect dimensions. Free, no signup.",
  keywords: [
    "social media graphics maker",
    "twitter card generator",
    "linkedin post maker",
    "instagram post creator",
    "social media image editor",
    "free graphics maker",
    "social media templates",
    "twitter post image maker",
    "og image generator free",
    "social media screenshot tool",
    "product hunt screenshot maker",
    "social media mockup generator",
    "twitter banner maker free",
  ],
  openGraph: {
    title: "Free Social Media Graphics Maker - Create Stunning Posts",
    description:
      "Create professional social media graphics. Perfect dimensions for every platform.",
    url: "/features/social-media-graphics",
  },
  alternates: {
    canonical: "/features/social-media-graphics",
  },
};

const platforms = [
  {
    icon: Twitter,
    name: "Twitter / X",
    dimensions: "1200 x 675px",
    description:
      "Create eye-catching Twitter cards and post images that drive engagement.",
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    dimensions: "1200 x 627px",
    description:
      "Professional graphics for LinkedIn posts that establish authority.",
  },
  {
    icon: Instagram,
    name: "Instagram",
    dimensions: "1080 x 1080px",
    description:
      "Square posts and stories that stand out in crowded feeds.",
  },
  {
    icon: Share2,
    name: "Any Platform",
    dimensions: "Custom sizes",
    description:
      "Export at any dimension for blogs, presentations, or documentation.",
  },
];

const benefits = [
  {
    title: "No Design Skills Needed",
    description:
      "Our intuitive editor makes it easy to create professional graphics in minutes.",
  },
  {
    title: "Consistent Branding",
    description:
      "Use custom backgrounds and colors to match your brand identity across all posts.",
  },
  {
    title: "High Resolution Output",
    description:
      "Export at up to 5x resolution for crisp graphics on any device.",
  },
  {
    title: "Zero Cost",
    description:
      "Create unlimited graphics without watermarks. 100% free forever.",
  },
];

export default function SocialMediaGraphicsPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://screenshot-studio.com" },
      { "@type": "ListItem", position: 2, name: "Features", item: "https://screenshot-studio.com/features" },
      { "@type": "ListItem", position: 3, name: "Social Media Graphics", item: "https://screenshot-studio.com/features/social-media-graphics" },
    ],
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Screenshot Studio - Social Media Graphics Maker",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web Browser",
    description:
      "Free online tool to create professional social media graphics for Twitter, LinkedIn, and Instagram.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Twitter card generator",
      "LinkedIn post maker",
      "Instagram graphics",
      "Custom dimensions",
      "High-resolution export",
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <Navigation ctaLabel="Try Free" ctaHref="/" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Social Media Graphics Maker
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create stunning graphics for Twitter, LinkedIn, and Instagram in
              seconds. Transform screenshots into shareable content that drives
              engagement.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Create Graphics Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              No signup. No watermarks. Completely free.
            </p>
          </div>
        </section>

        {/* Platforms */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">
              Perfect Dimensions for Every Platform
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Create graphics optimized for each social platform with the right
              aspect ratios and resolutions.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {platforms.map((platform) => (
                <div
                  key={platform.name}
                  className="p-6 bg-background border rounded-xl hover:border-primary transition-colors"
                >
                  <platform.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-1">{platform.name}</h3>
                  <p className="text-sm text-primary mb-2">{platform.dimensions}</p>
                  <p className="text-sm text-muted-foreground">
                    {platform.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Creators Choose Screenshot Studio
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-2 h-2 mt-3 rounded-full bg-primary" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              What Can You Create?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-background border rounded-xl">
                <h3 className="font-semibold mb-2">Product Announcements</h3>
                <p className="text-sm text-muted-foreground">
                  Share new features with beautiful screenshots that get clicks.
                </p>
              </div>
              <div className="p-6 bg-background border rounded-xl">
                <h3 className="font-semibold mb-2">Tutorial Screenshots</h3>
                <p className="text-sm text-muted-foreground">
                  Create professional how-to content that builds authority.
                </p>
              </div>
              <div className="p-6 bg-background border rounded-xl">
                <h3 className="font-semibold mb-2">Code Snippets</h3>
                <p className="text-sm text-muted-foreground">
                  Share code with beautiful backgrounds that developers love.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Features */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Explore More Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/features/screenshot-beautifier"
                className="flex items-center justify-between p-4 bg-background border rounded-xl hover:border-primary transition-colors group"
              >
                <span className="font-medium text-sm">Screenshot Beautifier</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link
                href="/features/animation-maker"
                className="flex items-center justify-between p-4 bg-background border rounded-xl hover:border-primary transition-colors group"
              >
                <span className="font-medium text-sm">Animation Maker</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link
                href="/features/3d-effects"
                className="flex items-center justify-between p-4 bg-background border rounded-xl hover:border-primary transition-colors group"
              >
                <span className="font-medium text-sm">3D Effects</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Start Creating Social Media Graphics
            </h2>
            <p className="text-muted-foreground mb-8">
              No design experience required. Start creating in 30 seconds.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Try Free Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer brandName="Screenshot Studio" />
    </div>
  );
}
