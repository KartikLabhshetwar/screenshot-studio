import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|r2-assets|svc|llms\\.txt|llms-full\\.txt|robots\\.txt|sitemap\\.xml|.*\\..*).*)",
  ],
};
