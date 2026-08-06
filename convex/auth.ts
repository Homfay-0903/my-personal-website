import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
  jwt: {
    customClaims: async (ctx, { userId }) => {
      const user = await ctx.db.get(userId);
      return { email: user?.email };
    },
  },
});
