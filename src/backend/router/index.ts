import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/backend/utils/prisma";

let google: any;
  
if (typeof window !== "undefined" && typeof window.google !== "undefined") {
    google = window.google;
}

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
      let geoCoder = new google.maps.Geocoder() as google.maps.Geocoder;
      if (input?.address) {
        const { address: addressInput } = input;
        console.log('entrei 2', addressInput)
        geoCoder.geocode({componentRestrictions: {
            country: "BR",
        }, address: addressInput}, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
          console.log('ooooooola', results, status)
            if (status !== "OK") {
                console.log('zero results');
                return { error: 'zero results' };
            }
            
            if (status === "OK") {
                console.log('result', results);
                { location: results };
            }
        })
      }

      if (input?.location && input?.location?.lat && input?.location?.lng) {
        const { lat, lng } = input?.location;
        geoCoder.geocode({componentRestrictions: {
          country: "BR",
        }, location: {
          lat: lat,
          lng: lng,
        }}, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
            if (status !== "OK") {
                console.log('zero results');
                return { error: 'zero results' };
            }
            
            if (status === "OK") {
                console.log('result', results);
                { location: results };
            }
        })
      }
    },
  })

// export type definition of API
export type AppRouter = typeof appRouter;