/**
 * Optimal Health Summit - Stripe Product Definitions
 * One-time purchase tickets for the June 27, 2026 event.
 */

export interface TicketProduct {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  badge?: string;
  features: string[];
}

export const TICKET_PRODUCTS: TicketProduct[] = [
  {
    id: "virtual",
    name: "Virtual Ticket",
    description: "Live stream access and recordings for the Optimal Health Summit 2026",
    priceInCents: 4900,
    badge: "7 Left",
    features: [
      "Live stream and recordings",
      "Ask questions during sessions via chat",
    ],
  },
  {
    id: "general",
    name: "Advanced Access General",
    description: "Full in-person access to the Optimal Health Summit 2026",
    priceInCents: 14900,
    badge: "5 Left",
    features: [
      "Nutritious breakfast, lunch & snacks",
      "All keynote presentations & panels",
      "Expo hall access",
      "Networking with 120+ attendees",
      "After-event networking social",
    ],
  },
  {
    id: "vip",
    name: "Advanced Access VIP",
    description: "Premium VIP experience at the Optimal Health Summit 2026",
    priceInCents: 34900,
    badge: "2 Left",
    features: [
      "Everything in Advanced Access General",
      "Reserved front-row seating",
      "Private lunch with speakers",
      "PCM blood test (valued at $200)",
      "Microbiome assessment kit (save $100)",
      "Complimentary premium supplement",
    ],
  },
];
