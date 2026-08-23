export interface MediaRange {
  type: string;
  subtype: string;
  q: number;
}

export const MARKDOWN_TYPES = ["text/markdown", "text/x-markdown"] as const;

export function parseAccept(header: string | null): MediaRange[] {
  if (!header) return [];
  const ranges: MediaRange[] = [];

  for (const part of header.split(",")) {
    const [rawRange, ...params] = part.trim().split(";");
    const range = rawRange.trim().toLowerCase();
    if (!range) continue;

    const [type, subtype = "*"] = range.split("/");
    if (!type) continue;

    let q = 1;
    for (const param of params) {
      const [key, value] = param.split("=");
      if (key?.trim().toLowerCase() !== "q") continue;
      const parsed = Number.parseFloat(value ?? "");
      q = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 1) : 1;
    }

    ranges.push({ type, subtype: subtype.trim(), q });
  }

  return ranges;
}

export function qualityFor(ranges: MediaRange[], mediaType: string): number {
  const [type, subtype] = mediaType.toLowerCase().split("/");
  let best = -1;

  for (const range of ranges) {
    const matches =
      (range.type === type && range.subtype === subtype) ||
      (range.type === type && range.subtype === "*") ||
      (range.type === "*" && range.subtype === "*");
    if (matches && range.q > best) best = range.q;
  }

  return best < 0 ? 0 : best;
}

function bestMarkdownQuality(ranges: MediaRange[]): number {
  return Math.max(...MARKDOWN_TYPES.map((t) => qualityFor(ranges, t)));
}

function hasExplicitMarkdown(ranges: MediaRange[]): boolean {
  return ranges.some(
    (range) =>
      MARKDOWN_TYPES.includes(
        `${range.type}/${range.subtype}` as (typeof MARKDOWN_TYPES)[number],
      ) && range.q > 0,
  );
}

export function prefersMarkdown(header: string | null): boolean {
  const ranges = parseAccept(header);
  if (!hasExplicitMarkdown(ranges)) return false;
  return bestMarkdownQuality(ranges) > qualityFor(ranges, "text/html");
}

export function isUnacceptable(header: string | null): boolean {
  const ranges = parseAccept(header);
  if (ranges.length === 0) return false;
  return (
    qualityFor(ranges, "text/html") === 0 && bestMarkdownQuality(ranges) === 0
  );
}
