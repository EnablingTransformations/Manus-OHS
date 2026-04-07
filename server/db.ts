import { eq, and, gt, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, emailVerifications, discountLeads } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ─── Email Verification & Discount Leads ───

export async function createEmailVerification(email: string, code: string, expiresAt: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(emailVerifications).values({ email, code, expiresAt });
}

export async function getLatestVerification(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(emailVerifications)
    .where(eq(emailVerifications.email, email))
    .orderBy(desc(emailVerifications.createdAt))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function markVerificationUsed(id: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(emailVerifications)
    .set({ verified: 1 })
    .where(eq(emailVerifications.id, id));
}

export async function incrementVerificationAttempts(id: number) {
  const db = await getDb();
  if (!db) return;
  const record = await db.select().from(emailVerifications).where(eq(emailVerifications.id, id)).limit(1);
  if (record.length > 0) {
    await db
      .update(emailVerifications)
      .set({ attempts: record[0].attempts + 1 })
      .where(eq(emailVerifications.id, id));
  }
}

export async function getDiscountLead(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(discountLeads)
    .where(eq(discountLeads.email, email))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createDiscountLead(email: string, discountCode: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(discountLeads).values({ email, discountCode });
}

// ─── Admin Dashboard Queries ───

export async function getAllDiscountLeads() {
  const db = await getDb();
  if (!db) return [];
  const result = await db
    .select()
    .from(discountLeads)
    .orderBy(desc(discountLeads.createdAt));
  return result;
}

export async function getDiscountLeadsCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select()
    .from(discountLeads);
  return result.length;
}

export async function getDiscountLeadsCountToday() {
  const db = await getDb();
  if (!db) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const result = await db
    .select()
    .from(discountLeads)
    .where(gt(discountLeads.createdAt, today));
  return result.length;
}
