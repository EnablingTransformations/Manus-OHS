import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Users, Instagram, Facebook, Youtube, Mail } from "lucide-react";

export default function ThankYou() {
  const [location, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Extract session ID from URL query params
    const params = new URLSearchParams(window.location.search);
    const session = params.get("session_id");
    setSessionId(session);

    // If no session ID, redirect back to home after 3 seconds
    if (!session) {
      setTimeout(() => setLocation("/"), 3000);
    }
  }, [setLocation]);

  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com/optimalhealthsummit",
      color: "hover:text-pink-500",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://facebook.com/optimalhealthsummit",
      color: "hover:text-blue-600",
    },
    {
      name: "YouTube",
      icon: Youtube,
      url: "https://youtube.com/@optimalhealthsummit",
      color: "hover:text-red-600",
    },
    {
      name: "Email",
      icon: Mail,
      url: "mailto:info@optimalhealthsummit.com",
      color: "hover:text-gold",
    },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Optimal Health Summit 2026",
        text: "Join me at the Optimal Health Summit 2026! Transform your health in one day.",
        url: window.location.origin,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal pt-20 pb-12 px-4">
      {/* Success Message */}
      <div className="max-w-2xl mx-auto text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal to-gold mb-6">
          <Heart className="w-8 h-8 text-charcoal fill-charcoal" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-[family-name:var(--font-display)]">
          Thank You!
        </h1>

        <p className="text-xl text-white/80 mb-2">
          Your ticket to the Optimal Health Summit 2026 is confirmed.
        </p>

        <p className="text-white/60 mb-8">
          Check your email for confirmation details and event information.
          {sessionId && <span className="block text-xs text-white/40 mt-2">Session: {sessionId}</span>}
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
        {/* Social Links Section */}
        <div className="bg-charcoal-light border border-white/10 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Share2 className="w-6 h-6 text-teal" />
            Follow Us
          </h2>

          <p className="text-white/70 mb-6">
            Stay connected with us on social media for updates, speaker insights, and exclusive content.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white transition-all hover:bg-white/10 ${link.color}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{link.name}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Referral Section */}
        <div className="bg-gradient-to-br from-teal/10 to-gold/10 border border-teal/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-gold" />
            Invite Friends
          </h2>

          <p className="text-white/70 mb-6">
            Share the Optimal Health Summit with your friends and get rewarded! Earn partial refunds for every friend who purchases a ticket using your referral.
          </p>

          <div className="space-y-3">
            <Button
              onClick={handleShare}
              className="w-full bg-gradient-to-r from-teal to-teal-dark hover:from-teal-dark hover:to-teal text-charcoal font-bold py-3 rounded-lg transition-all"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Event
            </Button>

            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              Back to Home
            </Button>
          </div>

          <p className="text-xs text-white/50 mt-4 text-center">
            More details about our referral program coming soon!
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-2xl mx-auto bg-charcoal-light border border-white/10 rounded-xl p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-3">What's Next?</h3>
        <p className="text-white/70 mb-6">
          Prepare for the summit by reviewing the speaker lineup and topics. We'll send you more details as the event approaches.
        </p>
        <Button
          onClick={() => setLocation("/")}
          className="bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-charcoal font-bold"
        >
          Explore the Summit
        </Button>
      </div>
    </div>
  );
}
