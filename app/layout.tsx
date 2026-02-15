import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/lib/query-client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Screenshot Studio - Free Online Image Editor | Create Stunning Graphics in Seconds",
    template: "%s | Screenshot Studio",
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
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
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
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} antialiased`}
      >
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
