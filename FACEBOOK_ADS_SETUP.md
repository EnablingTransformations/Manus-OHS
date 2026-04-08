# Facebook Ads Setup Guide for Optimal Health Summit

## Part 1: Purchase Event Tracking (Completed ✅)

Your website now tracks the following conversion events:

| Event | Trigger | Data Tracked |
|-------|---------|--------------|
| **PageView** | Every page load | URL, referrer, device |
| **AddToCart** | User selects a ticket | Ticket type, price ($49-$247) |
| **InitiateCheckout** | User clicks "Proceed to Checkout" | Ticket type |
| **Lead** | User submits contact form | Form submission |
| **Purchase** | Stripe webhook confirms payment | Ticket type, price, customer email |

---

## Part 2: Create Custom Audiences for Retargeting

### Audience 1: Website Visitors (All Traffic)
**Purpose:** Retarget anyone who visited your site

**Steps in Facebook Ads Manager:**
1. Go to **Audiences** → **Create Audience** → **Custom Audience**
2. Select **Website Traffic**
3. Choose **All Visitors**
4. Set lookback window to **180 days**
5. Name: "OHS - All Website Visitors"
6. Save

**Use case:** Show ads to people who showed interest but didn't convert

---

### Audience 2: Ticket Page Viewers
**Purpose:** Retarget people who viewed the tickets section

**Steps in Facebook Ads Manager:**
1. Go to **Audiences** → **Create Audience** → **Custom Audience**
2. Select **Website Traffic**
3. Choose **People who visited specific web pages**
4. URL contains: `justdoitrightnow.com/#tickets`
5. Set lookback window to **90 days**
6. Name: "OHS - Ticket Page Viewers"
7. Save

**Use case:** Show ads with special offers to people interested in tickets

---

### Audience 3: Cart Abandoners (High Priority)
**Purpose:** Retarget people who selected a ticket but didn't complete purchase

**Steps in Facebook Ads Manager:**
1. Go to **Audiences** → **Create Audience** → **Custom Audience**
2. Select **Website Traffic**
3. Choose **People who visited specific web pages**
4. URL contains: `justdoitrightnow.com/?payment=cancelled`
5. Set lookback window to **30 days**
6. Name: "OHS - Cart Abandoners"
7. Save

**Use case:** Show discount codes or urgency messaging to complete purchase

---

### Audience 4: Past Purchasers (Upsell)
**Purpose:** Retarget people who already bought tickets

**Steps in Facebook Ads Manager:**
1. Go to **Audiences** → **Create Audience** → **Custom Audience**
2. Select **Website Traffic**
3. Choose **People who visited specific web pages**
4. URL contains: `justdoitrightnow.com/thank-you`
5. Set lookback window to **365 days**
6. Name: "OHS - Past Purchasers"
7. Save

**Use case:** Upsell higher tier tickets or promote related events

---

## Part 3: Campaign Optimization Strategy

### Campaign Structure

```
Optimal Health Summit Campaign
├── Campaign 1: Awareness (Broad Targeting)
│   └── Ad Set 1: Cold Traffic - Interests
│   └── Ad Set 2: Cold Traffic - Lookalike
│
├── Campaign 2: Consideration (Website Traffic)
│   └── Ad Set 1: All Website Visitors
│   └── Ad Set 2: Ticket Page Viewers
│
└── Campaign 3: Conversion (High-Intent)
    └── Ad Set 1: Cart Abandoners (URGENT)
    └── Ad Set 2: Past Purchasers (Upsell)
```

---

## Campaign 1: Awareness (Cold Traffic)

### Ad Set 1A: Interest-Based Targeting
**Budget:** $10-15/day  
**Duration:** Ongoing until June 20

**Targeting:**
- Location: San Diego, CA + 50 mile radius
- Age: 25-65
- Interests: Health, wellness, longevity, personal development, fitness
- Behaviors: Health-conscious, event attendees

**Ad Creative:**
- Headline: "One Day Can Change Everything"
- Body: "Join 150 health leaders on June 20 for a transformative summit on longevity, brain health, and peak performance."
- CTA: "Learn More"
- Image: Hero event photo

**Optimization:** Optimize for **Leads** (contact form submissions)

---

### Ad Set 1B: Lookalike Audience
**Budget:** $10-15/day  
**Duration:** Ongoing until June 20

**Targeting:**
- Create lookalike from "OHS - Past Purchasers" audience
- 1% lookalike (most similar to past buyers)
- Location: San Diego, CA + 50 mile radius

**Ad Creative:**
- Same as 1A but emphasize "Limited to 150 seats"

**Optimization:** Optimize for **Leads**

---

## Campaign 2: Consideration (Website Retargeting)

### Ad Set 2A: All Website Visitors
**Budget:** $5-10/day  
**Duration:** Ongoing until June 20

**Targeting:**
- Custom Audience: "OHS - All Website Visitors"
- Exclude: "OHS - Past Purchasers"

**Ad Creative:**
- Headline: "Still thinking about it?"
- Body: "Secure your spot at the Optimal Health Summit. Only 150 seats available. Featuring 7 world-class speakers."
- CTA: "Get Tickets"
- Image: Different from awareness ads (speaker photos)

**Optimization:** Optimize for **Conversions** (Purchase event)

---

### Ad Set 2B: Ticket Page Viewers
**Budget:** $8-12/day  
**Duration:** Ongoing until June 20

**Targeting:**
- Custom Audience: "OHS - Ticket Page Viewers"
- Exclude: "OHS - Past Purchasers"

**Ad Creative:**
- Headline: "3 Ticket Tiers Available"
- Body: "Virtual ($49) • Advanced General ($97) • Advanced VIP ($247) — Choose your experience"
- CTA: "View Tickets"
- Image: Ticket tier comparison graphic

**Optimization:** Optimize for **Conversions** (Purchase event)

---

## Campaign 3: Conversion (High-Intent Retargeting)

### Ad Set 3A: Cart Abandoners (HIGHEST PRIORITY)
**Budget:** $15-20/day  
**Duration:** Ongoing until June 20

**Targeting:**
- Custom Audience: "OHS - Cart Abandoners"

**Ad Creative:**
- Headline: "Complete Your Purchase — 20% Off!"
- Body: "You were just one step away. Use code SUMMIT20 for 20% off your ticket. Offer expires in 48 hours."
- CTA: "Complete Purchase"
- Image: Urgency-focused (countdown timer or limited seats graphic)

**Optimization:** Optimize for **Conversions** (Purchase event)

---

### Ad Set 3B: Past Purchasers (Upsell)
**Budget:** $5-8/day  
**Duration:** Ongoing until June 20

**Targeting:**
- Custom Audience: "OHS - Past Purchasers"

**Ad Creative:**
- Headline: "Upgrade Your Experience"
- Body: "Already have a ticket? Upgrade to VIP for exclusive benefits: private lunch with speakers, blood tests, and more."
- CTA: "Upgrade Now"
- Image: VIP benefits showcase

**Optimization:** Optimize for **Conversions** (Purchase event)

---

## Part 4: Budget Allocation & Timeline

### Week 1-2 (Testing Phase)
- Total daily budget: $50-60
- Focus on Campaigns 1 & 2
- Monitor performance metrics daily
- Pause underperforming ad sets

### Week 3-4 (Optimization Phase)
- Increase budget to $80-100/day
- Scale winning ad sets by 20-30%
- Reduce budget on low-performing ads
- Launch Campaign 3 (Retargeting)

### Week 5-6 (Scaling Phase)
- Increase budget to $100-150/day
- Focus on highest ROAS ad sets
- Maintain Cart Abandoner campaign (highest ROI)
- Add new creative variations

### Final Week (Urgency Phase)
- Increase budget to $150-200/day
- Emphasize "Last Chance" messaging
- Focus on conversion optimization
- Reduce awareness spending

---

## Part 5: Performance Metrics to Monitor

### Daily Checks
- **CTR (Click-Through Rate):** Target > 1.5%
- **CPC (Cost Per Click):** Target < $0.50
- **Conversion Rate:** Target > 2%
- **ROAS (Return on Ad Spend):** Target > 2.0x

### Weekly Reviews
- **Cost Per Lead:** Target < $5
- **Cost Per Purchase:** Target < $25
- **Lead Quality:** Check form submissions
- **Purchase Value:** Average ticket price ($97)

### Success Metrics (By June 20)
- **150 tickets sold** (100% capacity)
- **50% from organic/SEO** (75 tickets)
- **30% from paid ads** (45 tickets)
- **20% from direct/referral** (30 tickets)

---

## Part 6: Quick Setup Checklist

### Before Launching Campaigns
- [ ] Verify Facebook Pixel is firing (use Pixel Helper)
- [ ] Create all 4 custom audiences (listed above)
- [ ] Prepare ad creative (images, videos, copy)
- [ ] Set up conversion tracking (Purchase event)
- [ ] Test checkout flow end-to-end
- [ ] Verify thank-you page loads correctly

### During Campaign Run
- [ ] Monitor daily performance
- [ ] Pause underperforming ads after 3-5 days
- [ ] Scale winning ads by 20-30%
- [ ] Test new creative variations
- [ ] Respond to leads within 24 hours

### Post-Campaign Analysis
- [ ] Calculate total ROI
- [ ] Identify best-performing audiences
- [ ] Document winning ad copy and images
- [ ] Analyze customer feedback
- [ ] Plan next event marketing

---

## Part 7: Troubleshooting

### Pixel Not Firing
- Install Facebook Pixel Helper Chrome extension
- Visit website and check for "Pixel loaded" confirmation
- Check browser console for errors
- Verify Pixel ID in HTML (1062539898729743)

### Low Conversion Rate
- Check thank-you page loads correctly
- Verify checkout flow is smooth
- Test on mobile devices
- Ensure CTA buttons are visible and clickable

### High Cost Per Lead
- Refine audience targeting (narrow age/interests)
- Improve ad creative (test new images)
- Adjust bid strategy (try Lowest Cost)
- Increase daily budget (Facebook needs time to optimize)

### No Purchase Events Showing
- Verify Stripe webhook is configured
- Check webhook logs in Stripe Dashboard
- Ensure purchase event is mapped in Ads Manager
- Test with a test payment (card: 4242 4242 4242 4242)

---

## Resources

- **Facebook Ads Manager:** https://business.facebook.com/ads
- **Pixel Helper:** Chrome extension for debugging
- **Audience Insights:** Understand your target audience
- **Ads Library:** See competitor ads for inspiration
- **Stripe Dashboard:** Monitor webhook events at Developers → Webhooks

---

**Last Updated:** April 8, 2026  
**Status:** Ready to Launch 🚀
