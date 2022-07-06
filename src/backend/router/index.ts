import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/backend/utils/prisma";

export const appRouter = trpc
  .router()
  .query("get-geocode-location", {
    async resolve() {

      
    },
  })

// export type definition of API
export type AppRouter = typeof appRouter;