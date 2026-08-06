export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
} satisfies import("@convex-dev/auth/server").ConvexAuthConfig;