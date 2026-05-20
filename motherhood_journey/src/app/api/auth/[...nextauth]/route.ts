/**
 * app/api/auth/[...nextauth]/route.ts
 *
 * Mounts NextAuth v5's HTTP handlers on the Next.js App Router.
 * All auth endpoints (/api/auth/signin, /api/auth/signout, /api/auth/session,
 * /api/auth/callback/*, /api/auth/csrf) are handled automatically.
 */

import { handlers } from "@/auth";

export const { GET, POST } = handlers;
