import { NextRequest } from "next/server";
import { notFoundJson } from "@/lib/api/errors";

function handler(request: NextRequest) {
  return notFoundJson(request.nextUrl.pathname);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const HEAD = handler;
export const OPTIONS = handler;
