/**
 * The image tools registry: one definition per landing page.
 *
 * This is the single source of truth behind the tool routes, the /tools hub,
 * the sitemap, and the agent-readable site content. Adding a tool page means
 * adding an entry here plus a four-line route file that renders <ToolPage>.
 *
 * Several entries share an engine on purpose: /png-to-jpg and /jpg-to-png run
 * the same converter with a different preset, but each targets its own query
 * and gets its own copy, FAQs, and structured data.
 */

import type { RasterFormat } from "@/lib/image-tools/types";

export type ToolEngine = "compress" | "convert" | "resize" | "crop" | "rotate";

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolPreset {
  /** Converter pages preselect the output format. */
  targetFormat?: RasterFormat;
  /** Copy shown on the dropzone, e.g. "PNG" for /png-to-jpg. */
  sourceLabel?: string;
}

export interface ToolDefinition {
  /** Route path, without a locale prefix. */
  slug: string;
  engine: ToolEngine;
  preset?: ToolPreset;
  /** Short label for the hub grid and related-tool links. */
  name: string;
  h1: string;
  /** <title>. Kept under ~60 characters where possible. */
  title: string;
  /** Meta description. Kept under ~155 characters. */
  description: string;
  keywords: string[];
  /** Paragraph under the H1. */
  intro: string;
  /** Bullets for the SoftwareApplication featureList and the "how it works" list. */
  features: string[];
  faqs: ToolFaq[];
  /** Slugs of related tools, for internal linking. */
  related: string[];
  /** Primary tools lead the hub grid and carry higher sitemap priority. */
  primary: boolean;
}

/** FAQ answers every tool repeats, phrased once so the claims stay consistent. */
const PRIVACY_FAQ: ToolFaq = {
  question: "Are my images uploaded to a server?",
  answer:
    "No. Every tool on this page runs entirely in your browser using the Canvas and Web Worker APIs. Your files are read from disk, processed in the tab, and written straight back to your downloads folder. Nothing is uploaded, stored, or logged, which also means the tool keeps working if you go offline after the page loads.",
};

const FREE_FAQ: ToolFaq = {
  question: "Is it free, and is there a watermark?",
  answer:
    "It is completely free with no signup, no account, no daily limit, and no watermark. Screenshot Studio is open source under the Apache 2.0 licence.",
};

const BATCH_FAQ: ToolFaq = {
  question: "Can I process several images at once?",
  answer:
    "Yes. Drop in as many images as you like and they are processed one after another in the background. A single image downloads directly; multiple images are bundled into one zip file.",
};

export const TOOLS: ToolDefinition[] = [
  {
    slug: "/compress-image",
    engine: "compress",
    name: "Compress Image",
    h1: "Compress Image",
    title: "Compress Image Online: Free, Private, No Upload",
    description:
      "Shrink JPG, PNG, and WebP files in your browser. Batch compression with a live size preview. Free, no signup, no watermark, no upload.",
    keywords: [
      "compress image",
      "compress image online",
      "image compressor",
      "reduce image file size",
      "compress jpeg",
      "compress png",
      "compress webp",
      "shrink image size",
      "image compressor free",
      "batch image compression",
      "compress image without losing quality",
      "iloveimg alternative",
    ],
    intro:
      "Make image files smaller without sending them anywhere. Pick a compression level, see exactly how many kilobytes each file saves, and download the results one by one or as a zip.",
    features: [
      "Four compression levels from light to extreme",
      "Live before and after file size for every image",
      "Batch compression with a single zip download",
      "Optional format switch to WebP for the biggest savings",
      "Runs fully in the browser, no upload",
    ],
    faqs: [
      {
        question: "How much smaller will my images get?",
        answer:
          "It depends on the source. A screenshot saved as PNG often drops 60-80% when compressed to WebP or JPG, while a photo that is already a JPG typically saves 30-60% at the medium level. Each file shows its exact saving after processing, so you can try a level and adjust.",
      },
      {
        question: "Does compressing lose quality?",
        answer:
          "JPG and WebP are lossy formats, so higher compression does discard detail. The Low level is visually lossless for most images and still saves meaningful space. PNG is lossless, so compressing to PNG only re-encodes the file; to make a PNG substantially smaller, convert it to WebP.",
      },
      BATCH_FAQ,
      PRIVACY_FAQ,
      FREE_FAQ,
    ],
    related: ["/convert-image", "/resize-image", "/png-to-webp"],
    primary: true,
  },
  {
    slug: "/convert-image",
    engine: "convert",
    name: "Convert Image",
    h1: "Convert Image Format",
    title: "Convert Image Format Online: PNG, JPG, WebP",
    description:
      "Convert between PNG, JPG, and WebP in your browser. Batch conversion, quality control, no upload. Free, no signup, no watermark.",
    keywords: [
      "convert image",
      "image converter",
      "convert image format",
      "png to jpg",
      "jpg to png",
      "convert to webp",
      "image format converter online",
      "free image converter",
      "batch image converter",
      "convert image without uploading",
    ],
    intro:
      "Change an image's format without installing anything. Choose PNG, JPG, or WebP, set the quality, and convert a whole folder at once.",
    features: [
      "PNG, JPG, and WebP in every direction",
      "Quality slider for the lossy formats",
      "Choose the background colour behind transparency",
      "Batch conversion with a single zip download",
      "Runs fully in the browser, no upload",
    ],
    faqs: [
      {
        question: "Which formats are supported?",
        answer:
          "You can read PNG, JPG, WebP, GIF, BMP, and AVIF, and write PNG, JPG, and WebP. WebP writing depends on your browser and is hidden automatically if it is unavailable. AVIF output is not offered because no current browser can encode AVIF from a canvas.",
      },
      {
        question: "What happens to transparency when I convert to JPG?",
        answer:
          "JPG has no alpha channel, so transparent areas have to be filled with a solid colour. The tool paints white behind the image by default and lets you pick a different colour before converting.",
      },
      {
        question: "Which format should I choose?",
        answer:
          "WebP for the web, where it is typically 25-35% smaller than JPG at the same quality. JPG for maximum compatibility with older software. PNG when you need transparency or a pixel-exact lossless copy, such as a UI screenshot.",
      },
      BATCH_FAQ,
      PRIVACY_FAQ,
    ],
    related: ["/png-to-jpg", "/png-to-webp", "/compress-image"],
    primary: true,
  },
  {
    slug: "/resize-image",
    engine: "resize",
    name: "Resize Image",
    h1: "Resize Image",
    title: "Resize Image Online: Exact Pixels or Percentage",
    description:
      "Resize images by pixel size or percentage with the aspect ratio locked. Batch resize in your browser. Free, no signup, no upload.",
    keywords: [
      "resize image",
      "resize image online",
      "image resizer",
      "change image dimensions",
      "resize photo",
      "bulk image resizer",
      "resize image by percentage",
      "resize image in pixels",
      "scale image online",
      "free image resizer",
    ],
    intro:
      "Set an exact width and height, or scale by a percentage, and resize one image or a hundred. The aspect ratio stays locked unless you unlock it, and images are downscaled in steps so text stays sharp.",
    features: [
      "Resize by exact pixels or by percentage",
      "Aspect ratio lock with automatic second axis",
      "Optional upscaling, off by default",
      "Stepped downscaling that keeps screenshot text legible",
      "Batch resize with a single zip download",
    ],
    faqs: [
      {
        question: "Will resizing make my image blurry?",
        answer:
          "Downscaling is done in successive halving steps rather than one large jump, which preserves far more detail than a single resize. The difference is obvious on screenshots containing small text. Upscaling cannot invent detail, so it is switched off by default; enable it only when you need to hit a specific pixel size.",
      },
      {
        question: "How do I keep the aspect ratio?",
        answer:
          "The lock is on by default: type one dimension and the other is calculated for you. Unlock it if you deliberately want to stretch an image to exact dimensions.",
      },
      {
        question: "Can I resize images to the same size in bulk?",
        answer:
          "Yes. Drop in a batch, set one target width, and every image is resized to that width with its own height derived from its aspect ratio. Percentage mode scales each image relative to its own size instead.",
      },
      PRIVACY_FAQ,
      FREE_FAQ,
    ],
    related: ["/crop-image", "/compress-image", "/convert-image"],
    primary: true,
  },
  {
    slug: "/crop-image",
    engine: "crop",
    name: "Crop Image",
    h1: "Crop Image",
    title: "Crop Image Online: Free Cropper With Ratio Presets",
    description:
      "Crop an image by dragging a selection or typing exact pixels. Social media ratio presets included. Free, in your browser, no upload.",
    keywords: [
      "crop image",
      "crop image online",
      "image cropper",
      "crop photo",
      "crop picture online",
      "crop image to square",
      "crop image to 16:9",
      "free image cropper",
      "crop screenshot",
      "crop image without uploading",
    ],
    intro:
      "Drag a selection over your image or type exact pixel values. Ratio presets cover square, 16:9, 4:3, and the common social sizes, and the crop is applied at full source resolution.",
    features: [
      "Drag to select, or enter exact pixel coordinates",
      "Ratio presets: free, square, 16:9, 4:3, 3:2, 9:16",
      "Cropped at full source resolution, not preview resolution",
      "Live output dimensions as you drag",
      "Runs fully in the browser, no upload",
    ],
    faqs: [
      {
        question: "Does cropping reduce the resolution?",
        answer:
          "Only by the amount you crop away. The selection is mapped back onto the original pixels, so cropping the middle 50% of a 4000px-wide image gives you a 2000px-wide result at full quality, not a scaled-down preview.",
      },
      {
        question: "Can I crop to a specific aspect ratio?",
        answer:
          "Yes. Pick a ratio preset and the selection is constrained to it while you drag. Choose Free to crop to any shape.",
      },
      {
        question: "Can I crop several images at once?",
        answer:
          "Cropping is per-image, because the right selection depends on what is in each picture. To apply identical dimensions across a batch, use the resize tool instead.",
      },
      PRIVACY_FAQ,
      FREE_FAQ,
    ],
    related: ["/resize-image", "/rotate-image", "/compress-image"],
    primary: true,
  },
  {
    slug: "/rotate-image",
    engine: "rotate",
    name: "Rotate Image",
    h1: "Rotate and Flip Image",
    title: "Rotate Image Online: Turn and Flip, Free",
    description:
      "Rotate images 90, 180, or 270 degrees and flip them horizontally or vertically. Batch rotate in your browser. Free, no upload.",
    keywords: [
      "rotate image",
      "rotate image online",
      "flip image",
      "rotate photo",
      "mirror image online",
      "rotate image 90 degrees",
      "flip image horizontally",
      "batch rotate images",
      "free image rotator",
      "turn image sideways",
    ],
    intro:
      "Turn an image in quarter steps and mirror it on either axis. Rotation is lossless in shape: the pixels are re-drawn at full size, and a batch can be corrected in one pass.",
    features: [
      "Rotate 90, 180, or 270 degrees",
      "Flip horizontally or vertically",
      "Live preview before you commit",
      "Batch rotate with a single zip download",
      "Runs fully in the browser, no upload",
    ],
    faqs: [
      {
        question: "Why is my photo sideways in the first place?",
        answer:
          "Phone cameras usually store the picture in one orientation and record the intended rotation in an EXIF tag. Software that ignores the tag shows it sideways. This tool reads the EXIF orientation on load, so what you see is already upright, and any rotation you add is baked into the output pixels.",
      },
      {
        question: "What is the difference between rotating and flipping?",
        answer:
          "Rotating turns the image around its centre. Flipping mirrors it, so text becomes reversed. Flips are applied first and the rotation second, matching what you see in the preview.",
      },
      BATCH_FAQ,
      PRIVACY_FAQ,
      FREE_FAQ,
    ],
    related: ["/crop-image", "/resize-image", "/convert-image"],
    primary: true,
  },
];

/** Converter landing pages: one engine, one preset, one keyword each. */
const CONVERSION_PAGES: {
  slug: string;
  from: string;
  to: RasterFormat;
  toLabel: string;
  why: string;
  keywords: string[];
}[] = [
  {
    slug: "/png-to-jpg",
    from: "PNG",
    to: "jpeg",
    toLabel: "JPG",
    why: "JPG files are far smaller than PNG for photographs and are accepted everywhere, which makes the conversion useful for email attachments and upload forms with a size limit.",
    keywords: ["png to jpg", "png to jpeg", "convert png to jpg", "png to jpg converter"],
  },
  {
    slug: "/jpg-to-png",
    from: "JPG",
    to: "png",
    toLabel: "PNG",
    why: "PNG is lossless, so converting to it stops further quality loss when you plan to edit and re-save an image repeatedly.",
    keywords: ["jpg to png", "jpeg to png", "convert jpg to png", "jpg to png converter"],
  },
  {
    slug: "/png-to-webp",
    from: "PNG",
    to: "webp",
    toLabel: "WebP",
    why: "WebP keeps transparency like PNG but is dramatically smaller, which usually makes it the best format for images on a website.",
    keywords: ["png to webp", "convert png to webp", "png to webp converter"],
  },
  {
    slug: "/webp-to-png",
    from: "WebP",
    to: "png",
    toLabel: "PNG",
    why: "Some older software and design tools still cannot open WebP. Converting to PNG keeps transparency and works everywhere.",
    keywords: ["webp to png", "convert webp to png", "webp to png converter"],
  },
  {
    slug: "/jpg-to-webp",
    from: "JPG",
    to: "webp",
    toLabel: "WebP",
    why: "WebP is typically 25-35% smaller than JPG at the same visual quality, which is the single easiest page-speed win for an image-heavy site.",
    keywords: ["jpg to webp", "jpeg to webp", "convert jpg to webp"],
  },
  {
    slug: "/webp-to-jpg",
    from: "WebP",
    to: "jpeg",
    toLabel: "JPG",
    why: "JPG is the safest format to hand to software that predates WebP, including many print services and older photo editors.",
    keywords: ["webp to jpg", "webp to jpeg", "convert webp to jpg"],
  },
];

for (const page of CONVERSION_PAGES) {
  const { slug, from, to, toLabel, why, keywords } = page;

  TOOLS.push({
    slug,
    engine: "convert",
    preset: { targetFormat: to, sourceLabel: from },
    name: `${from} to ${toLabel}`,
    h1: `Convert ${from} to ${toLabel}`,
    title: `${from} to ${toLabel} Converter: Free, No Upload`,
    description: `Convert ${from} to ${toLabel} in your browser. Batch conversion with quality control, no signup, no watermark, and nothing uploaded.`,
    keywords: [
      ...keywords,
      `${from.toLowerCase()} to ${toLabel.toLowerCase()} online`,
      `free ${from.toLowerCase()} to ${toLabel.toLowerCase()}`,
      `batch ${from.toLowerCase()} to ${toLabel.toLowerCase()}`,
      "convert image without uploading",
    ],
    intro: `Turn ${from} files into ${toLabel} without uploading them anywhere. Drop in one image or a whole folder, adjust the quality, and download the results.`,
    features: [
      `${from} to ${toLabel} at full resolution`,
      "Batch conversion with a single zip download",
      "Quality control for the output file size",
      "Runs fully in the browser, no upload",
      "Free, no signup, no watermark",
    ],
    faqs: [
      {
        question: `Why convert ${from} to ${toLabel}?`,
        answer: why,
      },
      ...(to === "jpeg"
        ? [
            {
              question: "What happens to transparent areas?",
              answer:
                "JPG cannot store transparency, so transparent pixels are filled with a solid colour. White is used by default and you can choose a different colour before converting.",
            },
          ]
        : []),
      {
        question: `Is there a limit on how many ${from} files I can convert?`,
        answer:
          "No. Because the conversion happens on your own machine there is no server quota to hit. The practical limit is your device's memory, and files are processed one at a time to keep that manageable.",
      },
      PRIVACY_FAQ,
      FREE_FAQ,
    ],
    related: ["/convert-image", "/compress-image", "/resize-image"],
    primary: false,
  });
}

export const TOOL_SLUGS: string[] = TOOLS.map((tool) => tool.slug);

export const PRIMARY_TOOLS: ToolDefinition[] = TOOLS.filter(
  (tool) => tool.primary
);

export const CONVERTER_TOOLS: ToolDefinition[] = TOOLS.filter(
  (tool) => !tool.primary
);

export function getTool(slug: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

/**
 * Throwing accessor for route files, so a typo in a slug fails the build
 * rather than rendering an empty page.
 */
export function requireTool(slug: string): ToolDefinition {
  const tool = getTool(slug);
  if (!tool) throw new Error(`Unknown image tool slug: ${slug}`);
  return tool;
}

export function getRelatedTools(tool: ToolDefinition): ToolDefinition[] {
  return tool.related
    .map((slug) => getTool(slug))
    .filter((related): related is ToolDefinition => Boolean(related));
}

export const TOOLS_HUB_PATH = "/tools";
