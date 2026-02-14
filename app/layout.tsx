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
    default: "Stage - Free Online Image Editor | Create Professional Graphics in Seconds",
    template: "%s | Stage",
  },
  description: "Turn screenshots into stunning social media graphics in seconds. Free browser-based canvas editor with beautiful backgrounds, text overlays, and one-click export. No signup required.",
  keywords: [
    "free image editor",
    "online image editor",
    "screenshot beautifier",
    "social media graphics",
    "canvas editor",
    "image showcase tool",
    "browser image editor",
    "no signup image editor",
    "free design tool",
    "Instagram image creator",
    "Twitter card generator",
    "product screenshot editor",
    "SaaS screenshot tool",
    "developer portfolio images",
  ],
  authors: [{ name: "Stage", url: "https://stagee.art" }],
  creator: "Stage",
  publisher: "Stage",
  metadataBase: new URL(process.env.BETTER_AUTH_URL || "https://stagee.art"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Stage",
    title: "Stage - Turn Screenshots into Stunning Graphics (Free)",
    description: "Create professional social media images in seconds. Beautiful backgrounds, text overlays, and export up to 5x resolution. 100% free, no signup.",
    images: [
      {
        url: "https://stagee.art/og.jpeg",
        width: 1200,
        height: 630,
        alt: "Stage - Free Online Image Editor for Stunning Graphics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stage - Turn Screenshots into Stunning Graphics",
    description: "Create professional social media images in seconds. Free, no signup required.",
    images: ["https://stagee.art/og.jpeg"],
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
  verification: {
    google: "your-google-verification-code",
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
