import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminProcedure } from "./_core/trpc";
import { stripeRouter } from "./stripeRouter";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  stripe: stripeRouter,

  discount: router({
    submitEmail: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        const { email } = input;
        // Check if already a lead
        const existing = await db.getDiscountLead(email);
        if (existing) {
          return { success: true, code: existing.discountCode };
        }
        // Save new lead
        const discountCode = "HEALTH10";
        await db.createDiscountLead(email, discountCode);
        return { success: true, code: discountCode };
      }),
  }),

  admin: router({
    getLeads: adminProcedure.query(async () => {
      const leads = await db.getAllDiscountLeads();
      return leads;
    }),

    getStats: adminProcedure.query(async () => {
      const totalLeads = await db.getDiscountLeadsCount();
      const leadsToday = await db.getDiscountLeadsCountToday();
      const totalSmsSubscribers = await db.getActiveSmsOptInsCount();
      return {
        totalLeads,
        leadsToday,
        discountCode: "HEALTH10",
        totalSmsSubscribers,
      };
    }),

    getSmsSubscribers: adminProcedure.query(async () => {
      const subscribers = await db.getAllActiveSmsOptIns();
      return subscribers;
    }),
  }),
});

export type AppRouter = typeof appRouter;
