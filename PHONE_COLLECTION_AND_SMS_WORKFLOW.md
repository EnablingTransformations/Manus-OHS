# Phone Collection & SMS Workflow Guide

## 1. HOW PHONE NUMBERS ARE COLLECTED

### Current Implementation
- **Where**: Ticket checkout modal (optional field)
- **When**: Before user clicks "Get Ticket" button
- **Storage**: Sent to Stripe in checkout session metadata
- **Database**: Stored in Stripe's system (not your database yet)

### Data Flow
```
User enters phone → Checkout modal → Stripe metadata → Stripe stores → You retrieve from Stripe
```

## 2. PHONE NUMBER VALIDATION & FORMAT

### Current Status: NOT VALIDATED
Your current implementation has **no validation**. Users can enter:
- ❌ "123" (too short)
- ❌ "abc" (letters)
- ❌ "555-1234" (incomplete)
- ❌ "+1 (555) 123-4567" (correct format but not validated)

### Recommended Validation

**Option A: Basic Format Validation (Recommended)**
```javascript
// Validate phone number format
const validatePhoneNumber = (phone: string): boolean => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Check if it's 10 digits (US) or 11 digits (US with country code)
  return digitsOnly.length === 10 || digitsOnly.length === 11;
};

// Normalize to E.164 format for SMS sending
const normalizePhoneNumber = (phone: string): string => {
  let digitsOnly = phone.replace(/\D/g, '');
  
  // If 10 digits, add US country code
  if (digitsOnly.length === 10) {
    digitsOnly = '1' + digitsOnly;
  }
  
  // Return in E.164 format: +1234567890
  return '+' + digitsOnly;
};

// Example usage
const userPhone = "+1 (555) 123-4567";
const normalized = normalizePhoneNumber(userPhone); // "+15551234567"
```

**Option B: Advanced Validation with libphonenumber (International)**
```javascript
// Install: npm install libphonenumber-js
import { parsePhoneNumber } from 'libphonenumber-js';

const validatePhoneNumber = (phone: string, country = 'US'): boolean => {
  try {
    const parsed = parsePhoneNumber(phone, country);
    return parsed?.isValid() ?? false;
  } catch {
    return false;
  }
};

// Returns normalized E.164 format
const normalizePhoneNumber = (phone: string, country = 'US'): string => {
  const parsed = parsePhoneNumber(phone, country);
  return parsed?.format('E.164') ?? '';
};
```

## 3. IMPLEMENTING PHONE VALIDATION IN CHECKOUT

### Frontend Changes Needed (Home.tsx)

```typescript
// Add validation function
const validatePhoneNumber = (phone: string): boolean => {
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length === 10 || digitsOnly.length === 11;
};

// Update handleBuy function
const handleBuy = async (ticketId: "virtual" | "general" | "vip") => {
  // Validate phone if SMS opt-in is checked
  if (optInSms && phoneNumber && !validatePhoneNumber(phoneNumber)) {
    alert("Please enter a valid phone number (10 or 11 digits)");
    return;
  }
  
  // Continue with checkout...
};

// Update the phone input field
<input
  type="tel"
  placeholder="+1 (555) 123-4567"
  value={phoneNumber}
  onChange={(e) => setPhoneNumber(e.target.value)}
  maxLength="20"
  className="..."
/>
```

### Backend Changes Needed (stripeRouter.ts)

```typescript
// Add validation and normalization
const normalizePhoneNumber = (phone: string): string => {
  let digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length === 10) {
    digitsOnly = '1' + digitsOnly;
  }
  return '+' + digitsOnly;
};

// In createCheckoutSession mutation
.mutation(async ({ input, ctx }) => {
  // Validate phone if SMS opt-in
  if (input.optInSms && input.phoneNumber) {
    const digitsOnly = input.phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length !== 10 && digitsOnly.length !== 11) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid phone number format'
      });
    }
    
    // Normalize to E.164 format
    input.phoneNumber = normalizePhoneNumber(input.phoneNumber);
  }
  
  // Continue with checkout...
});
```

## 4. HOW TO RETRIEVE PHONE NUMBERS LATER

### Option A: From Stripe Dashboard (Manual)
1. Go to Stripe Dashboard → Payments
2. Click on a successful payment
3. Scroll to "Metadata" section
4. See `phone_number` and `sms_opt_in` fields
5. **Problem**: Manual process, not scalable

### Option B: Via Stripe API (Recommended)
```typescript
// In your backend, create an endpoint to fetch opted-in customers
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Fetch all payments with SMS opt-in
const getOptedInPhoneNumbers = async () => {
  const charges = await stripe.charges.list({
    limit: 100,
  });
  
  const phoneNumbers = charges.data
    .filter(charge => charge.metadata?.sms_opt_in === 'true')
    .map(charge => ({
      phone: charge.metadata?.phone_number,
      email: charge.billing_details?.email,
      amount: charge.amount / 100,
      date: new Date(charge.created * 1000)
    }));
  
  return phoneNumbers;
};
```

### Option C: Save to Your Database (Best Practice)
```typescript
// Create a database table to store opted-in customers
export const smsOptIns = sqliteTable('sms_opt_ins', {
  id: integer('id').primaryKey(),
  phone_number: text('phone_number').notNull(), // E.164 format: +15551234567
  email: text('email'),
  stripe_customer_id: text('stripe_customer_id'),
  stripe_charge_id: text('stripe_charge_id'),
  ticket_type: text('ticket_type'), // 'virtual', 'general', 'vip'
  opted_in_at: integer('opted_in_at').notNull(), // Unix timestamp
  status: text('status').default('active'), // 'active', 'unsubscribed', 'invalid'
});

// In webhook handler, save to database
const savePhoneNumber = async (
  phoneNumber: string,
  email: string,
  chargeId: string,
  ticketType: string
) => {
  await db.insert(smsOptIns).values({
    phone_number: phoneNumber,
    email,
    stripe_charge_id: chargeId,
    ticket_type: ticketType,
    opted_in_at: Date.now(),
    status: 'active'
  });
};
```

## 5. HOW TO SEND SMS MESSAGES LATER

### Step 1: Choose SMS Service Provider

| Provider | Cost | Features | Best For |
|----------|------|----------|----------|
| **SimpleTexting** | $0.01-0.03/SMS | Easy UI, automation, 2-way | Small campaigns |
| **Twilio** | $0.0075/SMS | API-first, flexible, scalable | Developers |
| **Plivo** | $0.005/SMS | Affordable, reliable | High volume |
| **AWS SNS** | $0.00645/SMS | AWS integration, scalable | AWS users |

### Step 2: Export Phone Numbers
```typescript
// Create endpoint to export opted-in phone numbers
export const exportPhoneNumbers = async () => {
  const optedIn = await db
    .select()
    .from(smsOptIns)
    .where(eq(smsOptIns.status, 'active'));
  
  // Format as CSV
  const csv = 'phone,email,ticket_type,opted_in_at\n' +
    optedIn.map(row => 
      `${row.phone_number},${row.email},${row.ticket_type},${row.opted_in_at}`
    ).join('\n');
  
  return csv;
};
```

### Step 3: Upload to SMS Service
**SimpleTexting Example:**
1. Go to SimpleTexting.com
2. Create new campaign
3. Upload CSV with phone numbers
4. Write message (max 160 characters per SMS)
5. Schedule or send immediately

**Twilio API Example:**
```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (phoneNumber: string, message: string) => {
  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });
};

// Send to all opted-in users
const sendCampaign = async (message: string) => {
  const optedIn = await db
    .select()
    .from(smsOptIns)
    .where(eq(smsOptIns.status, 'active'));
  
  for (const row of optedIn) {
    await sendSMS(row.phone_number, message);
  }
};
```

## 6. VERIFICATION & COMPLIANCE

### Phone Number Verification Options

**Option A: Automatic Verification (Recommended)**
```typescript
// Use Twilio Verify API to verify phone numbers
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Step 1: Send verification code
const sendVerificationCode = async (phoneNumber: string) => {
  const verification = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID)
    .verifications.create({
      to: phoneNumber,
      channel: 'sms'
    });
  
  return verification.sid;
};

// Step 2: User enters code, you verify
const verifyCode = async (verificationSid: string, code: string) => {
  const verification = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID)
    .verificationChecks.create({
      verification_sid: verificationSid,
      code: code
    });
  
  return verification.status === 'approved';
};
```

**Option B: Manual Verification (Simpler)**
- Send SMS with verification link
- User clicks link to confirm
- Mark as verified in database

### TCPA Compliance (US Law)
- ✅ **Explicit opt-in required** (checkbox checked)
- ✅ **Clear disclosure** ("Get 10% off - Opt in to SMS updates")
- ✅ **Easy opt-out** (include "Reply STOP to unsubscribe")
- ✅ **Respect opt-outs** (remove from list immediately)
- ✅ **No texts between 9 PM - 8 AM** recipient's timezone
- ✅ **Identify sender** (include business name in first SMS)

## 7. IMPLEMENTATION ROADMAP

### Week 1: Validation
- [ ] Add frontend phone validation
- [ ] Add backend phone validation
- [ ] Normalize to E.164 format
- [ ] Test with various phone formats

### Week 2: Database Storage
- [ ] Create `sms_opt_ins` table
- [ ] Save phone numbers from Stripe webhook
- [ ] Create export endpoint

### Week 3: SMS Integration
- [ ] Choose SMS provider (recommend SimpleTexting for simplicity)
- [ ] Set up account and API credentials
- [ ] Create export workflow

### Week 4: Verification
- [ ] Implement phone verification (optional but recommended)
- [ ] Add TCPA compliance messages
- [ ] Test SMS sending

## 8. CURRENT GAPS TO FIX

Your current implementation is missing:

1. ❌ **Phone validation** - No format checking
2. ❌ **Phone normalization** - Not storing in E.164 format
3. ❌ **Database storage** - Only in Stripe metadata
4. ❌ **Phone verification** - No confirmation it's a real number
5. ❌ **Export mechanism** - No way to get all phone numbers
6. ❌ **SMS sending integration** - No SMS provider connected

## NEXT STEPS

Would you like me to:
1. Add phone validation to the checkout form?
2. Create database table to store phone numbers?
3. Set up SMS provider integration (SimpleTexting or Twilio)?
4. Implement phone verification workflow?
