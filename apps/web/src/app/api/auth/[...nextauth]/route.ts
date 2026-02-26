import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@empresa.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const res = await fetch(`http://localhost:3002/auth/login`, {
                        method: 'POST',
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                        headers: { 'Content-Type': 'application/json' },
                    });

                    const data = await res.json();

                    if (res.ok && data.user && data.access_token) {
                        return {
                            id: data.user.id,
                            name: data.user.name,
                            email: data.user.email,
                            companyId: data.user.companyId,
                            role: data.user.role,
                            accessToken: data.access_token,
                        } as import("next-auth").User & { companyId?: string; role?: string; accessToken?: string };
                    }
                    return null;
                } catch (error) {
                    console.error("Login Error via NextAuth:", error);
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const u = user as import("next-auth").User & { companyId?: string; role?: string; accessToken?: string };
                token.id = u.id;
                token.companyId = u.companyId;
                token.role = u.role;
                token.accessToken = u.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                const u = session.user as import("next-auth").User & { id?: string; companyId?: string; role?: string; accessToken?: string };
                u.id = token.id as string;
                u.companyId = token.companyId as string;
                u.role = token.role as string;
                u.accessToken = token.accessToken as string;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
