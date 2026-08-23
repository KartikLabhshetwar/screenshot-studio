import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Screenshot Studio. What stays on your device, what is sent to our server, and which third parties are involved.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

const linkClassName =
  "text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground/60";

const INTER =
  "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navigation />

      <main className="mx-auto max-w-3xl flex-1 px-6 pb-16 pt-28 sm:pb-24">
        <h1
          className="mb-2 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl"
          style={{ fontFamily: INTER }}
        >
          Privacy Policy
        </h1>
        <p className="mb-12 text-sm text-muted-foreground">
          Last updated: August 23, 2026
        </p>

        <div className="max-w-none space-y-8">
          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Overview
            </h2>
            <p className="mb-3 leading-relaxed text-muted-foreground">
              Screenshot Studio is a browser-based image editor. There is no
              account, no signup, and no login, so we never ask you for a name,
              an email address, or payment details to use the editor.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Editing, compositing, and preview rendering happen on your device
              in the browser canvas. Three features do send data off your
              device: export compression, capturing a screenshot from a URL, and
              importing a tweet. Each one is described below. We do not sell
              your data.
            </p>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              What Stays On Your Device
            </h2>
            <p className="mb-3 leading-relaxed text-muted-foreground">
              Images you import from your device are read in the browser and are
              never uploaded to us for editing. The editor also stores your work
              in your own browser:
            </p>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Drafts:</strong> your
                in-progress canvas is autosaved to IndexedDB and deleted
                automatically after 7 days.
              </li>
              <li>
                <strong className="text-foreground">Images:</strong> imported
                images under 500KB are kept in local storage so a reload does
                not lose them. Larger images are held in memory only.
              </li>
              <li>
                <strong className="text-foreground">Preferences:</strong> aspect
                ratio, export settings, custom presets, theme, and recent
                exports.
              </li>
            </ul>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              None of this reaches our servers. Clearing site data in your
              browser removes all of it.
            </p>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              What Leaves Your Device
            </h2>
            <ul className="list-inside list-disc space-y-3 text-muted-foreground">
              <li>
                <strong className="text-foreground">Export compression:</strong>{" "}
                when you export, the rendered image is sent to our{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-[13px]">
                  /api/export
                </code>{" "}
                endpoint, recompressed in memory with Sharp, and returned to
                you. It is not written to disk, not stored, and not logged.
                Images above 4MB, and any failure or timeout, fall back to
                compression inside your browser.
              </li>
              <li>
                <strong className="text-foreground">
                  Capturing a screenshot from a URL:
                </strong>{" "}
                the address you enter is sent to{" "}
                <Link
                  href="https://microlink.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClassName}
                >
                  Microlink
                </Link>
                , which loads that page and captures it. The resulting image is
                cached in Cloudflare R2, and our database stores the normalized
                URL, a hash of it, the device and color-scheme options, and the
                storage key so repeat captures are fast. Only public web pages
                you explicitly submit are captured.
              </li>
              <li>
                <strong className="text-foreground">Importing a tweet:</strong>{" "}
                the numeric post id is sent to X&apos;s public syndication API to
                fetch the post content that gets rendered on your canvas.
              </li>
              <li>
                <strong className="text-foreground">Remote images:</strong>{" "}
                images referenced by URL are fetched through our image proxy,
                which is restricted to an allowlist of hosts.
              </li>
            </ul>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Analytics, Ads, and Third Parties
            </h2>
            <ul className="list-inside list-disc space-y-3 text-muted-foreground">
              <li>
                <strong className="text-foreground">Databuddy:</strong>{" "}
                cookieless product analytics. Records page views, web vitals,
                JavaScript errors, and clicks on outgoing links.
              </li>
              <li>
                <strong className="text-foreground">PostHog:</strong> product
                analytics for feature usage. It sets a first-party identifier so
                repeat visits are recognized.
              </li>
              <li>
                <strong className="text-foreground">Google AdSense:</strong> ads
                are served on this site. Google may set cookies and use them for
                ad delivery, measurement, and personalization under its own
                policies. You can control this at{" "}
                <Link
                  href="https://myadcenter.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClassName}
                >
                  My Ad Center
                </Link>
                .
              </li>
              <li>
                <strong className="text-foreground">
                  Hosting and network:
                </strong>{" "}
                the site runs on Vercel behind Cloudflare. Both keep standard
                request logs, which include IP addresses, for security and
                reliability.
              </li>
              <li>
                <strong className="text-foreground">Rate limiting:</strong> the
                screenshot API keeps your IP address in server memory for up to
                60 seconds to enforce its per-minute limit. It is not written to
                a database.
              </li>
            </ul>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              We do not run cross-site advertising pixels of our own, and we do
              not sell or share your data with data brokers.
            </p>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Cookies
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              We set one cookie ourselves,{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-[13px]">
                NEXT_LOCALE
              </code>
              , to remember your language choice. Additional cookies and
              identifiers may be set by PostHog and Google AdSense as described
              above.
            </p>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Your Choices
            </h2>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>
                Clear site data in your browser to remove every draft, image,
                and preference stored locally.
              </li>
              <li>
                Block cookies or use an ad or tracker blocker. The editor works
                without analytics and without ads.
              </li>
              <li>
                Skip URL capture and tweet import if you do not want those
                requests made. Importing images from your device never leaves
                the browser.
              </li>
              <li>
                Email us to have a cached screenshot of a page you control
                removed.
              </li>
            </ul>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Children
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Screenshot Studio is not directed at children under 13, and we do
              not knowingly collect information from them.
            </p>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Open Source
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Screenshot Studio is open source. Every claim on this page can be
              checked against the{" "}
              <Link
                href="https://github.com/opennookorg/screenshot-studio"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                source code on GitHub
              </Link>
              .
            </p>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Changes
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              We may update this policy from time to time. Changes will be
              reflected on this page with an updated date.
            </p>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              Contact
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              If you have questions about this policy, reach out via our{" "}
              <Link href="/contact" className={linkClassName}>
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer brandName="Screenshot Studio" />
    </div>
  );
}
