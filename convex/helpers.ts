import { QueryCtx } from "./_generated/server";

type AdminCtx = Pick<QueryCtx, "auth" | "db">;

export async function getSessionEmail(ctx: AdminCtx): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.email ?? null;
}

export async function isAdmin(ctx: AdminCtx): Promise<boolean> {
  const email = await getSessionEmail(ctx);
  if (!email) return false;
  const admin = await ctx.db
    .query("admins")
    .withIndex("by_email", (q) => q.eq("email", email))
    .unique();
  return admin !== null;
}

export async function requireAdmin(ctx: AdminCtx): Promise<string> {
  const email = await getSessionEmail(ctx);
  if (!email) {
    throw new Error("Unauthorized: admin access required");
  }
  const admin = await ctx.db
    .query("admins")
    .withIndex("by_email", (q) => q.eq("email", email))
    .unique();
  if (!admin) {
    throw new Error("Unauthorized: admin access required");
  }
  return email;
}