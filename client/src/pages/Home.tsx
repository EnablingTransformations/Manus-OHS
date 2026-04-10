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

const LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/logo_8918fb42.png";
const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/optimized_hero-indoor-event-KrrdMyWTYYS3XvJpxKsfmU_b437920b.webp";
const ABOUT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/optimized_about-section-FjfkLYDPAMLJEw2wv8icUB_1302a822.webp";
const VENDOR_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/vendor-lounge-Lnf3VgZrMeCcZntU8h3i6k.webp";
const NETWORK_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/networking-U9Kbfvkn9i5po8BrKMyg9L.webp";

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
          <button onClick={onClose} className="text-white/50 hover:text-white text-2xl">×</button>
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

/* ─── HERO SECTION (Redesigned with StoryBrand) ─── */
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
          srcSet="https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/optimized_hero-indoor-event-KrrdMyWTYYS3XvJpxKsfmU_b437920b.webp 1920w"
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

/* ─── PROBLEM SECTION (StoryBrand: The Problem) ─── */
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

        <AnimatedSection className="mt-12 bg-charcoal border border-white/10 rounded-xl p-8 max-w-3xl mx-auto">
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <p className="text-white/80 text-lg">
                <strong className="text-gold">Here's the truth:</strong> You've been told to "just exercise more" and "eat better," but nobody's shown you the <em>science</em> behind what actually works. Without the right knowledge and support, you're left spinning your wheels.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── GUIDE SECTION (StoryBrand: The Guide) ─── */
function GuideSection() {
  return (
    <section className="py-20 bg-charcoal">
      <div className="container mx-auto px-4">
        <AnimatedSection className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            But You Don't Have To Figure This Out Alone
          </h2>
          <p className="text-xl text-white/70">
            Meet the world-class experts who've spent 200+ years combined researching and implementing the strategies that actually work.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <AnimatedSection delay={0}>
            <div className="bg-charcoal-light border border-white/10 rounded-xl p-6 hover:border-teal/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal/20 to-gold/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-8 h-8 text-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Jill Wheaton</h3>
                  <p className="text-teal text-sm font-semibold mb-2">Tony Robbins Director of Winning Strategies</p>
                  <p className="text-white/60 text-sm">Bringing world-class winning strategies and peak performance strategies from the Tony Robbins organization.</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="bg-charcoal-light border border-white/10 rounded-xl p-6 hover:border-teal/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal/20 to-gold/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-8 h-8 text-gold" />
                </div>
                <div>
      <h3 className="text-lg font-bold text-white mb-2">Jewel Huizinga</h3>
              <p className="text-teal text-sm font-semibold mb-2">Expert in Aging Biology</p>
              <p className="text-white/60 text-sm">Pioneering research and practical strategies for reversing aging at the cellular level.</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="bg-charcoal-light border border-white/10 rounded-xl p-6 hover:border-teal/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal/20 to-gold/10 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-8 h-8 text-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Dr. Nick Delgado</h3>
                  <p className="text-teal text-sm font-semibold mb-2">Bestselling Author & Performance Expert</p>
                  <p className="text-white/60 text-sm">Pioneering expert in hormones, longevity, and peak human performance with decades of research.</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="bg-charcoal-light border border-white/10 rounded-xl p-6 hover:border-teal/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal/20 to-gold/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-8 h-8 text-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Dr. Chelsea Grow</h3>
                  <p className="text-teal text-sm font-semibold mb-2">Board Certified Neurologist</p>
                  <p className="text-white/60 text-sm">Specializing in brain health, cognitive performance, and neurological wellness strategies.</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection className="mt-12 text-center">
          <p className="text-white/70 text-lg">
            <strong className="text-gold">Plus 4 more world-class speakers</strong> sharing cutting-edge strategies in longevity, relationships, and transformational science.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── PLAN SECTION (StoryBrand: The Plan) ─── */
function PlanSection() {
  const modules = [
    {
      num: "1",
      title: "The Biology of Aging",
      speaker: "Jewel Huizinga",
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

/* ─── IRRESISTIBLE OFFER SECTION (Russell Brunson Framework) ─── */
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
        <AnimatedSection className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-teal/20 to-gold/10 border-2 border-teal/50 rounded-2xl p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Complete Health Transformation Toolkit
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Everything you need to reverse aging, reclaim your energy, and build the healthy life you deserve.
            </p>

            <div className="bg-charcoal/50 border border-white/10 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">What's Included:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                {includes.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-charcoal/50 border border-white/10 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">The Mechanism:</h3>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal/30 flex items-center justify-center flex-shrink-0 text-teal font-bold">1</div>
                  <div>
                    <p className="text-white font-semibold">Attend the live summit</p>
                    <p className="text-white/60 text-sm">Immerse yourself in 10+ hours of expert training and networking</p>
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

            <div className="bg-charcoal/50 border-2 border-gold/50 rounded-xl p-8 mb-8">
              <Shield className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">100% Satisfaction Guarantee</h3>
              <p className="text-white/80 mb-4">
                Attend the entire summit. If you don't feel like it was worth your investment, we'll refund 100% of your ticket price within 7 days. No questions asked.
              </p>
              <p className="text-white/60 text-sm">
                That's how confident we are that this will transform your life.
              </p>
            </div>

            <button
              onClick={onGetStarted}
              className="px-10 py-4 bg-gold text-charcoal font-bold rounded-lg hover:bg-gold/90 transition-all text-lg shadow-lg"
            >
              Claim Your Spot Now
            </button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── SOCIAL PROOF SECTION (By the Numbers) ─── */
function SocialProofSection() {
  const stats = [
    { number: "500+", label: "Attendees Across All Summits" },
    { number: "95%", label: "Satisfaction Rate" },
    { number: "10+", label: "Hours of Expert Content" },
    { number: "8", label: "World-Class Speakers" },
  ];

  return (
    <section className="py-20 bg-charcoal-light">
      <div className="container mx-auto px-4">
        <AnimatedSection className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            By the Numbers
          </h2>
          <p className="text-xl text-white/70">
            Join hundreds of people who've already transformed their health.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="bg-charcoal border border-white/10 rounded-xl p-8 text-center hover:border-teal/30 transition-all">
                <div className="text-5xl font-bold text-gold mb-2">{stat.number}</div>
                <p className="text-white/70">{stat.label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SCHEDULE SECTION (Event Timeline) ─── */
function ScheduleSection() {
  const scheduleItems = [
    {
      time: "8:00 AM",
      title: "Registration & Breakfast",
      description: "Check-in, network with attendees, enjoy a nutritious breakfast",
      speaker: "",
      icon: "☕",
    },
    {
      time: "9:00 AM",
      title: "Opening Keynote: The Biology of Aging",
      description: "Discover the 3 biological switches that control aging and what you can do about them today",
      speaker: "Jewel Huizinga",
      icon: "🧬",
    },
    {
      time: "10:00 AM",
      title: "Optimize Your Hormones for Peak Performance",
      description: "Learn how to naturally balance your hormones to boost energy, metabolism, and vitality",
      speaker: "Dr. Nick Delgado",
      icon: "⚡",
    },
    {
      time: "11:00 AM",
      title: "Break & Networking",
      description: "Connect with speakers and fellow attendees in the expo hall",
      speaker: "",
      icon: "🤝",
    },
    {
      time: "11:30 AM",
      title: "Nutrition Secrets from the World's Healthiest Cultures",
      description: "Practical dietary strategies that have kept populations healthy for generations",
      speaker: "Dr. Mark Hyman",
      icon: "🥗",
    },
    {
      time: "12:30 PM",
      title: "Lunch & Expo Hall",
      description: "Enjoy lunch while exploring cutting-edge health vendors and products",
      speaker: "",
      icon: "🍽️",
    },
    {
      time: "1:30 PM",
      title: "Biohacking Your Sleep for Recovery & Longevity",
      description: "Science-backed strategies to improve sleep quality and accelerate cellular repair",
      speaker: "Jewel Huizinga",
      icon: "😴",
    },
    {
      time: "2:30 PM",
      title: "Exercise & Movement for Longevity",
      description: "The most effective exercise protocols for building strength, flexibility, and living longer",
      speaker: "Dr. Nick Delgado",
      icon: "💪",
    },
    {
      time: "3:30 PM",
      title: "Break & Expo",
      description: "Recharge and explore vendor booths",
      speaker: "",
      icon: "🔄",
    },
    {
      time: "4:00 PM",
      title: "Mental Health & Stress Mastery",
      description: "Proven techniques to reduce stress, improve mental clarity, and build emotional resilience",
      speaker: "Jill Wheaton",
      icon: "🧠",
    },
    {
      time: "5:00 PM",
      title: "Panel Discussion: Your Questions Answered",
      description: "Direct Q&A with all speakers about health, aging, and your personal wellness journey",
      speaker: "All Speakers",
      icon: "🎤",
    },
    {
      time: "6:00 PM",
      title: "After-Event Networking Social",
      description: "Connect with speakers, vendors, and fellow health enthusiasts in a relaxed setting",
      speaker: "",
      icon: "🎉",
    },
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
          <p className="text-teal font-semibold mt-4">Saturday, June 20, 2026 • UC San Diego Park & Market</p>
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

/* ─── FAQ SECTION (Address Objections) ─── */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Is this for me if I'm not a health expert?",
      a: "Absolutely! This summit is designed for anyone who wants to feel better, have more energy, and live a healthier life. You don't need any prior knowledge. The speakers will explain everything in practical, easy-to-understand terms.",
    },
    {
      q: "What if I can't attend in person?",
      a: "No problem! We offer a Virtual Ticket that includes live streaming of all sessions plus lifetime access to recordings. You'll get everything except the in-person networking and meals.",
    },
    {
      q: "How do I know this will actually work for me?",
      a: "We offer a 100% Satisfaction Guarantee. Attend the entire summit, and if you don't feel it was worth your investment, we'll refund your ticket price within 7 days. We're confident in the value we deliver.",
    },
    {
      q: "What's the refund policy?",
      a: "You have 7 days after the summit to request a full refund if you're not satisfied. We also offer a 100% satisfaction guarantee—if you don't see value, you get your money back.",
    },
    {
      q: "Can I access the recordings after the summit?",
      a: "Yes! All attendees get lifetime access to the recordings. You can watch them as many times as you want, share them with friends, and refer back to them whenever you need.",
    },
    {
      q: "Will I get support after the summit?",
      a: "Yes! All ticket holders receive a 30-day email sequence with daily action steps. General and VIP attendees also get 3 months of private community access where you can ask questions and connect with other attendees.",
    },
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

/* ─── FINAL CTA SECTION (Urgency-Driven Close) ─── */
function FinalCTASection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="py-20 bg-gradient-to-br from-charcoal-light to-charcoal">
      <div className="container mx-auto px-4">
        <AnimatedSection className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Don't Let Another Day Go By Feeling Tired & Stuck
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join 150 people transforming their health this June. Early bird pricing ends April 24.
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
            100% Satisfaction Guarantee
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── MAIN HOME COMPONENT ─── */
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

      {/* Main Content */}
      <Hero onGetStarted={() => setTicketModalOpen(true)} />
      <ProblemSection />
      <GuideSection />
      <PlanSection />
      <IrresistibleOfferSection onGetStarted={() => setTicketModalOpen(true)} />
      <ScheduleSection />
      <FAQSection />
      <FinalCTASection onGetStarted={() => setTicketModalOpen(true)} />

      {/* Footer */}
      <footer className="bg-charcoal-light border-t border-white/10 py-12">
        <div className="container mx-auto px-4 text-center text-white/60">
          <p>© 2026 Optimal Health Summit. All rights reserved.</p>
          <p className="mt-2 text-sm">
            <a href="#" className="hover:text-white transition">Privacy Policy</a> • 
            <a href="#" className="hover:text-white transition"> Terms of Service</a> • 
            <a href="#" className="hover:text-white transition"> Contact</a>
          </p>
        </div>
      </footer>

      {/* Ticket Modal */}
      <TicketModal open={ticketModalOpen} onClose={() => setTicketModalOpen(false)} />
    </div>
  );
}
