/**
 * Optimal Health Summit - Sales Page Redesign
 * Framework: StoryBrand (Donald Miller) + Irresistible Offer (Russell Brunson)
 * Design: "Vitality Noir" — Editorial Health Magazine Aesthetic
 * Dark charcoal base, teal accents, gold CTAs, Playfair Display + DM Sans
 */

import { useEffect, useRef, useState } from "react";
import { useForm, ValidationError } from '@formspree/react';
import { motion, useInView } from "framer-motion";
import { trpc } from "@/lib/trpc";

// Declare fbq for Facebook Pixel
declare global {
  interface Window {
    fbq?: (event: string, action: string, data?: Record<string, any>) => void;
  }
}
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Utensils,
  Mic2,
  Sparkles,
  Heart,
  Brain,
  Flame,
  Zap,
  Shield,
  ChevronRight,
  ExternalLink,
  Star,
  Gift,
  ArrowRight,
  Instagram,
  Facebook,
  Youtube,
  Mail,
  Send,
  Phone,
  MessageSquare,
  Linkedin,
  X,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

/* ─── Image Constants ─── */
const LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/logo_8918fb42.png";
const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/optimized_hero-indoor-event-KrrdMyWTYYS3XvJpxKsfmU_b437920b.webp";
const ABOUT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/optimized_about-section-FjfkLYDPAMLJEw2wv8icUB_1302a822.webp";
const VENDOR_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/vendor-lounge-Lnf3VgZrMeCcZntU8h3i6k.webp";
const NETWORK_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/networking-U9Kbfvkn9i5po8BrKMyg9L.webp";

/* ─── Speaker Data with Photos ─── */
const SPEAKERS = [
  {
    name: "Jill Wheaton",
    role: "Tony Robbins Director of Proven Winning Mind Programming Tools",
    description: "Bringing world-class winning strategies and peak performance strategies from the Tony Robbins organization.",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/jill_original_ed3700fb.webp",
  },
  {
    name: "Dr. Neville Campbell",
    role: "MD, MBA, CEO, Philanthropist, Author, Professor & IFBB Pro Athlete",
    description: "A powerhouse at the intersection of medicine, business, and elite athletic performance.",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/optimized_neville_63270edc_722d3dc4.webp",
  },
  {
    name: "Dr. Nick Delgado",
    role: "Bestselling Author & Performance Expert",
    description: "Pioneering expert in hormones, longevity, and peak human performance with decades of research.",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/optimized_nick_463447a1_a7ead39c.webp",
  },
  {
    name: "Dr. Chelsea Grow",
    role: "Board Certified Neurologist",
    description: "Specializing in brain health, cognitive performance, and neurological wellness strategies.",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/optimized_chelsea_66e66b08_9dd60fbd.webp",
  },
  {
    name: "Joel Huizinga",
    role: "CEO at EgaCeutical & Longevity Scientist",
    description: "Cutting-edge longevity science and breakthrough pharmaceutical solutions for age reversal.",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/optimized_joel_40df6173_696d7490.webp",
  },
  {
    name: "Dr. Elena Eustache",
    role: "Love Doctor, Global Matchmaker, TV Host & Bestselling Author",
    description: "World-renowned expert in relationships, love, and the mind-body-soul connection.",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/optimized_elena_77df9d4f_87ef3eb3.webp",
  },
  {
    name: "Dr. Karolina Pras",
    role: "Root-Cause Medicine",
    description: "Functional medicine physician uncovering the root causes of chronic illness for lasting health transformation.",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/optimized_karolina_008f9417_d50db3b0.webp",
  },
  {
    name: "Surprise Speaker",
    role: "To Be Announced",
    description: "A very special guest will be revealed at the event — you won't want to miss it!",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/optimized_surprise_f5b6e4df_2739b841.webp",
  },
];

/* ─── Ticket Modal ─── */
function TicketModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const tiers = [
    {
      name: "Start Your Journey",
      id: "virtual" as const,
      price: "$49",
      badge: "7 Left",
      highlight: false,
      note: "Available until Jun 26",
      description: "Perfect for exploring from home",
      features: ["Live stream and recordings", "Ask questions during sessions via chat", "Lifetime access to recordings"],
    },
    {
      name: "Full Immersion",
      id: "general" as const,
      price: "$97",
      badge: "5 Left",
      highlight: true,
      note: "Early access pricing until Apr 24",
      description: "Most popular choice",
      features: ["Nutritious breakfast, lunch & snacks", "All keynote presentations & panels", "Expo hall access", "Networking with 120+ attendees", "After-event networking social", "30-day follow-up email sequence"],
    },
    {
      name: "Complete Transformation",
      id: "vip" as const,
      price: "$247",
      badge: "2 Left",
      highlight: false,
      note: "Early access pricing until Apr 24",
      description: "VIP experience with exclusive perks",
      features: ["Everything in Full Immersion", "Reserved front-row seating", "Private lunch with speakers", "PCM blood test (valued at $200)", "Microbiome assessment kit (save $100)", "Complimentary premium supplement", "3-month private community access"],
    },
  ];

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [optInSms, setOptInSms] = useState(false);
  const createCheckout = trpc.stripe.createCheckoutSession.useMutation();

  const handleBuy = async (ticketId: "virtual" | "general" | "vip") => {
    setLoadingId(ticketId);
    try {
      if (optInSms && phoneNumber) {
        const digitsOnly = phoneNumber.replace(/\D/g, '');
        if (digitsOnly.length < 10 || digitsOnly.length > 11) {
          alert('Please enter a valid phone number');
          setLoadingId(null);
          return;
        }
      } else if (optInSms && !phoneNumber) {
        alert('Please enter your phone number to receive the SMS discount');
        setLoadingId(null);
        return;
      }

      if (window.fbq) {
        const priceMap = { virtual: 49, general: 97, vip: 247 };
        window.fbq('track', 'AddToCart', {
          content_name: `${ticketId.charAt(0).toUpperCase() + ticketId.slice(1)} Ticket`,
          content_type: 'ticket',
          value: priceMap[ticketId],
          currency: 'USD'
        });
      }
      
      if (window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
          content_name: `${ticketId.charAt(0).toUpperCase() + ticketId.slice(1)} Ticket`,
          content_type: 'ticket'
        });
      }
      
      onClose();
      
      const result = await createCheckout.mutateAsync({ ticketId, origin: window.location.origin, phoneNumber, optInSms });
      if (result.url) {
        window.open(result.url, '_blank', 'width=600,height=700,resizable=yes,scrollbars=yes');
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Unable to start checkout. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-charcoal border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Choose Your Transformation Path</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white text-2xl">&times;</button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {tiers.map((tier) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-6 border-2 transition-all ${
                tier.highlight
                  ? 'bg-gradient-to-br from-teal/20 to-gold/10 border-teal/50 ring-2 ring-teal/30'
                  : 'bg-charcoal-light border-white/10 hover:border-teal/30'
              }`}
            >
              {tier.highlight && (
                <div className="mb-4 inline-block px-3 py-1 bg-teal/30 text-teal text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
              <p className="text-white/60 text-sm mb-4">{tier.description}</p>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gold">{tier.price}</span>
                <p className="text-white/40 text-xs mt-1">{tier.note}</p>
              </div>
              <ul className="space-y-2 mb-6">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                    <CheckCircle className="w-4 h-4 text-teal mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleBuy(tier.id)}
                disabled={loadingId === tier.id}
                className={`w-full py-3 rounded-lg font-bold transition-all ${
                  tier.highlight
                    ? 'bg-gold text-charcoal hover:bg-gold/90'
                    : 'bg-teal/30 text-teal hover:bg-teal/40 border border-teal/50'
                }`}
              >
                {loadingId === tier.id ? 'Processing...' : 'Select This Option'}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="bg-charcoal-light border border-white/10 rounded-xl p-6">
          <h3 className="text-white font-bold mb-4">Get 10% Off with SMS</h3>
          <div className="space-y-3">
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 bg-charcoal border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-teal"
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={optInSms}
                onChange={(e) => setOptInSms(e.target.checked)}
                className="w-4 h-4 rounded border-white/30"
              />
              <span className="text-white/70 text-sm">Yes, send me the 10% discount code via SMS</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Reusable Animated Section ─── */
function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 1: HERO (StoryBrand: The Character)
   ═══════════════════════════════════════════════════════════════ */
function Hero({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center pt-20 md:pt-0 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMG}
          alt="Optimal Health Summit 2026"
          className="w-full h-full object-cover"
          fetchPriority="high"
          width="1920"
          height="1072"
          srcSet={`${HERO_IMG} 1920w`}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Reverse Aging & Reclaim Your Energy in Just One Day
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed"
          >
            Discover the science-backed strategies that 500+ people have used to break free from fatigue, reclaim their vitality, and build the life they've always wanted.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-6 text-white/80 text-sm"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal" />
              <span>Saturday, June 20, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal" />
              <span>9:00 AM – 6:00 PM PDT</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal" />
              <span>UC San Diego Park & Market</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2: PROBLEM (StoryBrand: The Problem)
   ═══════════════════════════════════════════════════════════════ */
function ProblemSection() {
  return (
    <section id="problem" className="py-20 bg-charcoal-light">
      <div className="container mx-auto px-4">
        <AnimatedSection className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            You're Not Alone in This Struggle
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Most people accept fatigue, aging, and chronic illness as inevitable. They wake up tired, struggle through the day, and go to bed wondering if this is all life has to offer.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Flame, title: "Constant Fatigue", desc: "No matter how much you sleep, you wake up exhausted" },
            { icon: Brain, title: "Brain Fog", desc: "Struggling to focus and remember things clearly" },
            { icon: Heart, title: "Health Declining", desc: "Watching your body age faster than it should" },
          ].map((item, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="bg-charcoal border border-white/10 rounded-xl p-6 text-center hover:border-teal/30 transition-all">
                <item.icon className="w-12 h-12 text-gold mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/60">{item.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* About image with truth callout */}
        <AnimatedSection className="mt-16 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <img
                src={ABOUT_IMG}
                alt="Optimal Health Summit attendees learning"
                className="w-full h-full object-cover"
                loading="lazy"
                width="600"
                height="400"
              />
            </div>
            <div className="bg-charcoal border border-white/10 rounded-xl p-8">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <p className="text-white/80 text-lg">
                    <strong className="text-gold">Here's the truth:</strong> You've been told to "just exercise more" and "eat better," but nobody's shown you the <em>science</em> behind what actually works. Without the right knowledge and support, you're left spinning your wheels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 3: GUIDE (StoryBrand: The Guide — Speakers with Photos)
   ═══════════════════════════════════════════════════════════════ */
function GuideSection() {
  return (
    <section className="py-20 bg-charcoal">
      <div className="container mx-auto px-4">
        <AnimatedSection className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-teal text-sm font-semibold uppercase tracking-widest mb-4 block">Your Expert Guides</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            But You Don't Have To Figure This Out Alone
          </h2>
          <p className="text-xl text-white/70">
            Meet the world-class experts who've spent 200+ years combined researching and implementing the strategies that actually work.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {SPEAKERS.map((speaker, i) => (
            <AnimatedSection key={i} delay={i * 0.06}>
              <div className="bg-charcoal-light border border-white/8 rounded-xl overflow-hidden hover:border-teal/30 transition-all duration-300 hover:-translate-y-1 group h-full flex flex-col">
                <div className="relative w-full aspect-square overflow-hidden bg-charcoal">
                  <img
                    src={speaker.photo}
                    alt={speaker.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width="200"
                    height="200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-light via-transparent to-transparent"></div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-white mb-1">{speaker.name}</h3>
                  <p className="text-teal text-xs font-semibold mb-2 leading-snug">{speaker.role}</p>
                  <p className="text-white/60 text-sm leading-relaxed flex-grow">{speaker.description}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 4: PLAN (StoryBrand: The Plan — Learning Modules)
   ═══════════════════════════════════════════════════════════════ */
function PlanSection() {
  const modules = [
    {
      num: "1",
      title: "The Biology of Aging",
      speaker: "Joel Huizinga",
      outcomes: ["Understand why you age faster than you should", "Discover the 3 biological switches that control aging", "Learn the science-backed interventions that work"],
    },
    {
      num: "2",
      title: "Optimize Your Hormones",
      speaker: "Dr. Nick Delgado",
      outcomes: ["Balance hormones naturally without synthetic drugs", "Increase energy and vitality in 30 days", "Reclaim your sexual health and confidence"],
    },
    {
      num: "3",
      title: "Heal Your Brain",
      speaker: "Dr. Chelsea Grow",
      outcomes: ["Eliminate brain fog and mental fatigue", "Improve focus, memory, and cognitive performance", "Prevent neurodegenerative disease"],
    },
    {
      num: "4",
      title: "Build Lasting Relationships",
      speaker: "Dr. Elena Eustache",
      outcomes: ["Deepen your connections with loved ones", "Attract the right people into your life", "Create a fulfilling social life"],
    },
  ];

  return (
    <section className="py-20 bg-charcoal-light">
      <div className="container mx-auto px-4">
        <AnimatedSection className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Here's Exactly What You'll Learn
          </h2>
          <p className="text-xl text-white/70">
            A proven, step-by-step system to reverse aging, boost energy, and transform your health in just one day.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {modules.map((module, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="bg-charcoal border border-white/10 rounded-xl p-8 hover:border-teal/30 transition-all h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal/20 to-gold/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-gold">{module.num}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{module.title}</h3>
                    <p className="text-teal text-sm font-semibold">{module.speaker}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {module.outcomes.map((outcome, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                      <span className="text-white/80">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 5: IRRESISTIBLE OFFER (Russell Brunson Framework)
   — with vendor lounge image
   ═══════════════════════════════════════════════════════════════ */
function IrresistibleOfferSection({ onGetStarted }: { onGetStarted: () => void }) {
  const includes = [
    "9+ hours of live expert training",
    "Networking with 120+ like-minded health-conscious attendees",
    "Exclusive speaker resources (downloadable guides, checklists, protocols)",
    "30-day post-summit email sequence with daily action steps",
    "Private community access for 3 months",
    "Breakfast, lunch & snacks",
    "Expo hall access with cutting-edge health vendors",
    "After-event networking social",
  ];

  return (
    <section className="py-20 bg-charcoal">
      <div className="container mx-auto px-4">
        <AnimatedSection className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-teal/20 to-gold/10 border-2 border-teal/50 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Your Complete Health Transformation Toolkit
              </h2>
              <p className="text-xl text-white/80">
                Everything you need to reverse aging, reclaim your energy, and build the healthy life you deserve.
              </p>
            </div>

            {/* What's Included with Vendor Image */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-charcoal/50 border border-white/10 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">What's Included:</h3>
                <div className="space-y-3">
                  {includes.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                      <span className="text-white/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-white/10">
                <img
                  src={VENDOR_IMG}
                  alt="Health vendor expo hall"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width="600"
                  height="400"
                />
              </div>
            </div>

            {/* The Mechanism */}
            <div className="bg-charcoal/50 border border-white/10 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">The Mechanism:</h3>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal/30 flex items-center justify-center flex-shrink-0 text-teal font-bold">1</div>
                  <div>
                    <p className="text-white font-semibold">Attend the live summit</p>
                    <p className="text-white/60 text-sm">Immerse yourself in 9+ hours of expert training and networking</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal/30 flex items-center justify-center flex-shrink-0 text-teal font-bold">2</div>
                  <div>
                    <p className="text-white font-semibold">Follow the 30-day action plan</p>
                    <p className="text-white/60 text-sm">Receive daily emails with specific steps to implement what you learned</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal/30 flex items-center justify-center flex-shrink-0 text-teal font-bold">3</div>
                  <div>
                    <p className="text-white font-semibold">Transform your health</p>
                    <p className="text-white/60 text-sm">Experience increased energy, better sleep, clearer thinking, and renewed vitality</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Satisfaction Guarantee */}
            <div className="bg-charcoal/50 border-2 border-gold/50 rounded-xl p-8 mb-8 text-center">
              <Shield className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">100% Satisfaction Guarantee</h3>
              <p className="text-white/80 mb-4">
                Attend the entire summit. If you don't feel like it was worth your investment, we'll refund 100% of your ticket price within 7 days. No questions asked.
              </p>
              <p className="text-white/60 text-sm">
                That's how confident we are that this will transform your life.
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={onGetStarted}
                className="px-10 py-4 bg-gold text-charcoal font-bold rounded-lg hover:bg-gold/90 transition-all text-lg shadow-lg"
              >
                Claim Your Spot Now
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 6: TESTIMONIALS CAROUSEL (Social Proof)
   ═══════════════════════════════════════════════════════════════ */
function Testimonials() {
  const testimonials = [
    { quote: "This was the most impactful health event I've attended. The speakers were world-class and the information was immediately actionable. I left with a completely new perspective on my health.", name: "Sarah M.", title: "Functional Medicine Patient", stars: 5 },
    { quote: "I've been to dozens of health conferences. This one stands out because every single speaker delivered real, science-backed strategies — not fluff. Worth every penny and more.", name: "James T.", title: "Biohacker & Entrepreneur", stars: 5 },
    { quote: "The networking alone was worth the ticket price. I connected with a neurologist and a longevity scientist in the same afternoon. My health journey changed that day.", name: "Dr. Priya K.", title: "Integrative Medicine Physician", stars: 5 },
    { quote: "I was skeptical at first, but the 100% satisfaction guarantee made it easy to say yes. I didn't need it — the event exceeded every expectation. Already bought my VIP ticket for next year.", name: "Michael R.", title: "VIP Attendee", stars: 5 },
    { quote: "Sid curated an incredible lineup. The combination of cutting-edge science and practical wellness strategies was exactly what I needed. My energy levels have been transformed.", name: "Lisa W.", title: "Health Coach", stars: 5 },
  ];
  const [current, setCurrent] = useState(0);
  const total = testimonials.length;
  useEffect(() => {
    const id = setInterval(() => setCurrent(c => (c + 1) % total), 5000);
    return () => clearInterval(id);
  }, [total]);
  const prev = () => setCurrent(c => (c - 1 + total) % total);
  const next = () => setCurrent(c => (c + 1) % total);
  const t = testimonials[current];
  return (
    <section className="py-20 md:py-28 bg-charcoal-light overflow-hidden">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="text-teal text-sm font-semibold uppercase tracking-widest mb-4 block">What Attendees Say</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Real People. <span className="text-teal">Real Results.</span>
            </h2>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <div className="relative max-w-3xl mx-auto">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="bg-charcoal border border-white/8 rounded-2xl p-8 md:p-12 text-center"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-lg md:text-xl text-white/85 font-[family-name:var(--font-display)] italic leading-relaxed mb-8">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="font-bold text-white text-sm">{t.name}</p>
                <p className="text-teal text-xs mt-0.5">{t.title}</p>
              </div>
            </motion.div>
            <div className="flex items-center justify-center gap-4 mt-8">
              <button onClick={prev} aria-label="Previous testimonial" className="w-9 h-9 rounded-full border border-white/20 hover:border-teal/60 text-white/50 hover:text-teal transition-all flex items-center justify-center">
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)} aria-label={`Go to testimonial ${i + 1}`} className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-teal w-6' : 'bg-white/20 hover:bg-white/40'}`} />
                ))}
              </div>
              <button onClick={next} aria-label="Next testimonial" className="w-9 h-9 rounded-full border border-white/20 hover:border-teal/60 text-white/50 hover:text-teal transition-all flex items-center justify-center">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 7: ATTENDEE TESTIMONIALS GRID
   ═══════════════════════════════════════════════════════════════ */
function AttendeeTestimonials() {
  const testimonials = [
    { quote: "This was the most impactful health event I've attended. The speakers were world-class and the information was immediately actionable. I left with a completely new perspective on my health.", name: "Sarah M.", title: "Functional Medicine Patient", stars: 5 },
    { quote: "I've been to dozens of health conferences. This one stands out because every single speaker delivered real, science-backed strategies — not fluff. Worth every penny and more.", name: "James T.", title: "Biohacker & Entrepreneur", stars: 5 },
    { quote: "The networking alone was worth the ticket price. I connected with a neurologist and a longevity scientist in the same afternoon. My health journey changed that day.", name: "Dr. Priya K.", title: "Integrative Medicine Physician", stars: 5 },
    { quote: "I was skeptical at first, but the 100% satisfaction guarantee made it easy to say yes. I didn't need it — the event exceeded every expectation. Already bought my VIP ticket for next year.", name: "Michael R.", title: "VIP Attendee", stars: 5 },
    { quote: "Sid curated an incredible lineup. The combination of cutting-edge science and practical wellness strategies was exactly what I needed. My energy levels have been transformed.", name: "Lisa W.", title: "Health Coach", stars: 5 },
    { quote: "The venue was perfect, the food was delicious, and the energy was electric. I made connections that will last a lifetime. Can't wait for next year!", name: "David K.", title: "Entrepreneur", stars: 5 },
  ];
  return (
    <section className="py-20 md:py-28 bg-charcoal">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-teal text-sm font-semibold uppercase tracking-widest mb-4 block">
              Attendee Success Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              What <span className="text-teal">Previous Attendees</span> Experienced
            </h2>
            <p className="text-white/60 text-lg">
              Real testimonials from people who transformed their health at the Optimal Health Summit.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <div className="bg-charcoal-light border border-white/8 rounded-xl p-6 h-full flex flex-col hover:border-teal/30 transition-all duration-300 hover:-translate-y-1">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-6 flex-grow">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="border-t border-white/5 pt-4">
                  <p className="font-bold text-white text-sm">{testimonial.name}</p>
                  <p className="text-teal text-xs mt-1">{testimonial.title}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 8: SCHEDULE (Event Timeline)
   ═══════════════════════════════════════════════════════════════ */
function ScheduleSection() {
  const scheduleItems = [
    { time: "8:30 AM", title: "Registration & Breakfast", description: "Check-in, network with attendees, enjoy a nutritious breakfast", speaker: "", icon: "☕" },
    { time: "9:30 AM", title: "Opening Keynote: The Biology of Aging", description: "Discover the 3 biological switches that control aging and what you can do about them today", speaker: "Joel Huizinga", icon: "🧬" },
    { time: "10:30 AM", title: "Optimize Your Hormones for Peak Performance", description: "Learn how to naturally balance your hormones to boost energy, metabolism, and vitality", speaker: "Dr. Nick Delgado", icon: "⚡" },
    { time: "11:30 AM", title: "Break & Networking", description: "Connect with speakers and fellow attendees in the expo hall", speaker: "", icon: "🤝" },
    { time: "12:00 PM", title: "Nutrition Secrets from the World's Healthiest Cultures", description: "Practical dietary strategies that have kept populations healthy for generations", speaker: "Dr. Mark Hyman", icon: "🥗" },
    { time: "1:00 PM", title: "Lunch & Expo Hall", description: "Enjoy lunch while exploring cutting-edge health vendors and products", speaker: "", icon: "🍽️" },
    { time: "2:00 PM", title: "Biohacking Your Sleep for Recovery & Longevity", description: "Science-backed strategies to improve sleep quality and accelerate cellular repair", speaker: "Joel Huizinga", icon: "😴" },
    { time: "3:00 PM", title: "Exercise & Movement for Longevity", description: "The most effective exercise protocols for building strength, flexibility, and living longer", speaker: "Dr. Nick Delgado", icon: "💪" },
    { time: "4:00 PM", title: "Break & Expo", description: "Recharge and explore vendor booths", speaker: "", icon: "🔄" },
    { time: "4:30 PM", title: "Mental Health & Stress Mastery", description: "Proven techniques to reduce stress, improve mental clarity, and build emotional resilience", speaker: "Jill Wheaton", icon: "🧠" },
    { time: "5:30 PM", title: "Panel Discussion: Your Questions Answered", description: "Direct Q&A with all speakers about health, aging, and your personal wellness journey", speaker: "All Speakers", icon: "🎤" },
    { time: "6:30 PM", title: "After-Event Networking Social", description: "Connect with speakers, vendors, and fellow health enthusiasts in a relaxed setting", speaker: "", icon: "🎉" },
  ];

  return (
    <section className="py-20 bg-charcoal-light">
      <div className="container mx-auto px-4">
        <AnimatedSection className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Event Schedule
          </h2>
          <p className="text-xl text-white/70">
            A full day of transformative learning, networking, and health breakthroughs.
          </p>
          <p className="text-teal font-semibold mt-4">Saturday, June 20, 2026 &bull; UC San Diego Park & Market</p>
          <p className="text-white/50 text-sm mt-2">*Schedule subject to change</p>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {scheduleItems.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.03}>
                <div className="bg-charcoal border border-white/10 rounded-xl p-6 hover:border-teal/30 transition-all">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="text-3xl">{item.icon}</div>
                      <div className="text-teal font-bold text-sm mt-2 whitespace-nowrap">{item.time}</div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-white/70 mb-2">{item.description}</p>
                      {item.speaker && (
                        <p className="text-teal text-sm font-semibold">Speaker: {item.speaker}</p>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <AnimatedSection className="max-w-3xl mx-auto text-center mt-12">
          <div className="bg-gradient-to-r from-teal/10 to-gold/10 border border-teal/30 rounded-xl p-8">
            <p className="text-white/80 mb-4">
              <span className="font-bold text-teal">Note:</span> This is a full-day event with breaks built in for networking, meals, and vendor exploration. Virtual attendees will receive live streaming of all sessions and lifetime access to recordings.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 9: FAQ (Address Objections)
   ═══════════════════════════════════════════════════════════════ */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: "Is this for me if I'm not a health expert?", a: "Absolutely! This summit is designed for anyone who wants to feel better, have more energy, and live a healthier life. You don't need any prior knowledge. The speakers will explain everything in practical, easy-to-understand terms." },
    { q: "What if I can't attend in person?", a: "No problem! We offer a Virtual Ticket that includes live streaming of all sessions plus lifetime access to recordings. You'll get everything except the in-person networking and meals." },
    { q: "How do I know this will actually work for me?", a: "We offer a 100% Satisfaction Guarantee. Attend the entire summit, and if you don't feel it was worth your investment, we'll refund your ticket price within 7 days. We're confident in the value we deliver." },
    { q: "What's the refund policy?", a: "You have 7 days after the summit to request a full refund if you're not satisfied. We also offer a 100% satisfaction guarantee—if you don't see value, you get your money back." },
    { q: "Can I access the recordings after the summit?", a: "Yes! All attendees get lifetime access to the recordings. You can watch them as many times as you want, share them with friends, and refer back to them whenever you need." },
    { q: "Will I get support after the summit?", a: "Yes! All ticket holders receive a 30-day email sequence with daily action steps. General and VIP attendees also get 3 months of private community access where you can ask questions and connect with other attendees." },
  ];

  return (
    <section className="py-20 bg-charcoal">
      <div className="container mx-auto px-4">
        <AnimatedSection className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-white/70">
            Got questions? We've got answers.
          </p>
        </AnimatedSection>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <div className="bg-charcoal-light border border-white/10 rounded-xl overflow-hidden hover:border-teal/30 transition-all">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-charcoal/50 transition-all"
                >
                  <h3 className="text-lg font-bold text-white text-left">{faq.q}</h3>
                  <ChevronRight className={`w-5 h-5 text-teal transition-transform ${openIndex === i ? 'rotate-90' : ''}`} />
                </button>
                {openIndex === i && (
                  <div className="px-6 py-4 bg-charcoal/50 border-t border-white/10">
                    <p className="text-white/80">{faq.a}</p>
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 10: FINAL CTA (Urgency-Driven Close with Networking Image)
   ═══════════════════════════════════════════════════════════════ */
function FinalCTASection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background networking image */}
      <div className="absolute inset-0 z-0">
        <img
          src={NETWORK_IMG}
          alt="Networking at the summit"
          className="w-full h-full object-cover"
          loading="lazy"
          width="1920"
          height="1080"
        />
        <div className="absolute inset-0 bg-charcoal/85"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <AnimatedSection className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Don't Let Another Day Go By Feeling Tired & Stuck
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join 120+ people transforming their health this June. Early bird pricing ends April 24.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={onGetStarted}
              className="px-10 py-4 bg-gold text-charcoal font-bold rounded-lg hover:bg-gold/90 transition-all text-lg shadow-lg"
            >
              Claim Your Spot Now
            </button>
            <button
              onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 bg-teal/30 text-teal font-bold rounded-lg hover:bg-teal/40 border border-teal/50 transition-all text-lg"
            >
              Learn More
            </button>
          </div>

          <p className="text-white/60 text-sm">
            <span className="font-bold text-teal">100% Satisfaction Guarantee:</span> Attend the entire summit. If you don't feel like it was worth your investment, we'll refund 100% of your ticket price within 7 days. No questions asked.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER WITH SOCIAL MEDIA & POLICY MODALS
   ═══════════════════════════════════════════════════════════════ */
function Footer() {
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);

  return (
    <>
      <footer className="bg-charcoal-light border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            <div className="flex items-center gap-2">
              <img src={LOGO_IMG} alt="Optimal Health Summit" className="h-6 w-auto rounded-lg" loading="lazy" width="24" height="24" />
              <span className="font-[family-name:var(--font-display)] text-sm font-bold text-white/60">
                Optimal Health Summit 2026
              </span>
            </div>

            <div className="flex items-center gap-8">
              {[
                { icon: Instagram, href: "https://instagram.com/OptimalHealthSummit" },
                { icon: Facebook, href: "https://facebook.com/events/s/optimal-health-summit-2nd-annu/1257572565745799/" },
                { icon: Youtube, href: "https://youtube.com/@EnablingTransformations" },
                { icon: Linkedin, href: "https://www.linkedin.com/company/optimalhealthsummit/" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/30 hover:text-teal transition-colors"
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
              {/* X (Twitter) Icon */}
              <a
                href="https://x.com/TheCerebrum2020"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-teal transition-colors"
                title="Follow us on X"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.694-5.857 6.694H2.562l7.746-8.868-8.176-10.632h6.506l4.759 6.278 5.328-6.278zM17.002 18.807h1.844L6.803 3.469H4.751l12.251 15.338z" />
                </svg>
              </a>
              <button
                onClick={() => setShowContactModal(true)}
                className="text-white/30 hover:text-teal transition-colors"
                title="Send us an email"
              >
                <Mail className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center md:items-start gap-2 text-xs text-white/30">
              <div className="flex gap-4">
                <button onClick={() => setShowRefundPolicy(true)} className="hover:text-teal transition-colors cursor-pointer">
                  Refund and Cancellation Policy
                </button>
                <button onClick={() => setShowPrivacyPolicy(true)} className="hover:text-teal transition-colors cursor-pointer">
                  Privacy Policy
                </button>
                <button onClick={() => setShowTermsOfService(true)} className="hover:text-teal transition-colors cursor-pointer">
                  Terms of Service
                </button>
              </div>
              <a href="https://EnablingTransformations.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal transition-colors">&copy; Enabling Transformations</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Refund Policy Modal */}
      {showRefundPolicy && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal border border-white/10 rounded-xl max-w-2xl max-h-[80vh] overflow-y-auto p-8">
            <h3 className="text-4xl font-bold text-white mb-4">Refund and Cancellation Policy</h3>
            <div className="text-white/70 space-y-4 text-sm">
              <p><strong>Cancellation and refund policy:</strong></p>
              <p>All tickets are fully refundable up to 7 days before the event. However, if you have any concerns or need assistance, please contact us by responding to the ticket purchase confirmation email. Take advantage of the lower ticket prices now before they sell out or go up — completely risk free.</p>
              <p><strong>All tickets include a 100% satisfaction guarantee:</strong></p>
              <p>Attend the entire summit. If you don't feel like it was worth your investment, we'll refund 100% of your ticket price within 7 days. No questions asked.</p>
            </div>
            <button onClick={() => setShowRefundPolicy(false)} className="mt-6 w-full bg-teal hover:bg-teal-dark text-charcoal font-bold py-2 rounded-lg transition-all">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal border border-white/10 rounded-xl max-w-2xl max-h-[80vh] overflow-y-auto p-8">
            <h3 className="text-4xl font-bold text-white mb-4">Privacy Policy</h3>
            <div className="text-white/70 space-y-4 text-sm">
              <p><strong>Information We Collect</strong></p>
              <p>We collect information you provide directly to us, such as when you purchase tickets or contact us. This may include your name, email address, phone number, and payment information.</p>
              <p><strong>How We Use Your Information</strong></p>
              <p>We use the information we collect to process your ticket purchase, send you event updates, and improve our services. We do not share your personal information with third parties without your consent.</p>
            </div>
            <button onClick={() => setShowPrivacyPolicy(false)} className="mt-6 w-full bg-teal hover:bg-teal-dark text-charcoal font-bold py-2 rounded-lg transition-all">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsOfService && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal border border-white/10 rounded-xl max-w-2xl max-h-[80vh] overflow-y-auto p-8">
            <h3 className="text-4xl font-bold text-white mb-4">Terms of Service</h3>
            <div className="text-white/70 space-y-4 text-sm">
              <p><strong>Acceptance of Terms</strong></p>
              <p>By accessing and using this website and purchasing tickets to the Optimal Health Summit 2026, you accept and agree to be bound by the terms and provision of this agreement.</p>
              <p><strong>Use License</strong></p>
              <p>Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose or for any public display.</p>
            </div>
            <button onClick={() => setShowTermsOfService(false)} className="mt-6 w-full bg-teal hover:bg-teal-dark text-charcoal font-bold py-2 rounded-lg transition-all">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal border border-white/10 rounded-xl max-w-md p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Contact Us</h3>
            <p className="text-white/70 mb-4">Have questions? Reach out to us:</p>
            <a href="mailto:info@optimalhealthsummit.com" className="text-teal hover:text-teal/80 font-semibold">info@optimalhealthsummit.com</a>
            <button onClick={() => setShowContactModal(false)} className="mt-6 w-full bg-teal hover:bg-teal-dark text-charcoal font-bold py-2 rounded-lg transition-all">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN HOME COMPONENT
   StoryBrand Flow: Hero → Problem → Guide → Plan → Offer →
   Testimonials → Attendee Stories → Schedule → FAQ → Final CTA
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  return (
    <div className="bg-charcoal min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_IMG} alt="Logo" className="h-8" />
            <span className="text-white font-bold text-lg">Optimal Health Summit 2026</span>
          </div>
          <button
            onClick={() => setTicketModalOpen(true)}
            className="px-6 py-2 bg-gold text-charcoal font-bold rounded-lg hover:bg-gold/90 transition-all"
          >
            Get Tickets
          </button>
        </div>
      </nav>

      {/* Main Content — StoryBrand + Irresistible Offer Flow */}
      <Hero onGetStarted={() => setTicketModalOpen(true)} />
      <ProblemSection />
      <GuideSection />
      <PlanSection />
      <IrresistibleOfferSection onGetStarted={() => setTicketModalOpen(true)} />
      <Testimonials />
      <AttendeeTestimonials />
      <ScheduleSection />
      <FAQSection />
      <FinalCTASection onGetStarted={() => setTicketModalOpen(true)} />

      {/* Footer */}
      <Footer />

      {/* Ticket Modal */}
      <TicketModal open={ticketModalOpen} onClose={() => setTicketModalOpen(false)} />
    </div>
  );
}
