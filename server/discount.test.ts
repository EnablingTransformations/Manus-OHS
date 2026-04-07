import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => {
  const leads = new Map<string, { email: string; discountCode: string }>();
  return {
    getDiscountLead: vi.fn(async (email: string) => leads.get(email) || undefined),
    createDiscountLead: vi.fn(async (email: string, discountCode: string) => {
      leads.set(email, { email, discountCode });
    }),
    // Also mock user-related functions that may be needed
    getUserByOpenId: vi.fn(async () => undefined),
    upsertUser: vi.fn(async () => {}),
    getDb: vi.fn(async () => null),
  };
});

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("discount.submitEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("saves a new email lead and returns the discount code", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.discount.submitEmail({ email: "test@example.com" });

    expect(result).toEqual({ success: true, code: "HEALTH10" });
  });

  it("returns existing discount code for duplicate email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // First submission
    await caller.discount.submitEmail({ email: "duplicate@example.com" });
    // Second submission with same email
    const result = await caller.discount.submitEmail({ email: "duplicate@example.com" });

    expect(result).toEqual({ success: true, code: "HEALTH10" });
  });

  it("rejects invalid email format", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.discount.submitEmail({ email: "not-an-email" })
    ).rejects.toThrow();
  });
});
