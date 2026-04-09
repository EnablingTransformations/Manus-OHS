/**
 * Optimal Health Summit - Landing Page
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
      name: "Virtual Ticket",
      id: "virtual" as const,
      price: "$49",
      badge: "7 Left",
      highlight: false,
      note: "Available until Jun 26",
      features: ["Live stream and recordings", "Ask questions during sessions via chat"],
    },
    {
      name: "Advanced Access General",
      id: "general" as const,
      price: "$97",
      badge: "5 Left",
      highlight: true,
      note: "Early access pricing until Apr 24",
      features: ["Nutritious breakfast, lunch & snacks", "All keynote presentations & panels", "Expo hall access", "Networking with 120+ attendees", "After-event networking social"],
    },
    {
      name: "Advanced Access VIP",
      id: "vip" as const,
      price: "$247",
      badge: "2 Left",
      highlight: false,
      note: "Early access pricing until Apr 24",
      features: ["Everything in Advanced Access General", "Reserved front-row seating", "Private lunch with speakers", "PCM blood test (valued at $200)", "Microbiome assessment kit (save $100)", "Complimentary premium supplement"],
    },
  ];

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [optInSms, setOptInSms] = useState(false);
  const createCheckout = trpc.stripe.createCheckoutSession.useMutation();

  const handleBuy = async (ticketId: "virtual" | "general" | "vip") => {
    setLoadingId(ticketId);
    try {
      // Validate phone number if SMS opt-in is selected
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

      // Track AddToCart event for Facebook
      if (window.fbq) {
        const priceMap = { virtual: 49, general: 97, vip: 247 };
        window.fbq('track', 'AddToCart', {
          content_name: `${ticketId.charAt(0).toUpperCase() + ticketId.slice(1)} Ticket`,
          content_type: 'ticket',
          value: priceMap[ticketId],
          currency: 'USD'
        });
      }
      
      // Track InitiateCheckout event immediately
      if (window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
          content_name: `${ticketId.charAt(0).toUpperCase() + ticketId.slice(1)} Ticket`,
          content_type: 'ticket'
        });
      }
      
      // Close modal immediately for faster UX
      onClose();
      
      // Fetch checkout URL in background
      const result = await createCheckout.mutateAsync({ ticketId, origin: window.location.origin, phoneNumber, optInSms });
      if (result.url) {
        // Open Stripe checkout in a new tab
        window.open(result.url, '_blank');
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

        {/* SMS Opt-in Section */}
        <div className="bg-white/5 border border-teal/30 rounded-lg p-4 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Phone Number (Optional)</label>
              <input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-teal/50 focus:ring-1 focus:ring-teal/30"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={optInSms}
                onChange={(e) => setOptInSms(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/10 cursor-pointer accent-teal"
              />
              <span className="text-white/80 text-sm">
                <span className="font-semibold text-teal">Get 10% off</span> — Opt in to SMS updates about the event
              </span>
            </label>
            {optInSms && phoneNumber && (
              <div className="bg-teal/10 border border-teal/30 rounded px-3 py-2 text-teal text-xs">
                ✓ You'll save ${(optInSms ? (phoneNumber ? 'up to 10%' : '10%') : '0%')} on your ticket
              </div>
            )}
          </div>
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
              <div>
                <h3 className="text-white font-semibold text-base">{tier.name}</h3>
                <p className="text-white/40 text-xs mt-0.5">{tier.note}</p>
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

        <p className="text-center text-white text-xs mt-5">
          Standard pricing begins April 25 — General at $127 and VIP at $297.
        </p>
      </div>
    </div>
  );
}

const TICKET_ID_MAP: Record<string, "virtual" | "general" | "vip"> = {
  "Virtual Ticket": "virtual",
  "Advanced Access General": "general",
  "Advanced Access VIP": "vip",
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
        window.open(result.url, '_blank');
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
          <img src={LOGO_IMG} alt="Optimal Health Summit" className="h-8 w-auto rounded-lg" loading="lazy" width="32" height="32" />
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
          <a href="/referral" className="hover:text-teal transition-colors">Refer & Earn</a>
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

/* ─── Countdown Timer Hook ─── */
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = targetDate.getTime() - Date.now();
    return diff > 0 ? diff : 0;
  });
  useEffect(() => {
    const tick = () => {
      const diff = targetDate.getTime() - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, expired: timeLeft === 0 };
}

/* ─── Hero Section ─── */
function Hero() {
  const [eventDate] = useState(() => new Date('2026-06-20T09:00:00-07:00'));
  const { days, hours, minutes, seconds } = useCountdown(eventDate);
  return (
    <section className="relative min-h-screen flex items-end pb-20 md:pb-28 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={HERO_IMG} alt="Optimal Health Summit" className="w-full h-full object-cover" loading="eager" fetchPriority="high" width="1920" height="1072" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/50 to-transparent" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl pt-2 md:pt-24"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-6">
            Optimal<br />
            Health<br />
            <span className="text-teal">Summit 2026</span>
          </h1>

          <p className="text-base md:text-xl font-bold text-white max-w-xl mb-8 leading-relaxed">
            Most people accept fatigue, aging, and chronic illness as inevitable.<br />
            They're wrong — and this one day event can change everything.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-10 text-white/60 text-sm">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal" />
              Saturday, June 20, 2026
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal" />
              9:00 AM – 6:00 PM PDT
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal" />
              UC San Diego Park & Market, San Diego, CA
            </span>
          </div>

          {/* Countdown Timer */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { value: days, label: 'Days' },
              { value: hours, label: 'Hours' },
              { value: minutes, label: 'Minutes' },
              { value: seconds, label: 'Seconds' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-charcoal/70 border border-teal/30 rounded-xl backdrop-blur-sm">
                <span className="text-2xl md:text-3xl font-bold text-teal font-[family-name:var(--font-display)] leading-none tabular-nums">
                  {String(value).padStart(2, '0')}
                </span>
                <span className="text-[10px] md:text-xs text-white/50 uppercase tracking-widest mt-1">{label}</span>
              </div>
            ))}
          </div>

          <div className="border-l-2 border-teal/50 pl-5">
            <p className="text-xl md:text-2xl text-white/90 font-[family-name:var(--font-display)] italic leading-snug">
              "One day can change the trajectory of your PRECIOUS health forever."
            </p>
            <p className="text-sm text-teal mt-2 font-medium">Limited to 150 seats only — Will you be one of them?</p>
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
  const [showSatisfactionGuarantee, setShowSatisfactionGuarantee] = useState(false);
  const stats = [
    { value: "120+", label: "Attendees & Experts" },
    { value: "8+", label: "Expert Speakers" },
    { value: "9", label: "Hours of Content" },
    { value: "100%", label: "Satisfaction Guarantee", clickable: true },
  ];
  return (
    <section className="relative bg-charcoal-light border-y border-white/5">
      <div className="container py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div 
                className={`text-center ${stat.clickable ? 'cursor-pointer' : ''}`}
                onClick={() => stat.clickable && setShowSatisfactionGuarantee(true)}
              >
                <div className="text-3xl md:text-4xl font-bold text-teal font-[family-name:var(--font-display)]">
                  {stat.value}
                </div>
                <div className={`text-sm mt-1 ${stat.clickable ? 'text-white/70 hover:text-white transition-colors' : 'text-white/50'}`}>
                  {stat.label}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Satisfaction Guarantee Modal */}
      {showSatisfactionGuarantee && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal border border-white/10 rounded-xl max-w-2xl max-h-[80vh] overflow-y-auto p-8">
            <h3 className="text-2xl font-bold text-white mb-4">100% Satisfaction Guarantee</h3>
            <div className="text-white/70 space-y-4 text-sm">
              <p>All tickets are refundable up to 7 days before the event. However, if you have any concerns or need assistance, please contact us by responding to the ticket purchase confirmation email. Take advantage of the lower ticket prices now before they sell out or go up — completely risk free.</p>
              <p><strong>All tickets include a 100% satisfaction guarantee:</strong></p>
              <p>Check in on time and attend at least the first 3 hours to experience enough of the event to fairly evaluate its value. And if you feel the event isn't worth your time, you must speak with Sid (the host) in person before leaving, and before the lunch break or 1pm, and you will receive a full refund.</p>
            </div>
            <button
              onClick={() => setShowSatisfactionGuarantee(false)}
              className="mt-6 w-full bg-teal hover:bg-teal-dark text-charcoal font-bold py-2 rounded-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─── About Section ─── */
function About() {
  const [showSatisfactionGuarantee, setShowSatisfactionGuarantee] = useState(false);
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
                loading="lazy"
                alt="Keynote speaker on stage"
                className="rounded-xl w-full aspect-[16/10] object-cover shadow-2xl"
                width="1920"
                height="1072"
                style={{width: '485px', height: '300px'}}
              />
              <button onClick={() => setShowSatisfactionGuarantee(true)} className="absolute top-0 left-0 right-0 bg-charcoal-light/95 border-b border-teal/20 px-6 py-3 hover:border-teal/40 transition-colors cursor-pointer text-left" style={{width: '484px', height: '57px'}}>
                <div className="text-gold font-bold text-sm font-[family-name:var(--font-display)]">
                  100% Satisfaction Guarantee
                </div>
                <p className="text-white/50 text-xs mt-0.5" style={{fontSize: '14px'}}>
                  And all tickets are refundable up to 7 days before the event.
                </p>
              </button>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Satisfaction Guarantee Modal */}
      {showSatisfactionGuarantee && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal border border-white/10 rounded-xl max-w-2xl max-h-[80vh] overflow-y-auto p-8">
            <h3 className="text-2xl font-bold text-white mb-4">100% Satisfaction Guarantee</h3>
            <div className="text-white/70 space-y-4 text-sm">
              <p>All tickets are refundable up to 7 days before the event. However, if you have any concerns or need assistance, please contact us by responding to the ticket purchase confirmation email. Take advantage of the lower ticket prices now before they sell out or go up — completely risk free.</p>
              <p><strong>All tickets include a 100% satisfaction guarantee:</strong></p>
              <p>Check in on time and attend at least the first 3 hours to experience enough of the event to fairly evaluate its value. And if you feel the event isn't worth your time, you must speak with Sid (the host) in person before leaving, and before the lunch break or 1pm, and you will receive a full refund.</p>
            </div>
            <button
              onClick={() => setShowSatisfactionGuarantee(false)}
              className="mt-6 w-full bg-teal hover:bg-teal-dark text-charcoal font-bold py-2 rounded-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
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
    { name: "Jill Wheaton", role: "Tony Robbins Director of Biz Solutions", description: "Bringing world-class business and peak performance strategies from the Tony Robbins organization.", photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/optimized_jill_fe80a2a8_9bfb699e.webp" },
    { name: "Dr. Neville Campbell", role: "MD, MBA, CEO, Philanthropist, Author, Professor & IFBB Pro Athlete", description: "A powerhouse at the intersection of medicine, business, and elite athletic performance.", photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/optimized_neville_63270edc_722d3dc4.webp" },
    { name: "Dr. Nick Delgado", role: "Bestselling Author & Performance Expert", description: "Pioneering expert in hormones, longevity, and peak human performance with decades of research.", photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/optimized_nick_463447a1_a7ead39c.webp" },
    { name: "Dr. Chelsea Grow", role: "Board Certified Neurologist", description: "Specializing in brain health, cognitive performance, and neurological wellness strategies.", photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/optimized_chelsea_66e66b08_9dd60fbd.webp" },
    { name: "Joel Huizenga", role: "CEO at EgaCeutical & Longevity Scientist", description: "Cutting-edge longevity science and breakthrough pharmaceutical solutions for age reversal.", photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/optimized_joel_40df6173_696d7490.webp" },
    { name: "Dr. Elena Eustache", role: "Love Doctor, Global Matchmaker, TV Host & Bestselling Author", description: "World-renowned expert in relationships, love, and the mind-body-soul connection.", photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/optimized_elena_77df9d4f_87ef3eb3.webp" },
    { name: "Dr. Karolina Pras", role: "Root-Cause Medicine", description: "Functional medicine physician uncovering the root causes of chronic illness for lasting health transformation.", photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/optimized_karolina_008f9417_d50db3b0.webp" },
    { name: "Surprise Speaker", role: "To Be Announced", description: "A very special guest will be revealed at the event — you won't want to miss it!", photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486084134/3RPVjQxNXJ7EgGkKFJaBsJ/optimized_surprise_f5b6e4df_2739b841.webp" },
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
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width="96"
                    height="96"
                    style={{ objectPosition: (speaker as any).objectPosition || 'center', transform: (speaker as any).scale ? `scale(${ (speaker as any).scale})` : 'scale(1)' }}
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
                <p className="text-white/50 text-xs font-medium leading-relaxed mb-2">{speaker.role}</p>
                <p className="text-white/40 text-xs leading-relaxed">{speaker.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials Section ─── */
function Testimonials() {
  const testimonials = [
    {
      quote: "This was the most impactful health event I've attended. The speakers were world-class and the information was immediately actionable. I left with a completely new perspective on my health.",
      name: "Sarah M.",
      title: "Functional Medicine Patient",
      stars: 5,
    },
    {
      quote: "I've been to dozens of health conferences. This one stands out because every single speaker delivered real, science-backed strategies — not fluff. Worth every penny and more.",
      name: "James T.",
      title: "Biohacker & Entrepreneur",
      stars: 5,
    },
    {
      quote: "The networking alone was worth the ticket price. I connected with a neurologist and a longevity scientist in the same afternoon. My health journey changed that day.",
      name: "Dr. Priya K.",
      title: "Integrative Medicine Physician",
      stars: 5,
    },
    {
      quote: "I was skeptical at first, but the 100% satisfaction guarantee made it easy to say yes. I didn't need it — the event exceeded every expectation. Already bought my VIP ticket for next year.",
      name: "Michael R.",
      title: "VIP Attendee",
      stars: 5,
    },
    {
      quote: "Sid curated an incredible lineup. The combination of cutting-edge science and practical wellness strategies was exactly what I needed. My energy levels have been transformed.",
      name: "Lisa W.",
      title: "Health Coach",
      stars: 5,
    },
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
    <section className="py-20 md:py-28 bg-charcoal overflow-hidden">
      <div className="container">
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
            {/* Quote card */}
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="bg-charcoal-light border border-white/8 rounded-2xl p-8 md:p-12 text-center"
            >
              {/* Stars */}
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

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="w-9 h-9 rounded-full border border-white/20 hover:border-teal/60 text-white/50 hover:text-teal transition-all flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === current ? 'bg-teal w-6' : 'bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="w-9 h-9 rounded-full border border-white/20 hover:border-teal/60 text-white/50 hover:text-teal transition-all flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Attendee Testimonials Grid Section ─── */
function AttendeeTestimonials() {
  const testimonials = [
    {
      quote: "This was the most impactful health event I've attended. The speakers were world-class and the information was immediately actionable. I left with a completely new perspective on my health.",
      name: "Sarah M.",
      title: "Functional Medicine Patient",
      stars: 5,
    },
    {
      quote: "I've been to dozens of health conferences. This one stands out because every single speaker delivered real, science-backed strategies — not fluff. Worth every penny and more.",
      name: "James T.",
      title: "Biohacker & Entrepreneur",
      stars: 5,
    },
    {
      quote: "The networking alone was worth the ticket price. I connected with a neurologist and a longevity scientist in the same afternoon. My health journey changed that day.",
      name: "Dr. Priya K.",
      title: "Integrative Medicine Physician",
      stars: 5,
    },
    {
      quote: "I was skeptical at first, but the 100% satisfaction guarantee made it easy to say yes. I didn't need it — the event exceeded every expectation. Already bought my VIP ticket for next year.",
      name: "Michael R.",
      title: "VIP Attendee",
      stars: 5,
    },
    {
      quote: "Sid curated an incredible lineup. The combination of cutting-edge science and practical wellness strategies was exactly what I needed. My energy levels have been transformed.",
      name: "Lisa W.",
      title: "Health Coach",
      stars: 5,
    },
    {
      quote: "The venue was perfect, the food was delicious, and the energy was electric. I made connections that will last a lifetime. Can't wait for next year!",
      name: "David K.",
      title: "Entrepreneur",
      stars: 5,
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-charcoal-light">
      <div className="container">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <div className="bg-charcoal border border-white/8 rounded-xl p-6 h-full flex flex-col hover:border-teal/30 transition-all duration-300 hover:-translate-y-1">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-white/80 text-sm leading-relaxed mb-6 flex-grow">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author */}
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

/* ─── 100% Satisfaction Guarantee Section ─── */
function SatisfactionGuaranteeSection() {
  return (
    <section className="py-16 md:py-24 bg-charcoal">
      <div className="container">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-teal/10 to-charcoal border border-teal/20 rounded-xl p-8 md:p-12 text-center">
            <div className="text-teal text-4xl mb-4 font-[family-name:var(--font-display)]">✓</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">100% Satisfaction Guarantee</h2>
            <p className="text-white/70 text-lg mb-6">
              All tickets are refundable up to 7 days before the event. However, if you have any concerns or need assistance, please contact us by responding to the ticket purchase confirmation email.
            </p>
            <p className="text-white/70 text-lg mb-6">
              <strong>Check in on time and attend at least the first 3 hours</strong> to experience enough of the event to fairly evaluate its value. If you feel the event isn't worth your time, speak with Sid (the host) in person before leaving and before the lunch break or 1pm, and you will receive a full refund.
            </p>
            <p className="text-teal font-semibold">
              Take advantage of the lower ticket prices now before they sell out or go up — completely risk free.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Tickets Section ─── */
function Tickets() {
  const tiers = [
    {
      name: "Advanced Access General",
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
      name: "Advanced Access VIP",
      price: "$247",
      badge: "2 Left",
      highlight: false,
      features: [
        "Everything in Advanced Access General",
        "Reserved front-row seating",
        "Private lunch with speakers",
        "PCM blood test (valued at $200)",
        "Microbiome assessment kit (save $100)",
        "Complimentary premium supplement",
      ],
      available: "Early access pricing until Apr 24",
    },
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
              Ticket prices increase as the event date approaches. 
Secure your seat early for the best price.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <AnimatedSection key={i} delay={i * 0.12}>
              <div
                className={`relative rounded-xl p-6 md:p-8 border transition-all duration-300 hover:-translate-y-1 h-full flex flex-col ${
                  tier.highlight
                    ? `bg-gradient-to-b from-teal/10 to-charcoal border-teal/30 shadow-lg shadow-teal/5 ${i === 0 ? 'md:col-start-2' : ''}`
                    : "bg-charcoal border-white/5 hover:border-white/10"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-teal text-charcoal text-xs font-bold rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <div className="mb-2">
                    <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white font-[family-name:var(--font-display)]">
                      {tier.price}
                    </span>
                  </div>
                  <p className="text-white text-xs mt-2">{tier.available}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-white">
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
          <p className="text-center text-white text-sm mt-10 max-w-lg mx-auto">
            Standard pricing begins April 25 — General at $127 and VIP at $297.
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
        <div className="grid lg:grid-cols-1 gap-12 lg:gap-20">
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

          <AnimatedSection delay={0.1}>
            <div className="relative">
              <img
                src={NETWORK_IMG}
                loading="lazy"
                alt="Networking at the summit"
                className="rounded-xl w-full aspect-[3/2] object-cover shadow-2xl"
                width="1920"
                height="1288"
              />
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
                    loading="lazy"
              alt="Vendor Experience Lounge"
              className="rounded-xl w-full aspect-[16/10] object-cover shadow-2xl"
              width="1920"
              height="1072"
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
/* ─── Toast Notification Hook ─── */
function useToast() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };
  return { toast, showToast };
}

/* ─── Copy to Clipboard Helper ─── */
function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
      .then(() => true)
      .catch(() => false);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return Promise.resolve(true);
    } catch {
      document.body.removeChild(textArea);
      return Promise.resolve(false);
    }
  }
}

function ContactModal({ onClose }: { onClose: () => void }) {
  const [state, handleFormspreeSubmit] = useForm('mzdkpgpw');
  const [emailConfirm, setEmailConfirm] = useState("");
  const [emailError, setEmailError] = useState("");
  const [email, setEmail] = useState("");
  const { toast, showToast } = useToast();
  const DISCOUNT_CODE = "OPTIMAL10";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email !== emailConfirm) {
      setEmailError("Email addresses do not match.");
      return;
    }
    setEmailError("");
    
    // Track Lead event for Facebook
    if (window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: 'Contact Form Submission',
        content_type: 'lead'
      });
    }
    
    await handleFormspreeSubmit(e);
  };

  if (state.succeeded) {
    const handleCopyCode = async () => {
      const success = await copyToClipboard(DISCOUNT_CODE);
      showToast(
        success ? `Code "${DISCOUNT_CODE}" copied to clipboard!` : 'Failed to copy code',
        success ? 'success' : 'error'
      );
    };

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-charcoal border border-white/10 rounded-xl max-w-md p-8 text-center">
          {toast && (
            <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-teal/20 text-teal border border-teal/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {toast.message}
            </div>
          )}
          <div className="text-teal text-5xl mb-4">✓</div>
          <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
          <p className="text-white/60 mb-6">We've received your email. Here's your exclusive discount code:</p>
          <div className="bg-charcoal-light border border-teal/30 rounded-lg p-4 mb-6">
            <p className="text-teal text-3xl font-bold font-mono tracking-widest">{DISCOUNT_CODE}</p>
            <p className="text-white/40 text-xs mt-2">10% off any ticket</p>
          </div>
          <button
            onClick={handleCopyCode}
            className="w-full bg-teal hover:bg-teal-dark text-charcoal font-bold py-3 rounded-lg transition-all mb-3"
          >
            Copy Code
          </button>
          <button onClick={onClose} className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-lg transition-all">Close</button>
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
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
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
              <img src={LOGO_IMG} alt="Optimal Health Summit" className="h-6 w-auto rounded-lg" loading="lazy" width="24" height="24" />
              <span className="font-[family-name:var(--font-display)] text-sm font-bold text-white/60">
                Optimal Health Summit
              </span>
            </div>
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

      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}

          <div className="flex flex-col items-center md:items-end gap-2 text-xs text-white/30">
            <div className="flex gap-4">
              <button
                onClick={() => setShowPrivacyPolicy(true)}
                className="hover:text-teal transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setShowTermsOfService(true)}
                className="hover:text-teal transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
            </div>
            <a href="https://EnablingTransformations.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal transition-colors">&copy; Enabling Transformations</a>
          </div>
        </div>
      </div>

      {/* Refund Policy Modal */}
      {showRefundPolicy && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal border border-white/10 rounded-xl max-w-2xl max-h-[80vh] overflow-y-auto p-8">
            <h3 className="text-4xl font-bold text-white mb-4">Refund and Cancellation Policy</h3>
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

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal border border-white/10 rounded-xl max-w-2xl max-h-[80vh] overflow-y-auto p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Privacy Policy</h3>
            <div className="text-white/70 space-y-4 text-sm">
              <p><strong>1. Introduction</strong></p>
              <p>We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
              
              <p><strong>2. Information We Collect</strong></p>
              <p>We may collect information about you in a variety of ways. The information we may collect on the site includes:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Personal Data:</strong> Name, email address, phone number, and other information you voluntarily provide when registering for events or contacting us.</li>
                <li><strong>Payment Information:</strong> Credit card and billing information processed securely through our payment processor.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our website, including IP address, browser type, pages visited, and time spent on pages.</li>
              </ul>
              
              <p><strong>3. How We Use Your Information</strong></p>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Process your ticket purchases and event registrations</li>
                <li>Send you event updates, confirmations, and related communications</li>
                <li>Respond to your inquiries and customer service requests</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
              
              <p><strong>4. Information Sharing</strong></p>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements.</p>
              
              <p><strong>5. Security</strong></p>
              <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
              
              <p><strong>6. Your Rights</strong></p>
              <p>You have the right to access, update, or delete your personal information. Contact us at the email provided below to exercise these rights.</p>
              
              <p><strong>7. Contact Us</strong></p>
              <p>If you have questions about this Privacy Policy, please contact us at info@enablingtransformations.com</p>
            </div>
            <button
              onClick={() => setShowPrivacyPolicy(false)}
              className="mt-6 w-full bg-teal hover:bg-teal-dark text-charcoal font-bold py-2 rounded-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsOfService && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal border border-white/10 rounded-xl max-w-2xl max-h-[80vh] overflow-y-auto p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Terms of Service</h3>
            <div className="text-white/70 space-y-4 text-sm">
              <p><strong>1. Acceptance of Terms</strong></p>
              <p>By accessing and using this website and purchasing tickets to the Optimal Health Summit 2026, you accept and agree to be bound by the terms and provision of this agreement.</p>
              
              <p><strong>2. Use License</strong></p>
              <p>Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
              
              <p><strong>3. Disclaimer</strong></p>
              <p>The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
              
              <p><strong>4. Limitations</strong></p>
              <p>In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.</p>
              
              <p><strong>5. Accuracy of Materials</strong></p>
              <p>The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on our website are accurate, complete, or current.</p>
              
              <p><strong>6. Ticket Terms</strong></p>
              <p>All ticket purchases are final. Refunds are available up to 7 days before the event. Tickets are non-transferable and valid only for the named attendee.</p>
              
              <p><strong>7. Modifications</strong></p>
              <p>We may revise these terms of service for our website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
              
              <p><strong>8. Governing Law</strong></p>
              <p>These terms and conditions are governed by and construed in accordance with the laws of the State of California, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
            </div>
            <button
              onClick={() => setShowTermsOfService(false)}
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
      <About />
      <Speakers />
      <Topics />
      <VendorLounge />
      <WhyAttend />
      <StatsBar />
      <Testimonials />
      <AttendeeTestimonials />
      <SatisfactionGuaranteeSection />
      <Tickets />
      <Impact />
      <Venue />
      <FinalCTA />
      <Footer />
    </div>
  );
}
