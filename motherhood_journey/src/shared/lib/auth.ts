import type { NextAuthConfig} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        phone: { label: "Phone", type: "tel" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              signal: controller.signal,
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                phone: credentials?.phone,
                password: credentials?.password,
              }),
            }
          );
          clearTimeout(timeoutId);

          
          if (!res.ok) {
            console.warn("login failed");
            return null;
          }

          const user = await res.json();
          if(
            !user ||
            typeof user !== "object" ||
            typeof user.token !== "string" ||
            user.token.length === 0
          ) {
            console.warn("login response missing token");
            return null;
          }
          

          return user;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
    
  ],

   session:{
    strategy:"jwt",
   },

   callbacks: {
    async jwt({ token, user}){
      if(user){
        token.accessToken = user.token;
        token.role = user.role;
        token.facilityId = user.facilityId;
        token.geoScopeIds = user.geoScopeIds;
        token.canExport = user.canExport;
        token.canPushHmis = user.canPushHmis;
      }
      return token;
    },
     async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.role = token.role;
      session.user.facilityId = token.facilityId;
      session.user.geoScopeIds = token.geoScopeIds;
      session.user.canExport = token.canExport;
      session.user.canPushHmis = token.canPushHmis;

     return session;
   },

    
   },

   
};