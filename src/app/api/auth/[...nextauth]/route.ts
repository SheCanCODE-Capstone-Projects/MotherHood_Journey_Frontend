import NextAuth from "next-auth";

import { authOptions } from "@/shared/lib/auth";

const { handlers } = NextAuth(authOptions);

export const { GET, POST } = handlers;
