"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body
        style={{
          margin: 0,
          backgroundColor: "#1e1e1e",
          color: "#e0e0e0",
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "30%",
                left: "30%",
                width: "18rem",
                height: "18rem",
                borderRadius: "50%",
                background: "rgba(255, 69, 58, 0.05)",
                filter: "blur(48px)",
              }}
            />
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 10,
              maxWidth: "32rem",
              width: "100%",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "12rem",
                height: "8rem",
                margin: "0 auto 2rem",
                borderRadius: "0.75rem",
                border: "2px dashed rgba(255, 69, 58, 0.3)",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                style={{ color: "rgba(255, 69, 58, 0.4)" }}
              >
                <path
                  d="M12 9v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p
              style={{
                fontSize: "6rem",
                fontWeight: 700,
                letterSpacing: "-0.05em",
                lineHeight: 1,
                margin: "0 0 0.75rem",
              }}
            >
              5<span style={{ color: "#ff453a" }}>0</span>0
            </p>

            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: 500,
                margin: "0 0 0.75rem",
              }}
            >
              Something went wrong
            </h1>

            <p
              style={{
                color: "#a0a0a0",
                fontSize: "0.875rem",
                maxWidth: "24rem",
                margin: "0 auto 2rem",
                lineHeight: 1.6,
              }}
            >
              A critical error occurred. Please try again or refresh the page.
            </p>

            {error.digest && (
              <p
                style={{
                  color: "rgba(160, 160, 160, 0.6)",
                  fontSize: "0.75rem",
                  fontFamily: "'Fira Code', monospace",
                  marginBottom: "1.5rem",
                }}
              >
                Error ID: {error.digest}
              </p>
            )}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "0.75rem",
              }}
            >
              <button
                onClick={() => reset()}
                style={{
                  padding: "0.625rem 1.5rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "#34d399",
                  color: "#052e16",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Try Again
              </button>
              <a
                href="/"
                style={{
                  padding: "0.625rem 1.5rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #3c3c3c",
                  color: "#e0e0e0",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                }}
              >
                Open Editor
              </a>
              <a
                href="/landing"
                style={{
                  padding: "0.625rem 1.5rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #3c3c3c",
                  color: "#e0e0e0",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                }}
              >
                Homepage
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
