import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Next 16 renamed the `middleware` file convention to `proxy`; next-intl's
// `createMiddleware` is still the request handler it returns.
export default createMiddleware(routing);

export const config = {
  matcher: [
    // Everything except Next internals, API routes, metadata files and assets
    // with an extension. Those must never be rewritten to a locale prefix.
    "/((?!api|_next/static|_next/image|.*\\..*).*)",
  ],
};
