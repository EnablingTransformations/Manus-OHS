/**
 * Stripe payment router for Optimal Health Summit ticket purchases.
 * Handles checkout session creation via tRPC and webhook events via Express.
 */

import type { Application, Request, Response } from "express";
import express from "express";
import Stripe from "stripe";
import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { TICKET_PRODUCTS } from "./products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const stripeRouter = router({
  /**
   * Create a Stripe Checkout Session for a ticket purchase.
   * Returns a checkout URL that the frontend opens in a new tab.
   */
  createCheckoutSession: publicProcedure
    .input(
      z.object({
        ticketId: z.enum(["virtual", "general", "vip"]),
        origin: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const product = TICKET_PRODUCTS.find((p) => p.id === input.ticketId);
      if (!product) {
        throw new Error("Invalid ticket type");
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${product.name} — Optimal Health Summit 2026`,
                description: product.description,
              },
              unit_amount: product.priceInCents,
            },
            quantity: 1,
          },
        ],
        success_url: `${input.origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${input.origin}/?payment=cancelled`,
        allow_promotion_codes: true,
        metadata: {
          ticket_id: product.id,
          ticket_name: product.name,
          event: "Optimal Health Summit 2026",
          ...(ctx.user
            ? {
                user_id: ctx.user.id.toString(),
                customer_email: ctx.user.email ?? "",
                customer_name: ctx.user.name ?? "",
              }
            : {}),
        },
        ...(ctx.user?.email ? { customer_email: ctx.user.email } : {}),
      });

      return { url: session.url };
    }),

  /**
   * Get available ticket products for frontend display.
   */
  getProducts: publicProcedure.query(() => {
    return TICKET_PRODUCTS;
  }),
});

/**
 * Register the Stripe webhook endpoint on the Express app.
 * MUST be called BEFORE express.json() middleware so the raw body is preserved.
 */
export function registerStripeWebhook(app: Application) {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event: Stripe.Event;

      try {
        if (!webhookSecret) {
          event = JSON.parse(req.body.toString()) as Stripe.Event;
        } else {
          event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        }
      } catch (err) {
        console.error("[Webhook] Signature verification failed:", err);
        res.status(400).send(`Webhook Error: ${(err as Error).message}`);
        return;
      }

      // Handle test events for webhook verification
      if (event.id.startsWith("evt_test_")) {
        console.log("[Webhook] Test event detected, returning verification response");
        res.json({ verified: true });
        return;
      }

      console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          console.log(
            `[Webhook] Payment completed — session: ${session.id}`,
            `| ticket: ${session.metadata?.ticket_id}`,
            `| customer: ${session.metadata?.customer_email ?? session.customer_email ?? "unknown"}`
          );
          break;
        }
        case "payment_intent.succeeded": {
          const pi = event.data.object as Stripe.PaymentIntent;
          console.log(`[Webhook] PaymentIntent succeeded: ${pi.id}`);
          break;
        }
        default:
          console.log(`[Webhook] Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    }
  );
}
