import { initTRPC, TRPCError } from "@trpc/server";
import { prisma } from "./db.server";
import { redis } from "./redis.server";
import superjson from "superjson";
import type { User } from "@prisma/client";

export interface Context {
  user: User | null;
  prisma: typeof prisma;
  redis: typeof redis;
}

export const createTRPCContext = async (opts: {
  user?: User | null;
}): Promise<Context> => {
  return {
    user: opts.user || null,
    prisma,
    redis,
  };
};

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

// Admin-only procedure
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});
