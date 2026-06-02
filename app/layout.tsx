import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Caveat,
  Inter,
  Poppins,
  Space_Grotesk,
  Outfit,
  Plus_Jakarta_Sans,
  DM_Sans,
  Playfair_Display,
  Lora,
  Libre_Baskerville,
  Bebas_Neue,
  Righteous,
  Pacifico,
  Dancing_Script,
  JetBrains_Mono,
  Fira_Code,
  Sora,
  Manrope,
  Raleway,
  Oswald,
  Montserrat,
  Lexend,
  Work_Sans,
  Urbanist,
  Albert_Sans,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/lib/query-client";
import { GlobalDropZone } from "@/components/GlobalDropZone";
import { getRootJsonLd } from "@/lib/seo/json-ld";
import { getLocale } from "next-intl/server";

// System UI fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Modern Sans-serif fonts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const albertSans = Albert_Sans({
  variable: "--font-albert-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// Display/Condensed fonts
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: ["400"],
});

const righteous = Righteous({
  variable: "--font-righteous",
  subsets: ["latin"],
  weight: ["400"],
});

// Serif fonts
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Handwriting/Script fonts
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: ["400"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Monospace fonts
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Combine all font variables
const fontVariables = [
  geistSans.variable,
  geistMono.variable,
  inter.variable,
  poppins.variable,
  spaceGrotesk.variable,
  outfit.variable,
  plusJakartaSans.variable,
  dmSans.variable,
  sora.variable,
  manrope.variable,
  raleway.variable,
  montserrat.variable,
  lexend.variable,
  workSans.variable,
  urbanist.variable,
  albertSans.variable,
  oswald.variable,
  bebasNeue.variable,
  righteous.variable,
  playfairDisplay.variable,
  lora.variable,
  libreBaskerville.variable,
  caveat.variable,
  pacifico.variable,
  dancingScript.variable,
  jetbrainsMono.variable,
  firaCode.variable,
].join(" ");

export const metadata: Metadata = {
  title: {
    default: "Screenshot Studio - Screenshot Beautifier & Mockup Maker",
    template: "%s | Screenshot Studio",
  },
  // Add your Google Search Console verification code here
  // Get it from: https://search.google.com/search-console
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
    // yandex: "your-yandex-verification",
    // bing: "your-bing-verification",
  },
  description: "Free screenshot editor and mockup tool — transform plain screenshots into professional graphics in seconds. 100+ gradient backgrounds, browser frames, shadows, animations, 3D effects, and video export. The best free alternative to Pika Style and Shots.so. No signup needed.",
  keywords: [
    // Primary keywords
    "screenshot editor online free",
    "free screenshot editor",
    "online screenshot editor",
    "screenshot beautifier",
    "screenshot editor",
    "screenshot studio",
    "free image editor",
    "online image editor",
    // Competitor & alternative keywords
    "pika style alternative",
    "shots.so alternative",
    "screenshot mockup tool",
    "browser mockup generator",
    "window mockup generator",
    "screenshot wrapper",
    // Feature keywords
    "social media graphics maker",
    "image background editor",
    "screenshot animation maker",
    "browser frame screenshot",
    "screenshot with gradient background",
    "mac window screenshot mockup",
    // Use case keywords
    "product screenshot tool",
    "SaaS screenshot maker",
    "app screenshot maker",
    "developer portfolio images",
    "Twitter card generator",
    "Instagram post creator",
    "LinkedIn banner maker",
    // Long-tail keywords
    "free design tool no signup",
    "beautify screenshots online",
    "add background to screenshot",
    "screenshot to video converter",
    "screenshot padding and shadow tool",
    "screenshot border radius editor",
    "free online screenshot beautifier",
    "image presentation maker",
  ],
  authors: [{ name: "Screenshot Studio", url: "https://screenshot-studio.com" }],
  creator: "Screenshot Studio",
  publisher: "Screenshot Studio",
  metadataBase: new URL(process.env.BETTER_AUTH_URL || "https://screenshot-studio.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Screenshot Studio",
    title: "Screenshot Studio - Free Screenshot Editor Online",
    description: "Free screenshot editor online — create stunning social media graphics in seconds. 100+ backgrounds, animations, 3D effects, video export. No signup required.",
    images: [
      {
        url: "https://screenshot-studio.com/og.jpg",
        width: 1200,
        height: 630,
        alt: "Screenshot Studio - Transform Screenshots into Professional Graphics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Screenshot Studio - Free Screenshot Editor Online",
    description: "Free screenshot editor online — transform screenshots into stunning graphics. Animations, 3D effects, video export. No signup.",
    images: ["https://screenshot-studio.com/og.jpg"],
    creator: "@code_kartik",
    site: "@code_kartik",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  category: "Design Tools",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rootJsonLd = getRootJsonLd();
  const locale = await getLocale();

  return (
    <html lang={locale} className="dark">
      <head>
        <meta name="msvalidate.01" content="A3B8CB50BBD78710971A13FA3EE1E544" />
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLMs.txt" />
        <link rel="alternate" type="text/markdown" href="/llms-full.txt" title="LLMs Full Documentation" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8704843786311642"
          crossOrigin="anonymous"
        />        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootJsonLd) }}
        />
      </head>
      <body
        className={`${fontVariables} antialiased`}
      >
        <QueryProvider>
          <GlobalDropZone>
            {children}
          </GlobalDropZone>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
