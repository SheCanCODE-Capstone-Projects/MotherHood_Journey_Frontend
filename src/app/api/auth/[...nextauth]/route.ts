import NextAuth from "next-auth";

import { authOptions } from "@/shared/lib/auth";

export const {
	handlers: { GET, POST },
} = NextAuth(authOptions);
