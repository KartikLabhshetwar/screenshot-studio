import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { GithubIcon, NewTwitterIcon, Mail01Icon } from "hugeicons-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Screenshot Studio team. Report bugs, suggest features, or just say hi.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation ctaLabel="Open Editor" ctaHref="/" />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Contact Us
        </h1>
        <p className="text-muted-foreground text-lg mb-12">
          Have a question, found a bug, or want to suggest a feature? Here are
          the best ways to reach us.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          <Link
            href="https://github.com/KartikLabhshetwar/stage/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-muted">
                <GithubIcon className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-foreground">Report a Bug</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Found something broken? Open an issue on GitHub and we&apos;ll
              look into it.
            </p>
          </Link>

          <Link
            href="https://github.com/KartikLabhshetwar/stage/issues/new?labels=enhancement"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-muted">
                <GithubIcon className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-foreground">
                Request a Feature
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Have an idea to make Screenshot Studio better? We&apos;d love to
              hear it.
            </p>
          </Link>

          <Link
            href="https://x.com/code_kartik"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-muted">
                <NewTwitterIcon className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-foreground">Twitter / X</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Follow for updates, tips, and behind-the-scenes. DMs are open.
            </p>
          </Link>

          <Link
            href="mailto:kartik.labhshetwar@gmail.com"
            className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-muted">
                <Mail01Icon className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-foreground">Email</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For anything else, drop us an email and we&apos;ll get back to
              you.
            </p>
          </Link>
        </div>

        <section className="p-6 rounded-xl bg-muted/30 border border-border">
          <h2 className="text-lg font-semibold mb-2">Contributing</h2>
          <p className="text-muted-foreground leading-relaxed">
            Screenshot Studio is open source. If you&apos;re a developer and
            want to contribute, check out the{" "}
            <Link
              href="https://github.com/KartikLabhshetwar/stage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub repository
            </Link>
            . Pull requests, bug reports, and feature suggestions are all
            welcome.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
