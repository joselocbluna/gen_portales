import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login",
    },
});

export const config = {
    // Coincide con /dashboard, /dashboard/*, /editor/*
    // Pero deja libre la home / y el api auth
    matcher: ["/dashboard/:path*", "/editor/:path*"],
};
