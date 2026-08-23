import { llmsTxt } from "@/lib/agents/llms";

export async function GET() {
  return new Response(llmsTxt.trim(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept, Accept-Encoding",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
