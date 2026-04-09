import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as db from "./db";

describe("Admin Dashboard", () => {

  beforeAll(async () => {
    // Setup: Create test leads (skip if they already exist from a previous run)
    const existing1 = await db.getDiscountLead("test1@example.com");
    if (!existing1) await db.createDiscountLead("test1@example.com", "HEALTH10");
    const existing2 = await db.getDiscountLead("test2@example.com");
    if (!existing2) await db.createDiscountLead("test2@example.com", "HEALTH10");
  });

  afterAll(async () => {
    // Cleanup if needed
  });

  it("should fetch all discount leads", async () => {
    const leads = await db.getAllDiscountLeads();
    expect(leads.length).toBeGreaterThanOrEqual(2);
    expect(leads[0]).toHaveProperty("email");
    expect(leads[0]).toHaveProperty("discountCode");
  });

  it("should get correct lead count", async () => {
    const count = await db.getDiscountLeadsCount();
    expect(count).toBeGreaterThanOrEqual(2);
    expect(typeof count).toBe("number");
  });

  it("should get today's lead count", async () => {
    const count = await db.getDiscountLeadsCountToday();
    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
