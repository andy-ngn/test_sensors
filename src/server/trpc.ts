import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";
import { z } from "zod";

interface Meta {
  authRequired: boolean;
  with_org_info?: boolean;
}

const t = initTRPC
  .context<Context>()
  .meta<Meta>()
  .create({
    defaultMeta: { authRequired: true, with_org_info: true },
  });

t.middleware;
const isAuthed = t.middleware(({ next, ctx, meta, input }) => {
  if (meta?.authRequired && !ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return next();
});

const getCluster: Record<string, "eu-cluster" | "ca-cluster"> = {
  ikea_gr: "eu-cluster",
  ikea_ottawa: "ca-cluster",
};
const standardMiddleware = t.middleware(({ next, ctx, meta }) => {
  return next();
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const standardProcedure = t.procedure
  .input(
    z.object({
      org_id: z.string(),
    })
  )
  .use(({ next, input, ctx, meta }) => {
    console.log(meta);
    if (meta?.authRequired && !ctx.session?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }
    if (meta?.with_org_info && !!input.org_id) {
      const cluster = getCluster[input.org_id];
      if (!cluster) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return next({
        ctx: {
          cluster,
        },
      });
    }

    return next();
  });
