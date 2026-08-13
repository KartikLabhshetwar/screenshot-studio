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

const cardLinkClassName =
  "group rounded-2xl bg-card p-6 ring-1 ring-inset ring-border shadow-[var(--card-highlight-shadow)] transition-colors hover:bg-foreground/[0.04] hover:ring-ring/40";

const iconWrapClassName =
  "flex size-9 items-center justify-center rounded-xl bg-foreground/[0.06] text-foreground ring-1 ring-inset ring-border";

const linkClassName =
  "text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground/60";

const INTER =
  "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const contacts = [
  {
    href: "https://github.com/KartikLabhshetwar/stage/issues",
    external: true,
    icon: GithubIcon,
    title: "Report a Bug",
    description:
      "Found something broken? Open an issue on GitHub and we'll look into it.",
  },
  {
    href: "https://github.com/KartikLabhshetwar/stage/issues/new?labels=enhancement",
    external: true,
    icon: GithubIcon,
    title: "Request a Feature",
    description:
      "Have an idea to make Screenshot Studio better? We'd love to hear it.",
  },
  {
    href: "https://x.com/code_kartik",
    external: true,
    icon: NewTwitterIcon,
    title: "Twitter / X",
    description:
      "Follow for updates, tips, and behind-the-scenes. DMs are open.",
  },
  {
    href: "mailto:kartik.labhshetwar@gmail.com",
    external: false,
    icon: Mail01Icon,
    title: "Email",
    description:
      "For anything else, drop us an email and we'll get back to you.",
  },
] as const;

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navigation />

      <main className="mx-auto max-w-3xl flex-1 px-6 pb-16 pt-28 sm:pb-24">
        <h1
          className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl"
          style={{ fontFamily: INTER }}
        >
          Contact Us
        </h1>
        <p className="mb-12 text-lg text-muted-foreground">
          Have a question, found a bug, or want to suggest a feature? Here are
          the best ways to reach us.
        </p>

        <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {contacts.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              {...(item.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={cardLinkClassName}
            >
              <div className="mb-3 flex items-center gap-3">
                <div className={iconWrapClassName}>
                  <item.icon size={20} strokeWidth={1.75} />
                </div>
                <h2
                  className="font-semibold tracking-[-0.02em] text-foreground"
                  style={{ fontFamily: INTER }}
                >
                  {item.title}
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </Link>
          ))}
        </div>

        <section className="rounded-2xl bg-card p-6 ring-1 ring-inset ring-border shadow-[var(--card-highlight-shadow)]">
          <h2
            className="mb-2 text-lg font-semibold tracking-[-0.02em] text-foreground"
            style={{ fontFamily: INTER }}
          >
            Contributing
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Screenshot Studio is open source. If you&apos;re a developer and
            want to contribute, check out the{" "}
            <Link
              href="https://github.com/KartikLabhshetwar/stage"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
            >
              GitHub repository
            </Link>
            . Pull requests, bug reports, and feature suggestions are all
            welcome.
          </p>
        </section>
      </main>

      <Footer brandName="Screenshot Studio" />
    </div>
  );
}
