/**
 * Optimal Health Summit - Landing Page
 * Design: "Vitality Noir" — Editorial Health Magazine Aesthetic
 * Dark charcoal base, teal accents, gold CTAs, Playfair Display + DM Sans
 */

import { useEffect, useRef, useState } from "react";
import { useForm, ValidationError } from '@formspree/react';
import { motion, useInView } from "framer-motion";
import { trpc } from "@/lib/trpc";
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
} from "lucide-react";

const LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/logo_8918fb42.png";
const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/hero-indoor-event-KrrdMyWTYYS3XvJpxKsfmU.webp";
const ABOUT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/about-section-FjfkLYDPAMLJEw2wv8icUB.webp";
const VENDOR_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/vendor-lounge-Lnf3VgZrMeCcZntU8h3i6k.webp";
const NETWORK_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/networking-U9Kbfvkn9i5po8BrKMyg9L.webp";

/* ─── Ticket Modal ─── */
function TicketModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const tiers = [
    {
      name: "Virtual Ticket",
      id: "virtual" as const,
      price: "$49",
      badge: "7 Left",
      highlight: false,
      note: "Available until Jun 26",
      features: ["Live stream and recordings", "Ask questions during sessions via chat"],
    },
    {
      name: "General Admission",
      id: "general" as const,
      price: "$97",
      badge: "5 Left",
      highlight: true,
      note: "Early access pricing until Apr 24",
      features: ["Nutritious breakfast, lunch & snacks", "All keynote presentations & panels", "Expo hall access", "Networking with 120+ attendees", "After-event networking social"],
    },
    {
      name: "VIP Admission",
      id: "vip" as const,
      price: "$247",
      badge: "2 Left",
      highlight: false,
      note: "Early access pricing until Apr 24",
      features: ["Everything in General Admission", "Reserved front-row seating", "Private lunch with speakers", "PCM blood test (valued at $200)", "Microbiome assessment kit (save $90)", "Complimentary premium supplement"],
    },
  ];

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const createCheckout = trpc.stripe.createCheckoutSession.useMutation();

  const handleBuy = async (ticketId: "virtual" | "general" | "vip") => {
    setLoadingId(ticketId);
    try {
      const result = await createCheckout.mutateAsync({ ticketId, origin: window.location.origin });
      if (result.url) {
        window.open(result.url, "_blank");
        onClose();
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Choose Your Experience</h2>
            <p className="text-white/50 text-sm mt-1">Secure your seat — prices increase as the event approaches</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-2xl leading-none">&times;</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map(tier => (
            <div
              key={tier.id}
              className={`relative rounded-xl p-5 border flex flex-col gap-4 ${
                tier.highlight
                  ? "border-teal/50 bg-teal/5 ring-1 ring-teal/30"
                  : "border-white/10 bg-white/3"
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal text-charcoal text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
              )}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-semibold text-base">{tier.name}</h3>
                  <p className="text-white/40 text-xs mt-0.5">{tier.note}</p>
                </div>
                <span className="text-xs font-medium bg-white/10 text-white/60 px-2 py-0.5 rounded-full">{tier.badge}</span>
              </div>
              <div className="text-3xl font-bold text-white">{tier.price}</div>
              <ul className="space-y-1.5 flex-1">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-white/60 text-xs">
                    <span className="text-teal mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleBuy(tier.id)}
                disabled={loadingId !== null}
                className={`w-full text-center font-semibold text-sm py-3 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${
                  tier.highlight
                    ? "bg-gold hover:bg-gold-dark text-charcoal shadow-lg shadow-gold/15"
                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                }`}
              >
                {loadingId === tier.id ? "Redirecting..." : "Get Ticket — " + tier.price}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-white/30 text-xs mt-5">
          Standard pricing begins April 25 — General at $127 and VIP at $297. Group discounts available with code "group".
        </p>
      </div>
    </div>
  );
}

const TICKET_ID_MAP: Record<string, "virtual" | "general" | "vip"> = {
  "Virtual Ticket": "virtual",
  "General Admission": "general",
  "VIP Admission": "vip",
};

/* ─── Ticket Buy Button with Stripe Checkout ─── */
function TicketButton({ tier }: { tier: { name: string; highlight: boolean } }) {
  const [loading, setLoading] = useState(false);
  const createCheckout = trpc.stripe.createCheckoutSession.useMutation();

  const handleBuy = async () => {
    const ticketId = TICKET_ID_MAP[tier.name];
    if (!ticketId) return;
    setLoading(true);
    try {
      const result = await createCheckout.mutateAsync({
        ticketId,
        origin: window.location.origin,
      });
      if (result.url) {
        window.open(result.url, "_blank");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Unable to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className={`w-full text-center font-semibold text-sm py-3.5 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${
        tier.highlight
          ? "bg-gold hover:bg-gold-dark text-charcoal shadow-lg shadow-gold/15"
          : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
      }`}
    >
      {loading ? "Redirecting..." : "Get Ticket"}
    </button>
  );
}

/* ─── Reusable animated section wrapper ─── */
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

/* ─── Navigation ─── */
function Navbar({ onOpenTickets }: { onOpenTickets: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-charcoal/90 backdrop-blur-xl shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between py-4">
        <a href="#" className="flex items-center gap-2">
          <img src={LOGO_IMG} alt="Optimal Health Summit" className="h-8 w-auto rounded-lg" />
          <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-white">
            Optimal Health <span className="text-teal">Summit</span>
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <a href="#about" className="hover:text-teal transition-colors">About</a>
          <a href="#topics" className="hover:text-teal transition-colors">Topics</a>
          <a href="#speakers" className="hover:text-teal transition-colors">Speakers</a>
          <a href="#tickets" className="hover:text-teal transition-colors">Tickets</a>
          <a href="#venue" className="hover:text-teal transition-colors">Venue</a>
        </div>
        <button
          onClick={onOpenTickets}
          className="bg-gold hover:bg-gold-dark text-charcoal font-semibold text-sm px-5 py-2.5 rounded-lg transition-all hover:scale-105 active:scale-95"
        >
          Get Tickets
        </button>
      </div>
    </nav>
  );
}

/* ─── Hero Section ─── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-end pb-20 md:pb-28 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={HERO_IMG} alt="Optimal Health Summit" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/50 to-transparent" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl pt-16 md:pt-24"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-6">
            Optimal<br />
            Health<br />
            <span className="text-teal">Summit 2026</span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-xl mb-8 leading-relaxed">
            A powerful, immersive, full-day wellness experience designed to elevate your health physically, mentally, emotionally, and spiritually.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-10 text-white/60 text-sm">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal" />
              Saturday, June 27, 2026
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal" />
              9:00 AM – 6:00 PM PDT
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal" />
              UC San Diego Park & Market
            </span>
          </div>

          <div className="border-l-2 border-teal/50 pl-5">
            <p className="text-xl md:text-2xl text-white/90 font-[family-name:var(--font-display)] italic leading-snug">
              "One day can change the trajectory of your health forever."
            </p>
            <p className="text-sm text-teal mt-2 font-medium">150 seats only — Will you be one of them?</p>
          </div>
        </motion.div>
      </div>

      {/* Decorative accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal/40 to-transparent" />
    </section>
  );
}

/* ─── Stats Bar ─── */
function StatsBar() {
  const stats = [
    { value: "120+", label: "Attendees & Experts" },
    { value: "8+", label: "Expert Speakers" },
    { value: "9", label: "Hours of Content" },
    { value: "100%", label: "Satisfaction Guarantee" },
  ];
  return (
    <section className="relative bg-charcoal-light border-y border-white/5">
      <div className="container py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-teal font-[family-name:var(--font-display)]">
                  {stat.value}
                </div>
                <div className="text-sm text-white/50 mt-1">{stat.label}</div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── About Section ─── */
function About() {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <AnimatedSection>
            <div>
              <span className="text-teal text-sm font-semibold uppercase tracking-widest mb-4 block">
                About the Summit
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Step Into Your<br />
                <span className="text-teal">Optimal Health</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                This event is for anyone who refuses to settle — from wellness-curious beginners to experienced biohackers, health professionals, entrepreneurs, and executives who want to live and perform at their highest level.
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                You'll be guided by a dynamic lineup of expert speakers, each a leader in their field and passionate about helping you unlock your next level of performance, clarity, and vitality.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Zap, text: "More Energy" },
                  { icon: Brain, text: "Sharper Focus" },
                  { icon: Shield, text: "Stronger Body" },
                  { icon: Heart, text: "Deeper Relationships" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5">
                    <item.icon className="w-5 h-5 text-teal shrink-0" />
                    <span className="text-sm text-white/80">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="relative">
              <img
                src={ABOUT_IMG}
                alt="Keynote speaker on stage"
                className="rounded-xl w-full aspect-[16/10] object-cover shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-charcoal-light border border-teal/20 rounded-xl p-5 shadow-xl max-w-[260px]">
                <div className="text-gold font-bold text-lg font-[family-name:var(--font-display)]">
                  100% Satisfaction
                </div>
                <p className="text-white/50 text-sm mt-1">
                  All tickets are refundable up to 7 days before the event.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─── Topics Section ─── */
function Topics() {
  const topics = [
    { icon: Flame, title: "Biohacking & Longevity", desc: "Inflammation, Oxidative Stress, Age Reversal" },
    { icon: Zap, title: "Hormones & Metabolism", desc: "Peptides, Stem Cells, Weight Optimization" },
    { icon: Heart, title: "Mind-Body-Soul", desc: "Relationships, Love & Dating" },
    { icon: Brain, title: "NLP & Resilience", desc: "Neuro-Linguistic Programming, Emotional Strength" },
    { icon: Shield, title: "Mobility & Strength", desc: "Flexibility, Musculoskeletal, Marginal Decade" },
    { icon: Sparkles, title: "Gut Health & Detox", desc: "Mold, Lyme, Cellular Energy & Vitality" },
  ];

  return (
    <section id="topics" className="py-20 md:py-28 bg-charcoal-light">
      <div className="container">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-teal text-sm font-semibold uppercase tracking-widest mb-4 block">
              What You'll Learn
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Expert-Led <span className="text-teal">Topics</span>
            </h2>
            <p className="text-white/50 text-lg">
              Learn from experts and connect with high performers about the topics that matter most to your health journey.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topics.map((topic, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <div className="group p-6 rounded-xl bg-charcoal border border-white/5 hover:border-teal/20 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-lg bg-teal/10 flex items-center justify-center mb-4 group-hover:bg-teal/20 transition-colors">
                  <topic.icon className="w-6 h-6 text-teal" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{topic.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{topic.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.4}>
          <p className="text-center text-white/40 text-sm mt-10">
            Plus: Artificial Intelligence (AI) & Your Health, and more topics including audience Q&A.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Speakers Section ─── */
function Speakers() {
  const speakers = [
    { name: "Jill Wheaton", role: "Tony Robbins Director of Biz Solutions", photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/jill_orig_66011278.jpg" },
    { name: "Dr. Neville Campbell", role: "MD, MBA, CEO, Author, IFBB Pro Athlete", photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/neville_orig_1d65cb31.png" },
    { name: "Dr. Nick Delgado", role: "Bestselling Author, Performance Expert", photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/nick_orig_5e4d9c47.jpg" },
    { name: "Dr. Chelsea Grow", role: "Board Certified Neurologist", photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/chelsea_orig_32d9a244.png" },
    { name: "Joel Huizenga", role: "CEO at EgaCeutical, Longevity Scientist", photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/joel_orig_a0eaf0a8.jpg" },
    { name: "Dr. Elena Eustache", role: "Love Doctor, Global Matchmaker, TV Host", photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/elena_orig_d56f8765.jpg" },
    { name: "Dr. Karolina Pras", role: "Root-Cause Medicine", photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/karolina_orig_df8b24e4.png" },
    { name: "Surprise Speaker", role: "To Be Announced", photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/surprise_orig_c13178f5.jpg" },
  ];

  return (
    <section id="speakers" className="py-20 md:py-28">
      <div className="container">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-teal text-sm font-semibold uppercase tracking-widest mb-4 block">
              The Lineup
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Summit <span className="text-teal">Speakers</span>
            </h2>
            <p className="text-white/50 text-lg">
              A dynamic lineup of expert speakers, each a leader in their field.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {speakers.map((speaker, i) => (
            <AnimatedSection key={i} delay={i * 0.06}>
              <div className="group text-center p-5 rounded-xl bg-charcoal-light border border-white/5 hover:border-teal/20 transition-all duration-300">
                <div className="w-24 h-24 mx-auto rounded-full mb-4 border-2 border-white/10 group-hover:border-teal/40 transition-colors overflow-hidden">
                  <img
                    src={speaker.photo}
                    alt={speaker.name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.classList.add('bg-gradient-to-br', 'from-teal/20', 'to-gold/10', 'flex', 'items-center', 'justify-center');
                      }
                    }}
                  />
                </div>
                <h3 className="text-sm md:text-base font-bold text-white mb-1">{speaker.name}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{speaker.role}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Tickets Section ─── */
function Tickets() {
  const tiers = [
    {
      name: "Virtual Ticket",
      price: "$49",
      badge: "7 Left",
      highlight: false,
      features: [
        "Live stream and recordings",
        "Ask questions during sessions via chat",
      ],
      available: "Available until Jun 26",
    },
    {
      name: "General Admission",
      price: "$97",
      badge: "5 Left",
      highlight: true,
      features: [
        "Nutritious breakfast, lunch & snacks",
        "All keynote presentations & panels",
        "Expo hall access",
        "Networking with 120+ attendees",
        "After-event networking social",
      ],
      available: "Early access pricing until Apr 24",
    },
    {
      name: "VIP Admission",
      price: "$247",
      badge: "2 Left",
      highlight: false,
      features: [
        "Everything in General Admission",
        "Reserved front-row seating",
        "Private lunch with speakers",
        "PCM blood test (valued at $200)",
        "Microbiome assessment kit (save $90)",
        "Complimentary premium supplement",
      ],
      available: "Early access pricing until Apr 24",
    },
  ];

  return (
    <section id="tickets" className="py-20 md:py-28 bg-charcoal-light">
      <div className="container">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-gold text-sm font-semibold uppercase tracking-widest mb-4 block">
              Limited Availability
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Choose Your <span className="text-gold">Experience</span>
            </h2>
            <p className="text-white/50 text-lg">
              Ticket prices increase as the event date approaches. Secure your seat early for the best price.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <AnimatedSection key={i} delay={i * 0.12}>
              <div
                className={`relative rounded-xl p-6 md:p-8 border transition-all duration-300 hover:-translate-y-1 h-full flex flex-col ${
                  tier.highlight
                    ? "bg-gradient-to-b from-teal/10 to-charcoal border-teal/30 shadow-lg shadow-teal/5"
                    : "bg-charcoal border-white/5 hover:border-white/10"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-teal text-charcoal text-xs font-bold rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                    {tier.badge && (
                      <span className="text-xs font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                        {tier.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white font-[family-name:var(--font-display)]">
                      {tier.price}
                    </span>
                  </div>
                  <p className="text-white/30 text-xs mt-2">{tier.available}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-white/60">
                      <div className="w-4 h-4 rounded-full bg-teal/15 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <TicketButton tier={tier} />
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.4}>
          <p className="text-center text-white/40 text-sm mt-10 max-w-lg mx-auto">
            Standard pricing begins April 25 — General at $127 and VIP at $297. Group discounts available with code "group".
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Why Attend Section ─── */
function WhyAttend() {
  const reasons = [
    { icon: Star, title: "Expert Insights", desc: "Proven strategies from leaders in health and performance" },
    { icon: Zap, title: "Actionable Tools", desc: "Practical steps you can apply immediately" },
    { icon: Users, title: "Elite Networking", desc: "Connect with growth-minded, health-focused individuals" },
    { icon: Utensils, title: "Fuel Included", desc: "Breakfast, lunch, snacks, and energy for the entire day" },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <AnimatedSection delay={0.1}>
            <div className="relative">
              <img
                src={NETWORK_IMG}
                alt="Networking at the summit"
                className="rounded-xl w-full aspect-[3/2] object-cover shadow-2xl"
              />
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div>
              <span className="text-teal text-sm font-semibold uppercase tracking-widest mb-4 block">
                Why Attend
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
                Rise to Your<br />
                <span className="text-teal">Next Level</span>
              </h2>

              <div className="space-y-5">
                {reasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                      <reason.icon className="w-5 h-5 text-teal" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">{reason.title}</h3>
                      <p className="text-white/50 text-sm">{reason.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─── Vendor Lounge Section ─── */
function VendorLounge() {
  return (
    <section className="py-20 md:py-28 bg-charcoal-light">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <AnimatedSection>
            <div>
              <span className="text-teal text-sm font-semibold uppercase tracking-widest mb-4 block">
                Experience More
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Vendor Experience<br />
                <span className="text-teal">Lounge</span>
              </h2>
              <p className="text-white/60 leading-relaxed mb-8">
                Explore an immersive wellness expo featuring hands-on health assessments, cutting-edge products, and rejuvenating services.
              </p>

              <div className="space-y-3">
                {[
                  "Massage Therapy & Chiropractic Adjustments",
                  "Metabolic Testing (included with VIP)",
                  "PCM Blood Testing (included with VIP)",
                  "Electrolyte Drinks & Clean Protein Bars",
                  "Additional wellness vendors coming soon",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/60 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <img
              src={VENDOR_IMG}
              alt="Vendor Experience Lounge"
              className="rounded-xl w-full aspect-[16/10] object-cover shadow-2xl"
            />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─── Impact Section ─── */
function Impact() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-gold text-sm font-semibold uppercase tracking-widest mb-4 block">
              Make a Difference
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Make an Impact <span className="text-gold">Together</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              10% of ticket-sale revenue (after expenses) will be donated to a charity nominated by the attendees. Your investment in yourself extends the impact of the Summit beyond the event itself.
            </p>

            <div className="grid sm:grid-cols-2 gap-5 max-w-xl mx-auto">
              <div className="p-5 rounded-xl bg-charcoal-light border border-white/5">
                <Gift className="w-8 h-8 text-gold mx-auto mb-3" />
                <h3 className="text-sm font-bold text-white mb-1">Charity Donation</h3>
                <p className="text-white/40 text-xs">10% of revenue donated to attendee-nominated charity</p>
              </div>
              <div className="p-5 rounded-xl bg-charcoal-light border border-white/5">
                <Heart className="w-8 h-8 text-gold mx-auto mb-3" />
                <h3 className="text-sm font-bold text-white mb-1">Scholarship Tickets</h3>
                <p className="text-white/40 text-xs">Available for individuals reversing obesity or type-2 diabetes</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Venue Section ─── */
function Venue() {
  return (
    <section id="venue" className="py-20 md:py-28 bg-charcoal-light">
      <div className="container">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-teal text-sm font-semibold uppercase tracking-widest mb-4 block">
                The Venue
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                UC San Diego Park & Market, <span className="text-teal">San Diego, CA</span>
              </h2>
              <p className="text-white/50 text-lg">
                1100 Market St, San Diego, CA 92101, USA
              </p>
            </div>

            <div className="rounded-xl overflow-hidden border border-white/5 bg-charcoal">
              <iframe
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=UC+San+Diego+Park+%26+Market,+San+Diego,+CA&zoom=15"
              />
              <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-white font-bold text-lg">UC San Diego Park & Market</h3>
                  <p className="text-white/40 text-sm">1100 Market St, San Diego, CA 92101</p>
                </div>
                <p className="text-white/30 text-sm max-w-sm">
                  This year's venue is at least twice as large, allowing for a more engaging and comfortable experience.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── FinalCTA Section ─── */
function FinalCTA() {
  const [finalCtaTicketOpen, setFinalCtaTicketOpen] = useState(false);
  return (<section className="py-20 md:py-28 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal/8 via-transparent to-gold/5" />

      <div className="container relative z-10">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              This Year's Summit<br />
              <span className="text-gold">Will Sell Out Again</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-4 max-w-xl mx-auto">
              Space is limited, and ticket prices increase as the event date approaches. Secure your seat early to lock in the lowest price.
            </p>
            <p className="text-white/40 text-sm mb-10">
              Full refund available up to 7 days before the event.
            </p>

            <button
              onClick={() => setFinalCtaTicketOpen(true)}
              className="inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-charcoal font-bold text-lg px-10 py-5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gold/20"
            >
              Get Your Tickets Now
              <ArrowRight className="w-6 h-6" />
            </button>
            <TicketModal open={finalCtaTicketOpen} onClose={() => setFinalCtaTicketOpen(false)} />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}



/* ─── Footer ─── */
function ContactModal({ onClose }: { onClose: () => void }) {
  const [state, handleFormspreeSubmit] = useForm('mzdkpgpw');
  const [emailConfirm, setEmailConfirm] = useState("");
  const [emailError, setEmailError] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email !== emailConfirm) {
      setEmailError("Email addresses do not match.");
      return;
    }
    setEmailError("");
    await handleFormspreeSubmit(e);
  };

  if (state.succeeded) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-charcoal border border-white/10 rounded-xl max-w-md p-8 text-center">
          <div className="text-teal text-5xl mb-4">✓</div>
          <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
          <p className="text-white/60 mb-6">Thank you! We'll get back to you soon.</p>
          <button onClick={onClose} className="w-full bg-teal hover:bg-teal-dark text-charcoal font-bold py-3 rounded-lg transition-all">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-charcoal border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
        <h3 className="text-2xl font-bold text-white mb-4">Get In Touch</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Honeypot */}
          <input type="text" name="_gotcha" style={{ display: 'none' }} />
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/60 mb-2">Your Name</label>
            <input id="name" type="text" name="name" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-teal/50 focus:ring-1 focus:ring-teal/30 transition-all" placeholder="John Doe" />
            <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-400 text-xs mt-1" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-2">Email Address</label>
            <input id="email" type="email" name="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-teal/50 focus:ring-1 focus:ring-teal/30 transition-all" placeholder="john@example.com" />
            <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-xs mt-1" />
          </div>
          <div>
            <label htmlFor="emailConfirm" className="block text-sm font-medium text-white/60 mb-2">Verify Email Address</label>
            <input id="emailConfirm" type="email" required value={emailConfirm} onChange={e => { setEmailConfirm(e.target.value); setEmailError(""); }} className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 transition-all ${emailError ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/30" : "border-white/10 focus:border-teal/50 focus:ring-teal/30"}`} placeholder="Confirm your email" />
            {emailError && <p className="text-red-400 text-xs mt-1">{emailError}</p>}
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-white/60 mb-2">Message</label>
            <textarea id="message" name="message" required rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-teal/50 focus:ring-1 focus:ring-teal/30 transition-all resize-none" placeholder="Tell us what you're interested in..." />
            <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-400 text-xs mt-1" />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={state.submitting} className="flex-1 inline-flex items-center justify-center gap-2 bg-teal hover:bg-teal-dark text-charcoal font-bold text-sm py-3.5 px-8 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
              {state.submitting ? "Sending..." : "Send Message"}
              <Send className="w-4 h-4" />
            </button>
            <button type="button" onClick={onClose} className="px-6 bg-white/5 hover:bg-white/10 text-white font-bold text-sm py-3.5 rounded-lg transition-all">Close</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Footer() {
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <button
              onClick={() => setShowRefundPolicy(true)}
              className="md:hidden text-xs text-white/30 hover:text-teal transition-colors cursor-pointer mb-1"
            >
              Refund and Cancellation Policy
            </button>
            <div className="flex items-center gap-2">
              <img src={LOGO_IMG} alt="Optimal Health Summit" className="h-6 w-auto rounded-lg" />
              <span className="font-[family-name:var(--font-display)] text-sm font-bold text-white/60">
                Optimal Health Summit
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {[
              { icon: Instagram, href: "https://instagram.com/OptimalHealthSummit" },
              { icon: Facebook, href: "https://facebook.com/events/s/optimal-health-summit-2nd-annu/1257572565745799/" },
              { icon: Youtube, href: "https://youtube.com/@EnablingTransformations" },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-teal transition-colors"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
            <button
              onClick={() => setShowContactModal(true)}
              className="text-white/30 hover:text-teal transition-colors"
              title="Send us an email"
            >
              <Mail className="w-4 h-4" />
            </button>
          </div>

      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}

          <div className="flex flex-col items-center md:items-end gap-2 text-xs text-white/30">
            <button
              onClick={() => setShowRefundPolicy(true)}
              className="hover:text-teal transition-colors cursor-pointer"
            >
              Refund and Cancellation Policy
            </button>
            <span>Enabling Transformations</span>
          </div>
        </div>
      </div>

      {/* Refund Policy Modal */}
      {showRefundPolicy && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal border border-white/10 rounded-xl max-w-2xl max-h-[80vh] overflow-y-auto p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Refund and Cancellation Policy</h3>
            <div className="text-white/70 space-y-4 text-sm">
              <p><strong>Cancellation and refund policy:</strong></p>
              <p>All tickets are fully refundable up to 7 days before the event. However, if you have any concerns or need assistance, please contact us by responding to the ticket purchase confirmation email. Take advantage of the lower ticket prices now before they sell out or go up — completely risk free.</p>
              <p><strong>All tickets include a 100% satisfaction guarantee:</strong></p>
              <p>Check in on time and attend at least the first 3 hours to experience enough of the event to fairly evaluate its value. And if you feel the event isn't worth your time, you must speak with Sid (the host) in person before leaving, and before the lunch break or 1pm, and you will receive a full refund.</p>
            </div>
            <button
              onClick={() => setShowRefundPolicy(false)}
              className="mt-6 w-full bg-teal hover:bg-teal-dark text-charcoal font-bold py-2 rounded-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-charcoal">
      <TicketModal open={ticketModalOpen} onClose={() => setTicketModalOpen(false)} />
      <Navbar onOpenTickets={() => setTicketModalOpen(true)} />
      <Hero />
      <StatsBar />
      <About />
      <Topics />
      <Speakers />
      <Tickets />
      <WhyAttend />
      <VendorLounge />
      <Impact />
      <Venue />
      <FinalCTA />
      <Footer />
    </div>
  );
}
