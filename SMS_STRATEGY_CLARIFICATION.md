# SMS Strategy Clarification: Who to Text and Who NOT to Text

## The Problem with My Original Strategy

You're absolutely correct. I made a critical error in the SMS retargeting guide. **You should NOT text people who already purchased tickets.** That's wasteful and annoying.

---

## Corrected SMS Strategy

### WHO to Text (Cart Abandoners Only)

**Scenario:** Customer adds ticket to cart, starts checkout, but abandons before completing payment.

**Why text them?**
- They showed intent to purchase
- They're 80% of the way through checkout
- A simple reminder can recover 10-15% of abandoned carts
- They haven't completed the transaction yet

**SMS Sequence:**
1. **Immediate (0 min):** "You left your ticket in the cart. Complete checkout: [LINK]"
2. **2 hours later:** "⏰ Only 8 seats left! Finish your purchase: [LINK]"
3. **6 hours later:** "Social proof + urgency message"
4. **24 hours later:** "Final offer with discount expiration"

**Expected Result:** 8-12% of abandoners complete purchase

---

### WHO NOT to Text

❌ **People who already purchased**
- They completed the transaction
- Texting them is spam
- Wastes SMS budget
- Damages brand reputation
- Increases unsubscribe rate

❌ **People who never visited checkout**
- They didn't show purchase intent
- No abandoned cart to recover
- Better to reach them with email or ads

❌ **People who explicitly opted out**
- They replied STOP
- Legally can't contact them
- Platform automatically removes them

---

## Revised SMS Campaign Strategy

### Campaign 1: Cart Abandoner Recovery (ONLY)

**Trigger:** Customer abandons cart (adds item but doesn't complete payment)

**Audience:** ~5-10% of visitors who reach checkout

**Messages:** 4 SMS over 24 hours

**Expected Conversion:** 8-12% of abandoners = 10-15 additional tickets

**Budget:** $25/month (SimpleTexting) + minimal SMS cost

**ROI:** 20-30x return

---

### Campaign 2: Last-Minute Availability (Website Visitors Only)

**Trigger:** 7 days before event

**Audience:** People who visited website but DIDN'T purchase

**Messages:** 6 SMS countdown (7 days → day-of)

**Expected Conversion:** 5-8% of website visitors = 5-10 additional tickets

**Budget:** $25/month (SimpleTexting)

**ROI:** 10-15x return

---

## When to Contact Purchasers (Different Channels)

### SMS for Purchasers: ONLY Operational Info

After someone purchases, text them ONLY for:
- ✓ Parking/venue information (1 day before)
- ✓ Event day logistics (morning of)
- ✓ Post-event thank you (1 day after)

**Example Day-Before SMS:**
```
🎉 See you tomorrow! 
Doors open 8:30 AM
Parking: [LINK]
See you soon!
```

**Example Day-Of SMS:**
```
The summit starts in 1 hour!
Doors open at 8:30 AM
Parking info: [LINK]
```

**Example Post-Event SMS:**
```
Thank you for attending! 
Recordings available for 90 days: [LINK]
Post-event survey: [LINK]
```

### Email for Purchasers: Engagement & Upsell

Use email (not SMS) for purchasers:
- ✓ Pre-event preparation guide
- ✓ Speaker bios and resources
- ✓ Upsell to VIP tier
- ✓ Post-event follow-up
- ✓ Recordings and materials

**Why email instead of SMS?**
- Longer content (SMS limited to 160 characters)
- Less intrusive than SMS
- Better for detailed information
- Lower cost than SMS
- People expect marketing emails, not marketing SMS

---

## Corrected SMS Budget Allocation

### Total SMS Budget: $50-75/month

| Campaign | Monthly Cost | Expected Revenue | ROI |
|----------|-------------|------------------|-----|
| Cart Abandoner | $25 | $1,000-1,500 | 40-60x |
| Last-Minute Availability | $25 | $500-1,000 | 20-40x |
| **Total** | **$50** | **$1,500-2,500** | **30-50x** |

### Breakdown:
- SimpleTexting platform: $25/month
- Cart abandoner SMS: ~$0.01 × 4 messages × 50 abandoners = $2
- Last-minute SMS: ~$0.01 × 6 messages × 200 visitors = $12
- **Total SMS cost:** ~$14/month
- **Total platform + SMS:** ~$39/month

---

## The Correct SMS Workflow

```
VISITOR JOURNEY:

1. Visits website
   ↓
2. Clicks "Get Tickets"
   ↓
3. Enters phone number (with 5% SMS discount incentive)
   ↓
4. Starts checkout
   ↓
   ├─ COMPLETES PURCHASE
   │  └─ Stop SMS retargeting
   │  └─ Send operational SMS only (day before, day of, day after)
   │  └─ Use email for engagement
   │
   └─ ABANDONS CART
      └─ Send SMS 1: Immediate reminder
      └─ Send SMS 2: 2 hours later (urgency)
      └─ Send SMS 3: 6 hours later (social proof)
      └─ Send SMS 4: 24 hours later (final offer)
      └─ If still no purchase → Stop SMS
      └─ Try email or ads instead
```

---

## Why the Original Guide Was Wrong

### Mistake 1: Post-Purchase SMS
I suggested texting purchasers with "upsell to VIP" messages. This is wrong because:
- They already bought a ticket
- SMS is expensive and intrusive
- Email is better for detailed offers
- Damages customer experience

### Mistake 2: Confusing Sequences
I mixed cart abandoner SMS with post-purchase sequences. This created confusion about who should receive what.

### Mistake 3: Over-Texting
I suggested 15 different SMS messages. This is too many and would:
- Exceed SMS frequency limits
- Increase unsubscribe rate
- Waste budget
- Annoy customers

---

## Corrected SMS Campaigns (Final Version)

### Campaign 1: Cart Abandoner Recovery

**Message 1 (Immediate)**
```
Hi [Name]! You left your ticket in the cart. 
Complete checkout to secure your spot:
[LINK: Finish Purchase]

Reply STOP to opt out.
```

**Message 2 (2 hours later)**
```
⏰ Only 8 seats left! Your ticket is still 
available. Complete checkout now:
[LINK: Buy Ticket]

Code SUMMIT20 = 20% off (expires in 24 hours)
```

**Message 3 (6 hours later)**
```
"This summit changed my life!" - Sarah M.

Don't miss out. Secure your spot:
[LINK: Get Your Ticket]

Only 6 seats remaining.
```

**Message 4 (24 hours later)**
```
🚨 LAST CHANCE: Your 20% discount expires 
in 2 hours! Only 3 seats left.

[LINK: Complete Purchase]

After this, tickets go to regular pricing.
```

**Stop after Message 4.** Don't send more SMS to this person.

---

### Campaign 2: Last-Minute Availability (Website Visitors Only)

**Message 1 (7 days before event)**
```
🎉 7 DAYS LEFT: Optimal Health Summit is 
almost here! Only 15 seats remaining.

[LINK: Get Tickets]

Use code SUMMIT20 for 20% off
```

**Message 2 (5 days before)**
```
⏰ 5 DAYS: Only 12 seats left. Last chance 
to join world-class speakers.

[LINK: Register]

Virtual ($49) | General ($97) | VIP ($247)
```

**Message 3 (3 days before)**
```
🚨 URGENT: Only 8 seats left! The summit 
is in 3 days.

[LINK: Get Your Ticket]

Code SUMMIT20 = 20% off (expires soon)
```

**Message 4 (2 days before)**
```
⏳ 48 HOURS: 5 seats remaining. After these 
sell out, we're officially closed.

[LINK: Buy Ticket]

Join us June 20 in San Diego!
```

**Message 5 (1 day before)**
```
🔥 FINAL DAY: Only 2 seats left! The summit 
starts TOMORROW (June 20).

[LINK: Get Your Ticket]

Don't regret missing this!
```

**Message 6 (Day of event, morning)**
```
🎉 TODAY IS THE DAY! The summit starts in 
1 hour. Doors open at 8:30 AM.

Parking & directions: [LINK]

See you soon!
```

---

### Operational SMS for Purchasers (Minimal)

**Message 1 (1 day before event)**
```
See you tomorrow! 
Doors open 8:30 AM
Parking info: [LINK]
```

**Message 2 (Day of event)**
```
The summit starts in 1 hour!
Doors at 8:30 AM
Parking: [LINK]
```

**Message 3 (1 day after event)**
```
Thank you for attending!
Recordings: [LINK]
Survey: [LINK]
```

**That's it.** Only 3 SMS for purchasers, all operational.

---

## Corrected SMS Budget

### Total Cost: $50-65/month

| Item | Cost |
|------|------|
| SimpleTexting platform | $25/month |
| Cart abandoner SMS (~50 abandoners × 4 messages × $0.01) | $2 |
| Last-minute SMS (~200 visitors × 6 messages × $0.01) | $12 |
| Operational SMS for purchasers (~150 × 3 messages × $0.01) | $4.50 |
| **Total** | **~$43.50/month** |

### Expected Revenue

| Campaign | Conversion Rate | Tickets | Revenue |
|----------|-----------------|---------|---------|
| Cart abandoners | 10% | 5 | $485 |
| Last-minute visitors | 5% | 10 | $970 |
| **Total** | - | **15** | **$1,455** |

### ROI
- Revenue: $1,455
- Cost: $43.50
- Profit: $1,411.50
- **ROI: 3,246%** (32x return)

---

## Key Takeaways

✓ **Text cart abandoners** - They're close to purchasing  
✓ **Text last-minute visitors** - Create urgency before sold out  
✗ **Don't text purchasers with sales messages** - They already bought  
✓ **Text purchasers with operational info only** - Parking, timing, logistics  
✓ **Use email for purchasers** - Better for detailed content  

---

## Next Steps

1. **Implement cart abandoner SMS only** (ignore last-minute campaign for now)
2. **Add phone field to checkout** with 5% SMS discount incentive
3. **Set up SimpleTexting automation** for cart abandoners
4. **Test with your own phone** before launching
5. **Monitor metrics** (opt-in rate, click rate, conversion rate)
6. **Add last-minute SMS** in final week before event (if needed)

---

**Last Updated:** April 8, 2026  
**Status:** Corrected Strategy Ready ✅
