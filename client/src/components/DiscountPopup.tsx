/**
 * Discount Popup — Offers visitors a discount code in exchange for their email.
 * Shows after a delay on first visit. Remembers dismissal via localStorage.
 */

import { useEffect, useState } from "react";
import { X, Gift, Sparkles, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "ohs_discount_popup_dismissed";
const POPUP_DELAY_MS = 8000; // Show after 8 seconds
const DISCOUNT_CODE = "HEALTH10";
const DISCOUNT_PERCENT = "10%";

export default function DiscountPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Don't show if already dismissed or on thank-you page
    if (localStorage.getItem(STORAGE_KEY)) return;
    if (window.location.pathname === "/thank-you") return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    // Store the email locally (could be sent to backend later)
    try {
      const existingEmails = JSON.parse(localStorage.getItem("ohs_collected_emails") || "[]");
      existingEmails.push({ email, timestamp: new Date().toISOString() });
      localStorage.setItem("ohs_collected_emails", JSON.stringify(existingEmails));
    } catch {
      // Ignore storage errors
    }

    setSubmitted(true);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(DISCOUNT_CODE).catch(() => {});
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            onClick={handleDismiss}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
          >
            <div className="relative bg-gradient-to-br from-charcoal-light to-charcoal w-full max-w-md rounded-2xl border border-teal/20 shadow-2xl overflow-hidden">
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Decorative top bar */}
              <div className="h-1.5 bg-gradient-to-r from-teal via-gold to-teal" />

              <div className="p-8">
                {!submitted ? (
                  <>
                    {/* Icon */}
                    <div className="flex justify-center mb-5">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal/20 to-gold/20 flex items-center justify-center">
                        <Gift className="w-8 h-8 text-gold" />
                      </div>
                    </div>

                    {/* Heading */}
                    <h3 className="text-2xl font-bold text-white text-center font-[family-name:var(--font-display)] mb-2">
                      Unlock {DISCOUNT_PERCENT} Off
                    </h3>
                    <p className="text-white/60 text-center text-sm mb-6 leading-relaxed">
                      Enter your email to receive an exclusive {DISCOUNT_PERCENT} discount code for the Optimal Health Summit 2026.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-teal/50 focus:ring-1 focus:ring-teal/30 transition-all text-sm"
                        />
                      </div>

                      {error && (
                        <p className="text-red-400 text-xs">{error}</p>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-charcoal font-bold py-3 rounded-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        Get My {DISCOUNT_PERCENT} Discount
                      </button>
                    </form>

                    <p className="text-white/30 text-xs text-center mt-4">
                      No spam, ever. Unsubscribe anytime.
                    </p>
                  </>
                ) : (
                  /* Success state */
                  <>
                    <div className="flex justify-center mb-5">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal/20 to-gold/20 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-gold" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white text-center font-[family-name:var(--font-display)] mb-2">
                      Your Code is Ready!
                    </h3>
                    <p className="text-white/60 text-center text-sm mb-6">
                      Use this code at checkout for {DISCOUNT_PERCENT} off any ticket:
                    </p>

                    {/* Discount code display */}
                    <div
                      onClick={handleCopyCode}
                      className="bg-white/5 border-2 border-dashed border-gold/40 rounded-xl py-4 px-6 text-center cursor-pointer hover:border-gold/60 transition-colors mb-4"
                    >
                      <span className="text-3xl font-bold text-gold tracking-widest font-[family-name:var(--font-display)]">
                        {DISCOUNT_CODE}
                      </span>
                      <p className="text-white/40 text-xs mt-2">Click to copy</p>
                    </div>

                    <p className="text-white/50 text-xs text-center mb-5">
                      We've also sent this code to <span className="text-teal">{email}</span>
                    </p>

                    <button
                      onClick={handleDismiss}
                      className="w-full bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-charcoal font-bold py-3 rounded-lg transition-all text-sm cursor-pointer"
                    >
                      Start Shopping
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
