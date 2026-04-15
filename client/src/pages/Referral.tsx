import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Share2, Users, Gift, TrendingUp } from "lucide-react";

export default function Referral() {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Refer & Earn $20 Credits | Optimal Health Summit";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Earn $20 in credits for each friend you refer to the Optimal Health Summit. Share your unique referral link and start earning today.');
    }
  }, []);

  const referralLink = `${window.location.origin}?ref=${btoa("user123")}`; // Replace with actual user ID

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would send the referral email
      console.log("Sending referral to:", email);
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal pt-20">
      {/* Hero Section */}
      <section className="container py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-[family-name:var(--font-display)]">
            Share the Summit,{" "}
            <span className="text-teal">Earn 15% Credits</span>
          </h1>
          <p className="text-lg text-white/70 mb-8">
            Know someone who should experience the Optimal Health Summit? Refer them and earn 15% in credits for each ticket purchased using your referral link.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-12 md:py-16">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-charcoal-light border border-white/10 rounded-xl p-8 text-center">
            <div className="w-12 h-12 bg-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-6 h-6 text-teal" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">1. Share Your Link</h3>
            <p className="text-white/60">
              Copy your unique referral link and share it with friends via email, social media, or messaging apps.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-charcoal-light border border-white/10 rounded-xl p-8 text-center">
            <div className="w-12 h-12 bg-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-teal" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">2. They Purchase</h3>
            <p className="text-white/60">
              Your friends click your link and purchase their tickets to the summit using your referral code.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-charcoal-light border border-white/10 rounded-xl p-8 text-center">
            <div className="w-12 h-12 bg-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-6 h-6 text-teal" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">3. Earn 15% Credits</h3>
            <p className="text-white/60">
              You earn 15% in credits for each ticket purchased. Credits first refund your ticket, then paid as Amazon gift card or cash.
            </p>
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="container py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Your Referral Link
          </h2>

          {/* Copy Link */}
          <div className="bg-charcoal-light border border-white/10 rounded-xl p-6 mb-8">
            <label className="block text-sm font-medium text-white/70 mb-3">
              Your Referral Link
            </label>
            <div className="flex gap-3">
              <Input
                value={referralLink}
                readOnly
                className="bg-charcoal border-white/20 text-white"
              />
              <Button
                onClick={copyToClipboard}
                className="bg-teal hover:bg-teal-dark text-charcoal font-bold whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Email Referral */}
          <div className="bg-charcoal-light border border-white/10 rounded-xl p-6">
            <label className="block text-sm font-medium text-white/70 mb-3">
              Or Invite Friends by Email
            </label>
            <form onSubmit={handleEmailSubmit} className="flex gap-3">
              <Input
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-charcoal border-white/20 text-white placeholder:text-white/40"
              />
              <Button
                type="submit"
                className="bg-teal hover:bg-teal-dark text-charcoal font-bold whitespace-nowrap"
              >
                Send Invite
              </Button>
            </form>
            {submitted && (
              <p className="text-teal text-sm mt-3">✓ Invitation sent!</p>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container py-12 md:py-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Referral Benefits
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Benefit 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-teal mt-1" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">15% Per Referral</h3>
              <p className="text-white/60 text-sm">
                Earn 15% credit on every ticket purchased through your referral link. No limits on earnings.
              </p>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Gift className="w-6 h-6 text-teal mt-1" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">Cash or Gift Card</h3>
              <p className="text-white/60 text-sm">
                After your ticket is refunded, earn Amazon gift cards or cash payouts processed after the event.
              </p>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Users className="w-6 h-6 text-teal mt-1" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">Build Community</h3>
              <p className="text-white/60 text-sm">
                Share knowledge with your network and grow the Optimal Health Summit community.
              </p>
            </div>
          </div>

          {/* Benefit 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Check className="w-6 h-6 text-teal mt-1" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">Tracked Referrals</h3>
              <p className="text-white/60 text-sm">
                Your unique referral link ensures all referrals are tracked and your guests receive their 15% discount.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container py-12 md:py-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="max-w-2xl mx-auto space-y-6">
          {/* FAQ 1 */}
          <div className="bg-charcoal-light border border-white/10 rounded-xl p-6">
            <h3 className="font-bold text-white mb-3">
              How much do I earn per referral?
            </h3>
            <p className="text-white/60">
              You earn 15% credit for every ticket purchased using your referral link. For example, a $149 ticket earns you $22.35 in credits.
            </p>
          </div>

          {/* FAQ 2 */}
          <div className="bg-charcoal-light border border-white/10 rounded-xl p-6">
            <h3 className="font-bold text-white mb-3">
              How are credits applied?
            </h3>
            <p className="text-white/60">
              Credits first apply toward refunding your own ticket purchase. After your ticket is fully refunded, additional credits are paid as Amazon gift cards or cash after the event.
            </p>
          </div>

          {/* FAQ 3 */}
          <div className="bg-charcoal-light border border-white/10 rounded-xl p-6">
            <h3 className="font-bold text-white mb-3">
              When are payouts processed?
            </h3>
            <p className="text-white/60">
              All refunds and payouts are processed after the event concludes on June 20, 2026.
            </p>
          </div>

          {/* FAQ 4 */}
          <div className="bg-charcoal-light border border-white/10 rounded-xl p-6">
            <h3 className="font-bold text-white mb-3">
              What if someone refunds their ticket?
            </h3>
            <p className="text-white/60">
              Rewards, refunds, or credits do not apply to tickets that are refunded before or after the event. Only completed ticket purchases count toward your referral earnings.
            </p>
          </div>

          {/* FAQ 5 */}
          <div className="bg-charcoal-light border border-white/10 rounded-xl p-6">
            <h3 className="font-bold text-white mb-3">
              Can I share my referral link on social media?
            </h3>
            <p className="text-white/60">
              Absolutely! Share your referral link anywhere—Instagram, Facebook, LinkedIn, Twitter, email, or messaging apps. The more you share, the more you earn.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-12 md:py-16 mb-12">
        <div className="bg-gradient-to-r from-teal/20 to-purple/20 border border-teal/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Share your referral link with friends and earn 15% credits on every ticket. First refund your ticket, then get cash or Amazon gift cards.
          </p>
          <Button className="bg-teal hover:bg-teal-dark text-charcoal font-bold px-8 py-3 text-lg">
            Copy Your Link
          </Button>
        </div>
      </section>
    </div>
  );
}
