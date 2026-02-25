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
            async authorize(credentials, req) {
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
                        } as any;
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
                token.id = user.id;
                token.companyId = (user as any).companyId;
                token.role = (user as any).role;
                token.accessToken = (user as any).accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.id;
                (session.user as any).companyId = token.companyId;
                (session.user as any).role = token.role;
                (session.user as any).accessToken = token.accessToken;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
