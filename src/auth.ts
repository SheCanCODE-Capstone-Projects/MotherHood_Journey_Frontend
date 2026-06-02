import NextAuth from "next-auth";
import { authOptions } from "@/shared/lib/auth";

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
