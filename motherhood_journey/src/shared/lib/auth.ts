import type { NextAuthConfig} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        phone: { label: "Phone", type: "phone" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                phone: credentials?.phone,
                password: credentials?.password,
              }),
            }
          );

          
          if (!res.ok) {
            console.warn("login failed");
            return null;
          }

          const user = await res.json();

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