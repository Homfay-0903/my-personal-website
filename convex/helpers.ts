import { QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

type AdminCtx = Pick<QueryCtx, "auth" | "db">;

export async function getSessionEmail(ctx: AdminCtx): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  if (identity.email) return identity.email;
  // Fallback for tokens without the email claim issued before customClaims:
  // Convex Auth JWTs carry the user id as `sub` (format "<userId>|<sessionId>").
  const userId = identity.subject.split("|")[0];
  if (!userId) return null;
  const user = await ctx.db.get(userId as Id<"users">);
  return user?.email ?? null;
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