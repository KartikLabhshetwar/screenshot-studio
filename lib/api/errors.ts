import { NextResponse } from "next/server";

export const API_DOCS_URL = "https://www.screenshot-studio.com/docs";

export type ApiErrorCode =
  | "invalid_request"
  | "invalid_url"
  | "unsupported_value"
  | "unauthorized"
  | "forbidden_domain"
  | "not_found"
  | "method_not_allowed"
  | "rate_limited"
  | "upstream_timeout"
  | "upstream_unavailable"
  | "upstream_failed"
  | "internal_error";

export interface ApiErrorBody {
  error: string;
  code: ApiErrorCode;
  message: string;
  hint: string;
  status: number;
  documentation: string;
}

export function apiErrorBody(
  status: number,
  code: ApiErrorCode,
  message: string,
  hint: string,
): ApiErrorBody {
  return {
    error: message,
    code,
    message,
    hint,
    status,
    documentation: `${API_DOCS_URL}#errors`,
  };
}

export function apiError(
  status: number,
  code: ApiErrorCode,
  message: string,
  hint: string,
  extra?: Record<string, unknown>,
  headers?: Record<string, string>,
): NextResponse {
  return NextResponse.json(
    { ...apiErrorBody(status, code, message, hint), ...extra },
    { status, headers },
  );
}

export function methodNotAllowed(allowed: string[]): NextResponse {
  return apiError(
    405,
    "method_not_allowed",
    `Method not allowed. This endpoint accepts ${allowed.join(", ")}.`,
    `Retry with one of: ${allowed.join(", ")}. The full operation contract is published at https://www.screenshot-studio.com/openapi.json`,
    undefined,
    { Allow: [...allowed, "OPTIONS"].join(", ") },
  );
}

export function notFoundJson(pathname: string): NextResponse {
  return apiError(
    404,
    "not_found",
    `No API endpoint matches ${pathname}.`,
    "Fetch https://www.screenshot-studio.com/openapi.json for the list of available operations, or https://www.screenshot-studio.com/llms.txt for a site overview.",
  );
}
