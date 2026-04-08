# SMS Infrastructure Guide: How SMS Retargeting Actually Works

## Overview

This guide explains the complete SMS infrastructure: who sends the messages, which service providers handle delivery, and how phone numbers are collected.

---

## Who Sends the Text Messages?

### Short Answer
**The SMS platform you choose (SimpleTexting, Klaviyo, Twilio, etc.) sends the messages automatically on your behalf.**

You don't manually send texts. Instead, you:
1. Write the message content
2. Set up automation triggers
3. The platform automatically sends at the right time

### How It Works

```
Your Website
    ↓
Customer abandons cart
    ↓
Automation Trigger
(2 hours later)
    ↓
SMS Platform
(SimpleTexting/Klaviyo)
    ↓
SMS Service Provider
(Twilio/Bandwidth/Telnyx)
    ↓
Carrier Network
(AT&T, Verizon, T-Mobile, etc.)
    ↓
Customer's Phone
```

---

## Service Providers: The Complete Chain

### Layer 1: Your SMS Platform (What You Choose)

**SimpleTexting** ($25/month)
- User-friendly dashboard
- Built-in automation
- Handles compliance
- Stores phone numbers securely
- Sends messages on schedule

**Klaviyo** ($20/month)
- Email + SMS bundled
- Advanced segmentation
- Better for existing email subscribers
- Integrated workflows

**Twilio** ($0.0075 per SMS)
- Most flexible/powerful
- Requires technical setup
- Best for custom integrations
- Pay-as-you-go

**Attentive** ($300/month)
- Enterprise-grade
- High-volume campaigns
- Advanced analytics

### Layer 2: SMS Service Providers (Behind the Scenes)

Your SMS platform partners with these carriers:

**Twilio**
- Connects to all major carriers
- Handles routing and delivery
- Ensures compliance

**Bandwidth**
- Alternative carrier network
- High delivery rates
- Enterprise support

**Telnyx**
- Global SMS delivery
- Low latency
- Competitive pricing

### Layer 3: Carrier Networks (Delivers to Phone)

The actual carriers that deliver SMS:
- **AT&T**
- **Verizon**
- **T-Mobile**
- **Sprint**
- **Regional carriers**

---

## How Phone Numbers Are Collected

### Method 1: Opt-In During Checkout (Recommended)

**Step 1: Add Phone Field to Checkout**
```html
<label>
  <input type="tel" name="phone" placeholder="(555) 123-4567" />
  Text me updates about my ticket and special offers
</label>
```

**Step 2: Customer Provides Number**
- Customer enters phone number voluntarily
- Creates explicit consent for SMS
- Legally compliant (customer opted in)

**Step 3: Platform Stores Number**
- SMS platform securely stores phone number
- Links to customer email/order
- Encrypts data in transit and at rest

**Step 4: Automation Triggers**
- When cart abandoned → Send SMS
- When event date approaches → Send SMS
- When seats running low → Send SMS

### Method 2: Opt-In After Purchase

**Step 1: Send Confirmation Email**
```
Hi [Name],

Your ticket is confirmed!

Get real-time updates via SMS:
[LINK: Add Your Phone Number]
```

**Step 2: Customer Clicks Link**
- Opens form to add phone number
- Confirms opt-in
- Platform stores number

**Step 3: Automations Begin**
- Customer now receives SMS updates
- Pre-event reminders
- Day-of logistics

### Method 3: SMS Opt-In Form on Website

**Step 1: Add Opt-In Form**
```
Get exclusive SMS updates about the summit:
[Phone Number Input]
[Subscribe Button]
```

**Step 2: Customer Subscribes**
- Enters phone number
- Receives confirmation SMS
- Added to contact list

**Step 3: Segmentation**
- Tag as "Website Visitor"
- Send last-minute availability SMS
- Track conversion

---

## Complete Data Flow Example

### Scenario: Cart Abandoner SMS

```
STEP 1: CUSTOMER PROVIDES PHONE NUMBER
├─ Customer enters phone at checkout
├─ Platform receives: +1-619-555-1234
├─ Stores with order ID: #12345
└─ Encrypts in database

STEP 2: CUSTOMER ABANDONS CART
├─ Customer closes checkout page
├─ Platform detects abandonment
├─ Triggers automation: "Cart Abandoned"
└─ Waits 0 minutes

STEP 3: IMMEDIATE SMS SENT
├─ Platform retrieves phone: +1-619-555-1234
├─ Constructs message: "Hi [Name]! You left your ticket..."
├─ Sends to Twilio API
├─ Twilio routes to AT&T network
├─ AT&T delivers to customer's phone
└─ Customer receives SMS instantly

STEP 4: 2-HOUR FOLLOW-UP
├─ Platform waits 2 hours
├─ Checks if customer purchased (they didn't)
├─ Retrieves phone again: +1-619-555-1234
├─ Sends second message: "⏰ Only 8 seats left..."
├─ Twilio routes to Verizon network
├─ Verizon delivers to customer's phone
└─ Customer receives follow-up SMS

STEP 5: CUSTOMER CLICKS LINK
├─ Customer clicks SMS link
├─ Visits checkout page
├─ Completes purchase
├─ Platform detects purchase
├─ Stops sending abandonment SMS
└─ Starts post-purchase sequence
```

---

## Phone Number Security & Privacy

### Data Encryption
- **In Transit:** All phone numbers encrypted with SSL/TLS
- **At Rest:** Encrypted in database with AES-256
- **Access Control:** Only authorized staff can view

### Compliance Requirements
- **TCPA (Telemarketing Consumer Protection Act)**
  - Must have explicit consent
  - Must honor opt-out requests
  - Must include company identifier
  - Can't send before 9 AM or after 9 PM

- **GDPR (if EU customers)**
  - Must have explicit consent
  - Right to access/delete data
  - Data processing agreement required

- **CCPA (if California customers)**
  - Must disclose data collection
  - Right to opt-out
  - Right to delete

### Best Practices
- ✓ Store phone numbers securely
- ✓ Encrypt all data
- ✓ Honor opt-out requests immediately
- ✓ Keep audit logs
- ✓ Regular security audits
- ✓ Privacy policy clearly states SMS collection

---

## Phone Number Collection for Your Website

### Implementation Steps

**Step 1: Add Phone Field to Checkout Form**

In your checkout page (`client/src/pages/Home.tsx`), add:

```html
<div>
  <label htmlFor="phone" className="block text-sm font-medium text-white/60 mb-2">
    Phone Number (for SMS updates)
  </label>
  <input 
    id="phone" 
    type="tel" 
    name="phone" 
    placeholder="(555) 123-4567"
    pattern="[0-9\-\(\)\s]+"
    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm"
  />
  <p className="text-xs text-white/40 mt-2">
    ☐ Text me updates about my ticket and special offers
    (Standard message rates apply. Reply STOP to opt out)
  </p>
</div>
```

**Step 2: Store Phone Number in Database**

When customer completes purchase, store:
- Phone number
- Opt-in timestamp
- Opt-in consent (true/false)
- Ticket type
- Order ID

**Step 3: Export to SMS Platform**

Weekly export of phone numbers:
```
Name, Email, Phone, Ticket Type, Order Date, Opted In
John Doe, john@example.com, 619-555-1234, General, 2026-04-08, true
Jane Smith, jane@example.com, 619-555-5678, VIP, 2026-04-07, true
```

**Step 4: Import to SimpleTexting**

1. Log into SimpleTexting
2. Go to Contacts → Import
3. Upload CSV file
4. Map fields (Name, Phone, Email)
5. Create segment "OHS - All Subscribers"

**Step 5: Set Up Automations**

In SimpleTexting:
1. Create automation "Cart Abandoners"
2. Trigger: Phone number + abandoned cart flag
3. Message 1: Immediate
4. Message 2: 2 hours later
5. Message 3: 6 hours later
6. Message 4: 24 hours later

---

## Phone Number Collection Rate

### Expected Opt-In Rates

| Incentive | Opt-In Rate |
|-----------|------------|
| No incentive | 5-10% |
| SMS-exclusive discount (5% off) | 15-25% |
| SMS-exclusive discount (10% off) | 25-40% |
| Free shipping/bonus | 30-45% |

### Recommendation for Your Event
- Offer: **"Opt in to SMS and get 5% off your ticket"**
- Expected opt-in rate: **20-25%**
- If 200 tickets sold: **40-50 phone numbers collected**

---

## Complete SMS Platform Comparison

| Feature | SimpleTexting | Klaviyo | Twilio | Attentive |
|---------|---------------|---------|--------|-----------|
| **Cost** | $25/month | $20/month | $0.0075/SMS | $300/month |
| **Setup Time** | 15 min | 30 min | 2-3 hours | 1 hour |
| **Ease of Use** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Automation** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Compliance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Best For** | Beginners | Email users | Developers | Enterprise |

### Recommendation: **SimpleTexting**
- Easiest to use
- Affordable ($25/month)
- Handles all compliance
- Perfect for event marketing
- No technical knowledge required

---

## Step-by-Step: Setting Up SMS for Your Website

### Week 1: Preparation

**Day 1-2: Choose Platform**
- [ ] Sign up for SimpleTexting ($25/month)
- [ ] Verify phone number
- [ ] Get SMS shortcode

**Day 3-4: Add Phone Field**
- [ ] Update checkout form to include phone number
- [ ] Add opt-in checkbox
- [ ] Add SMS opt-in incentive (5% discount)

**Day 5-7: Test**
- [ ] Send test SMS to your phone
- [ ] Verify links work
- [ ] Test opt-out (STOP)

### Week 2: Launch

**Day 1-2: Create Contact List**
- [ ] Export existing customers to CSV
- [ ] Add phone numbers (if available)
- [ ] Import to SimpleTexting

**Day 3-5: Set Up Automations**
- [ ] Create cart abandoner automation
- [ ] Create last-minute availability automation
- [ ] Set up compliance (STOP response)

**Day 6-7: Monitor**
- [ ] Track opt-in rate
- [ ] Monitor delivery rate
- [ ] Check click-through rate

### Week 3+: Optimize

- [ ] A/B test messages
- [ ] Adjust send times
- [ ] Scale successful campaigns
- [ ] Monitor ROI

---

## FAQ: SMS Infrastructure

### Q: What if someone doesn't want SMS?
**A:** They can reply STOP to any message. The platform automatically unsubscribes them and honors all future opt-out requests.

### Q: How much does it cost to send SMS?
**A:** SimpleTexting: $25/month for unlimited messages. Twilio: $0.0075 per SMS. For 1,000 SMS, SimpleTexting is cheaper.

### Q: Can I use my personal phone to send SMS?
**A:** No. You must use a business SMS platform. Personal phone SMS violates carrier policies and SMS regulations.

### Q: How long does SMS take to deliver?
**A:** Usually 1-3 seconds. Sometimes up to 30 seconds due to carrier delays.

### Q: What if the SMS doesn't deliver?
**A:** SimpleTexting handles bounces automatically. Invalid numbers are flagged and removed from future sends.

### Q: Can I send SMS from my website directly?
**A:** Not recommended. Use a platform like SimpleTexting or Twilio. They handle compliance, delivery, and bounce management.

### Q: Is SMS marketing legal?
**A:** Yes, if you have explicit consent and honor opt-out requests. TCPA regulations require:
- Explicit consent (checkbox)
- Opt-out option (STOP)
- Company identifier
- Do-not-disturb hours (9 PM - 9 AM)

### Q: How do I know if SMS is working?
**A:** SimpleTexting provides real-time analytics:
- Messages sent/delivered
- Click-through rate
- Conversion rate
- Unsubscribe rate

### Q: Can I segment SMS by ticket type?
**A:** Yes. SimpleTexting allows tagging and segmentation:
- Tag: "Virtual Ticket"
- Tag: "General Access"
- Tag: "VIP"
- Send different messages to each segment

---

## Security Checklist

- [ ] Choose reputable SMS platform (SimpleTexting, Klaviyo, Twilio)
- [ ] Enable SSL/TLS encryption
- [ ] Store phone numbers encrypted
- [ ] Regular security audits
- [ ] Privacy policy updated
- [ ] TCPA compliance verified
- [ ] Opt-out automation working
- [ ] Data backup plan in place
- [ ] Access control restricted
- [ ] Audit logs enabled

---

## Next Steps

1. **Sign up for SimpleTexting** ($25/month)
2. **Add phone field to checkout form**
3. **Create SMS opt-in incentive** (5% discount)
4. **Set up cart abandoner automation**
5. **Set up last-minute availability automation**
6. **Test with your own phone**
7. **Monitor metrics daily**
8. **Optimize based on performance**

---

**Last Updated:** April 8, 2026  
**Status:** Ready for Implementation 📱
