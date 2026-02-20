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
    default: "Screenshot Studio - Free Online Image Editor | Create Stunning Graphics in Seconds",
    template: "%s | Screenshot Studio",
  },
  // Add your Google Search Console verification code here
  // Get it from: https://search.google.com/search-console
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
    // yandex: "your-yandex-verification",
    // bing: "your-bing-verification",
  },
  description: "Transform screenshots into professional social media graphics instantly. Free browser-based editor with 100+ backgrounds, animations, 3D effects, and video export. No signup needed.",
  keywords: [
    // Primary keywords
    "free image editor",
    "online image editor",
    "screenshot beautifier",
    "screenshot editor",
    "screenshot studio",
    // Feature keywords
    "social media graphics maker",
    "image background editor",
    "screenshot animation maker",
    "browser image editor",
    "canvas editor online",
    // Use case keywords
    "product screenshot tool",
    "SaaS screenshot maker",
    "developer portfolio images",
    "Twitter card generator",
    "Instagram post creator",
    "LinkedIn banner maker",
    // Long-tail keywords
    "free design tool no signup",
    "beautify screenshots online",
    "add background to screenshot",
    "screenshot to video converter",
    "animated slideshow maker",
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
    title: "Screenshot Studio - Free Screenshot Beautifier & Image Editor",
    description: "Create stunning social media graphics in seconds. 100+ backgrounds, animations, 3D effects, video export. 100% free, no signup required.",
    images: [
      {
        url: "https://screenshot-studio.com/og.png",
        width: 1200,
        height: 630,
        alt: "Screenshot Studio - Transform Screenshots into Professional Graphics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Screenshot Studio - Free Screenshot Beautifier",
    description: "Transform screenshots into stunning graphics. Animations, 3D effects, video export. Free, no signup.",
    images: ["https://screenshot-studio.com/og.png"],
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
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  manifest: "/manifest.json",
  category: "Design Tools",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
      <script defer src="https://cloud.umami.is/script.js" data-website-id="11f36f2b-1ef5-4014-bfdb-089aa4770c53"></script>
      </head>
      <body
        className={`${fontVariables} antialiased`}
      >
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
