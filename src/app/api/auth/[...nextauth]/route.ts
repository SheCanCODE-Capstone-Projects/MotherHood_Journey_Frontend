<<<<<<< HEAD
import { type NextRequest } from "next/server";

/**
 * NextAuth route handler
 * This is a placeholder implementation
 * 
 * TODO: Configure with your authentication providers:
 * - Google OAuth
 * - GitHub OAuth
 * - Credentials (email/password)
 * - Others as needed
 */

export async function GET(request: NextRequest) {
  // NextAuth will handle the request routing
  return new Response("NextAuth GET endpoint", { status: 200 });
}

export async function POST(request: NextRequest) {
  // NextAuth will handle the request routing
  return new Response("NextAuth POST endpoint", { status: 200 });
}
=======
import NextAuth from "next-auth";

import { authOptions } from "@/shared/lib/auth";

export const {
	handlers: { GET, POST },
} = NextAuth(authOptions);
>>>>>>> 70b53139d72327305443a69b70b7ff8739383fc2
