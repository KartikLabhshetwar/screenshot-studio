import { BASE_URL } from "@/lib/agents/site-content";

const errorResponse = (description: string) => ({
  description,
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/Error" },
    },
  },
});

export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Screenshot Studio API",
    version: "1.0.0",
    summary: "Public HTTP API for Screenshot Studio.",
    description:
      "Screenshot Studio is a free, open-source, browser-based screenshot editor. This API exposes the server-side operations the editor uses: capturing a live web page as an image, recompressing an exported image, resolving a tweet for tweet-to-image rendering, and proxying Twitter media. No API key or account is required; requests are anonymous and shaped by per-IP rate limits. Every error response uses the same JSON envelope with a stable `code` and a human-readable `hint`.",
    contact: {
      name: "Screenshot Studio",
      url: `${BASE_URL}/contact`,
      email: "kartik.labhshetwar@gmail.com",
    },
    license: {
      name: "Apache-2.0",
      url: "https://www.apache.org/licenses/LICENSE-2.0",
    },
    termsOfService: `${BASE_URL}/terms`,
  },
  servers: [{ url: BASE_URL, description: "Production" }],
  externalDocs: {
    description: "Screenshot Studio API documentation",
    url: `${BASE_URL}/docs`,
  },
  security: [],
  tags: [
    {
      name: "Screenshots",
      description: "Capture live web pages as images.",
    },
    { name: "Images", description: "Optimize and proxy image bytes." },
    { name: "Social", description: "Resolve social media content." },
    {
      name: "Discovery",
      description: "Machine-readable descriptions of the site and this API.",
    },
  ],
  paths: {
    "/api/screenshot": {
      post: {
        operationId: "captureScreenshot",
        summary: "Capture a web page screenshot",
        description:
          "Renders the page at the given URL and returns the screenshot as a base64-encoded PNG. Results are cached per URL, device type, and color scheme; set `forceRefresh` to bypass the cache. Limited to 20 requests per minute per IP address.",
        tags: ["Screenshots"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ScreenshotRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Screenshot captured or served from cache.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ScreenshotResponse" },
              },
            },
          },
          "400": errorResponse("The URL or an option value is invalid."),
          "405": errorResponse("Method not allowed."),
          "408": errorResponse("The target page took too long to load."),
          "429": {
            description: "Per-IP rate limit exceeded.",
            headers: {
              "Retry-After": {
                description: "Seconds to wait before retrying.",
                schema: { type: "integer" },
              },
              "X-RateLimit-Limit": {
                description: "Requests allowed per window.",
                schema: { type: "integer" },
              },
              "X-RateLimit-Remaining": {
                description: "Requests remaining in the current window.",
                schema: { type: "integer" },
              },
              "X-RateLimit-Reset": {
                description: "Unix epoch milliseconds when the window resets.",
                schema: { type: "integer" },
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RateLimitError" },
              },
            },
          },
          "500": errorResponse("The screenshot could not be produced."),
          "503": errorResponse("The upstream screenshot service is down."),
        },
      },
      get: {
        operationId: "captureScreenshotMethodProbe",
        summary: "Method probe for the screenshot endpoint",
        description:
          "The screenshot endpoint only accepts POST. GET returns a 405 with the same JSON error envelope and an `Allow` header.",
        tags: ["Screenshots"],
        responses: { "405": errorResponse("Method not allowed.") },
      },
    },
    "/api/export": {
      post: {
        operationId: "optimizeExportImage",
        summary: "Recompress an image",
        description:
          "Accepts a raw image as multipart form data and returns an optimized image in the requested format. JPEG uses the MozJPEG encoder, WebP uses libwebp, and PNG uses adaptive filtering. The response body is the image bytes, not JSON.",
        tags: ["Images"],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/ExportRequest" },
              encoding: { image: { contentType: "image/png, image/jpeg, image/webp" } },
            },
          },
        },
        responses: {
          "200": {
            description: "Optimized image bytes.",
            content: {
              "image/png": { schema: { type: "string", format: "binary" } },
              "image/jpeg": { schema: { type: "string", format: "binary" } },
              "image/webp": { schema: { type: "string", format: "binary" } },
            },
          },
          "400": errorResponse("Missing image, or invalid format/quality preset."),
          "405": errorResponse("Method not allowed."),
          "500": errorResponse("The image could not be processed."),
        },
      },
      get: {
        operationId: "optimizeExportImageMethodProbe",
        summary: "Method probe for the export endpoint",
        description:
          "The export endpoint only accepts POST. GET returns a 405 with the same JSON error envelope and an `Allow` header.",
        tags: ["Images"],
        responses: { "405": errorResponse("Method not allowed.") },
      },
    },
    "/api/tweet/{id}": {
      get: {
        operationId: "getTweet",
        summary: "Fetch a tweet by ID",
        description:
          "Returns the public tweet payload used to render a tweet as an image. The `id` is the numeric status ID from the tweet URL.",
        tags: ["Social"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Numeric tweet status ID, for example 1234567890123456789.",
            schema: { type: "string", pattern: "^[0-9]+$" },
          },
        ],
        responses: {
          "200": {
            description: "Tweet payload.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TweetResponse" },
              },
            },
          },
          "404": errorResponse("No tweet exists with that ID."),
          "500": errorResponse("The tweet could not be fetched."),
        },
      },
    },
    "/api/image-proxy": {
      get: {
        operationId: "proxyTwitterImage",
        summary: "Proxy a Twitter media file",
        description:
          "Streams a Twitter-hosted image through this origin so it can be drawn onto a canvas without tainting it. Only pbs.twimg.com, abs.twimg.com, ton.twitter.com, and video.twimg.com are allowed.",
        tags: ["Images"],
        parameters: [
          {
            name: "url",
            in: "query",
            required: true,
            description: "Absolute URL of the Twitter-hosted media file.",
            schema: { type: "string", format: "uri" },
          },
        ],
        responses: {
          "200": {
            description: "Image bytes.",
            content: {
              "image/*": { schema: { type: "string", format: "binary" } },
            },
          },
          "400": errorResponse("The `url` query parameter is missing."),
          "403": errorResponse("The host is not on the allowlist."),
          "502": errorResponse("The upstream host refused the request."),
          "500": errorResponse("The image could not be fetched."),
        },
      },
    },
    "/openapi.json": {
      get: {
        operationId: "getOpenApiSpec",
        summary: "Fetch this OpenAPI specification",
        description:
          "Returns the OpenAPI 3.1 document describing every public Screenshot Studio operation.",
        tags: ["Discovery"],
        responses: {
          "200": {
            description: "OpenAPI 3.1 document.",
            content: {
              "application/json": { schema: { type: "object" } },
            },
          },
        },
      },
    },
    "/llms.txt": {
      get: {
        operationId: "getLlmsTxt",
        summary: "Fetch the llms.txt site overview",
        description:
          "Returns a Markdown overview of Screenshot Studio: features, pages, pricing, and contact details.",
        tags: ["Discovery"],
        responses: {
          "200": {
            description: "Markdown overview.",
            content: {
              "text/markdown": { schema: { type: "string" } },
            },
          },
        },
      },
    },
    "/llms-full.txt": {
      get: {
        operationId: "getLlmsFullTxt",
        summary: "Fetch the full llms.txt reference",
        description:
          "Returns the complete Markdown reference: every feature, every page, the technology stack, and the privacy model.",
        tags: ["Discovery"],
        responses: {
          "200": {
            description: "Markdown reference.",
            content: {
              "text/markdown": { schema: { type: "string" } },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Error: {
        type: "object",
        description:
          "Every failing request returns this envelope. `code` is stable and safe to branch on; `error` and `message` carry the same human-readable text.",
        required: ["error", "code", "message", "hint", "status", "documentation"],
        properties: {
          error: {
            type: "string",
            description: "Human-readable error message.",
            examples: ["URL is required"],
          },
          code: {
            type: "string",
            description: "Stable machine-readable error code.",
            enum: [
              "invalid_request",
              "invalid_url",
              "unsupported_value",
              "unauthorized",
              "forbidden_domain",
              "not_found",
              "method_not_allowed",
              "rate_limited",
              "upstream_timeout",
              "upstream_unavailable",
              "upstream_failed",
              "internal_error",
            ],
          },
          message: {
            type: "string",
            description: "Human-readable error message, same value as `error`.",
          },
          hint: {
            type: "string",
            description: "How to resolve the error.",
          },
          status: {
            type: "integer",
            description: "HTTP status code, repeated in the body.",
          },
          documentation: {
            type: "string",
            format: "uri",
            description: "Link to the error reference.",
          },
        },
      },
      RateLimitError: {
        allOf: [
          { $ref: "#/components/schemas/Error" },
          {
            type: "object",
            properties: {
              retryAfter: {
                type: "integer",
                description: "Seconds to wait before retrying.",
              },
            },
          },
        ],
      },
      ScreenshotRequest: {
        type: "object",
        required: ["url"],
        properties: {
          url: {
            type: "string",
            format: "uri",
            description: "Absolute http or https URL of the page to capture.",
            examples: ["https://example.com"],
          },
          deviceType: {
            type: "string",
            enum: ["desktop", "mobile"],
            default: "desktop",
            description:
              "Viewport preset. `desktop` is 1920x1080, `mobile` is 375x667.",
          },
          colorScheme: {
            type: "string",
            enum: ["light", "dark"],
            default: "light",
            description: "prefers-color-scheme sent to the target page.",
          },
          forceRefresh: {
            type: "boolean",
            default: false,
            description: "Bypass and replace the cached capture for this URL.",
          },
        },
      },
      ScreenshotResponse: {
        type: "object",
        required: ["screenshot", "url", "cached"],
        properties: {
          screenshot: {
            type: "string",
            contentEncoding: "base64",
            description: "Base64-encoded PNG bytes, without a data URI prefix.",
          },
          url: {
            type: "string",
            format: "uri",
            description: "Normalized URL that was captured.",
          },
          cached: {
            type: "boolean",
            description: "True when the image was served from cache.",
          },
          strategy: {
            type: "string",
            description: "Capture backend that produced the image.",
          },
          deviceType: { type: "string", enum: ["desktop", "mobile"] },
          colorScheme: { type: "string", enum: ["light", "dark"] },
        },
      },
      ExportRequest: {
        type: "object",
        required: ["image", "format", "qualityPreset"],
        properties: {
          image: {
            type: "string",
            format: "binary",
            description: "The raw image file to recompress.",
          },
          format: {
            type: "string",
            enum: ["png", "jpeg", "webp"],
            description: "Output image format.",
          },
          qualityPreset: {
            type: "string",
            enum: ["high", "medium", "low"],
            description: "Compression preset applied to the chosen format.",
          },
        },
      },
      TweetResponse: {
        type: "object",
        required: ["data"],
        properties: {
          data: {
            type: ["object", "null"],
            description:
              "Tweet payload as returned by the public syndication API, or null when the tweet is unavailable.",
          },
          error: {
            type: "string",
            description: "Present only when `data` is null.",
          },
        },
      },
    },
  },
} as const;
