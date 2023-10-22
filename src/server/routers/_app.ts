import { z } from "zod";
import { publicProcedure, router, standardProcedure } from "../trpc";

export const appRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  visitors: standardProcedure
    .meta({ authRequired: false })
    .query(({ ctx, input }) => {
      console.log({ ctx, input });
      return 100;
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
