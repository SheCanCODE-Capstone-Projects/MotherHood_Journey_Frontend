import NextAuth from "next-auth";
import { authOptions } from "@/shared/lib/auth";

const { handlers: { GET, POST } } = NextAuth(authOptions);

export { GET, POST };
