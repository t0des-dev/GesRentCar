import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            }),
            headers: { "Content-Type": "application/json" }
          });

          const data = await res.json();

          if (res.ok && data.user && data.token) {
            return {
              id: data.user.id.toString(),
              name: data.user.name,
              email: data.user.email,
              role: data.user.role || 'client', // Assuming role might be returned
              token: data.token,
            };
          }
          return null;
        } catch (e) {
          console.error("Login error:", e);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.accessToken = (user as any).token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // We'll create or update this page
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.AUTH_SECRET || "super_secret_auth_key_for_vectoria_123"
})
