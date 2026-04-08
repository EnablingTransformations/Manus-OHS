import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Email verification codes for discount popup.
 * Stores pending verification codes with expiration.
 */
export const emailVerifications = mysqlTable("emailVerifications", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  verified: int("verified").default(0).notNull(),
  attempts: int("attempts").default(0).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailVerification = typeof emailVerifications.$inferSelect;
export type InsertEmailVerification = typeof emailVerifications.$inferInsert;

/**
 * Discount leads — verified emails that received the discount code.
 */
export const discountLeads = mysqlTable("discountLeads", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  discountCode: varchar("discountCode", { length: 50 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DiscountLead = typeof discountLeads.$inferSelect;
export type InsertDiscountLead = typeof discountLeads.$inferInsert;
/**
 * SMS opt-ins — stores phone numbers from customers who opted in to SMS marketing.
 * Used for cart abandoner and last-minute availability campaigns.
 * Phone numbers stored in E.164 format: +15551234567
 */
export const smsOptIns = mysqlTable("smsOptIns", {
  id: int("id").autoincrement().primaryKey(),
  /** Phone number in E.164 format: +15551234567 */
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  /** Customer email address */
  email: varchar("email", { length: 320 }),
  /** Stripe charge ID for reference */
  stripeChargeId: varchar("stripeChargeId", { length: 100 }),
  /** Stripe customer ID for reference */
  stripeCustomerId: varchar("stripeCustomerId", { length: 100 }),
  /** Ticket type purchased: virtual, general, or vip */
  ticketType: mysqlEnum("ticketType", ["virtual", "general", "vip"]),
  /** Ticket purchase amount in cents */
  amountInCents: int("amountInCents"),
  /** Status: active, unsubscribed, invalid, bounced */
  status: mysqlEnum("status", ["active", "unsubscribed", "invalid", "bounced"]).default("active").notNull(),
  /** Whether phone number has been verified */
  verified: int("verified").default(0).notNull(),
  /** Verification code sent to phone (for 2-way verification) */
  verificationCode: varchar("verificationCode", { length: 10 }),
  /** Number of SMS messages sent to this number */
  smsSentCount: int("smsSentCount").default(0).notNull(),
  /** Last SMS sent timestamp */
  lastSmsSentAt: timestamp("lastSmsSentAt"),
  /** Timestamp when opted in */
  optedInAt: timestamp("optedInAt").defaultNow().notNull(),
  /** Timestamp when unsubscribed (if applicable) */
  unsubscribedAt: timestamp("unsubscribedAt"),
  /** When record was created */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** When record was last updated */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SmsOptIn = typeof smsOptIns.$inferSelect;
export type InsertSmsOptIn = typeof smsOptIns.$inferInsert;
