import { NextResponse } from "next/server";
import { openApiSpec } from "@/lib/api/openapi";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(openApiSpec, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
