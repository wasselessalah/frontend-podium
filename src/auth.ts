import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

async function loginAdmin(username: string, password: string) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
    console.log('🔍 Tentative de connexion à:', apiUrl);
    console.log('👤 Username:', username);
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    console.log('📡 Statut de la réponse:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Erreur de connexion:', errorData);
      return null;
    }

    const data = await response.json();
    console.log('✅ Connexion réussie:', { success: data.success, hasData: !!data.data });
    return data;
  } catch (error) {
    console.error("❌ Login error:", error);
    return null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        const result = await loginAdmin(username, password);

        if (result?.success && result?.data?.admin) {
          return {
            id: result.data.admin.id,
            name: result.data.admin.username,
            email: result.data.admin.username,
            role: result.data.admin.role,
            token: result.data.token,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
});
