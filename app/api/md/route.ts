import { NextRequest } from "next/server";
import {
  BASE_URL,
  MARKDOWN_PATH_HEADER,
  findAgentPage,
  normalizeAgentPath,
  renderAgentPageMarkdown,
  renderNotFoundMarkdown,
} from "@/lib/agents/site-content";
import { llmsTxt } from "@/lib/agents/llms";

function markdownResponse(body: string, status: number, canonical: string) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept, Accept-Encoding",
      Link: `<${canonical}>; rel="canonical"`,
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

export async function GET(request: NextRequest) {
  const pathname = normalizeAgentPath(
    request.headers.get(MARKDOWN_PATH_HEADER) ||
      request.nextUrl.searchParams.get("path") ||
      "/",
  );
  const canonical = `${BASE_URL}${pathname === "/" ? "/" : pathname}`;
  const page = findAgentPage(pathname);

  if (!page) {
    return markdownResponse(renderNotFoundMarkdown(pathname), 404, canonical);
  }

  if (pathname === "/") {
    return markdownResponse(`${llmsTxt.trim()}\n`, 200, canonical);
  }

  return markdownResponse(renderAgentPageMarkdown(page), 200, canonical);
}
