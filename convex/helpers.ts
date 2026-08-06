import { MutationCtx, QueryCtx } from "./_generated/server";

type Authish = Pick<MutationCtx | QueryCtx, "auth">;

export async function getSessionEmail(ctx: Authish): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.email ?? null;
}

export async function isAdmin(ctx: Authish): Promise<boolean> {
  const email = await getSessionEmail(ctx);
  if (!email) return false;
  const admin = await ctx.db
    .query("admins")
    .withIndex("by_email", (q) => q.eq("email", email))
    .unique();
  return admin !== null;
}

export async function requireAdmin(ctx: Authish): Promise<string> {
  const email = await getSessionEmail(ctx);
  if (!email || !(await isAdmin(ctx))) {
    throw new Error("Unauthorized: admin access required");
  }
  return email;
}