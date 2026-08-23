import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and Conditions for using Screenshot Studio, the free, open-source screenshot beautifier.",
  alternates: {
    canonical: "/terms",
  },
};

const linkClassName =
  "text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground/60";

const INTER =
  "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navigation />

      <main className="mx-auto max-w-3xl flex-1 px-6 pb-16 pt-28 sm:pb-24">
        <h1
          className="mb-2 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl"
          style={{ fontFamily: INTER }}
        >
          Terms & Conditions
        </h1>
        <p className="mb-12 text-sm text-muted-foreground">
          Last updated: June 2, 2026
        </p>

        <div className="space-y-8">
          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              By accessing and using Screenshot Studio (&quot;the Service&quot;),
              you agree to be bound by these Terms and Conditions. If you do not
              agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              2. Description of Service
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Screenshot Studio is a free, browser-based screenshot editing tool
              that allows users to beautify screenshots with backgrounds,
              frames, effects, and more. Editing happens in your browser, and images
              you import are not uploaded to edit them. Exporting sends the
              finished image to our compression endpoint, which returns it
              without storing it, and capturing a screenshot from a URL sends
              that address to a third-party capture service. Our{" "}
              <Link href="/privacy-policy" className={linkClassName}>
                privacy policy
              </Link>{" "}
              describes both in full.
            </p>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              3. Use of Service
            </h2>
            <p className="mb-3 leading-relaxed text-muted-foreground">
              You agree to use the Service only for lawful purposes. You may
              not:
            </p>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>Use the Service to create or distribute harmful content</li>
              <li>
                Attempt to interfere with the Service&apos;s operation or
                security
              </li>
              <li>
                Reverse-engineer the Service beyond what the open-source license
                permits
              </li>
              <li>
                Use the Service in any way that violates applicable laws or
                regulations
              </li>
            </ul>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              4. Intellectual Property
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              The images you create with Screenshot Studio belong to you. We
              claim no ownership or rights over content you produce using the
              tool. The Screenshot Studio software itself is open source and
              licensed under the terms specified in our{" "}
              <Link
                href="https://github.com/KartikLabhshetwar/screenshot-studio"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                GitHub repository
              </Link>
              .
            </p>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              5. Disclaimer of Warranties
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              The Service is provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind, either express or
              implied. We do not guarantee that the Service will be
              uninterrupted, error-free, or free of harmful components.
            </p>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              6. Limitation of Liability
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              In no event shall Screenshot Studio or its creator be liable for
              any indirect, incidental, special, consequential, or punitive
              damages arising out of or related to your use of the Service.
            </p>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              7. Changes to Terms
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              We reserve the right to modify these terms at any time. Changes
              will be posted on this page with an updated date. Continued use of
              the Service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2
              className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground"
              style={{ fontFamily: INTER }}
            >
              8. Contact
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              For questions about these terms, please visit our{" "}
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
