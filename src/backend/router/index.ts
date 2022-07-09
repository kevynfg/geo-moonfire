import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/backend/utils/prisma";

export const appRouter = trpc
  .router()
  .query("get-geocode-location", {
    input: z.object({
      address: z.string().min(3).max(200).nullish(),
      location: z.object({
        lat: z.number().min(-90).max(90).nullish(),
        lng: z.number().min(-180).max(180).nullish(),
      }).nullish(),
    }).nullish(),
    async resolve({input}) {
      
      console.log('entrei', input);
  
    },
  })

// export type definition of API
export type AppRouter = typeof appRouter;