/**
 * Admin Dashboard — View email leads, track stats, and manage discount codes
 * Protected route: only admins can access
 */

import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { BarChart3, Mail, TrendingUp, Copy, Check, Phone, Download } from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [copiedCode, setCopiedCode] = useState(false);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, authLoading, setLocation]);

  // Fetch admin data
  const leadsQuery = trpc.admin.getLeads.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });
  const statsQuery = trpc.admin.getStats.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });
  const smsSubscribersQuery = trpc.admin.getSmsSubscribers.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });
  const exportCsvQuery = trpc.admin.exportSmsSubscribersCsv.useQuery(undefined, {
    enabled: false, // Only fetch on demand
  });

  const handleExportCsv = async () => {
    const result = await exportCsvQuery.refetch();
    if (result.data?.csv) {
      const blob = new Blob([result.data.csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `sms-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-white/60">Unauthorized</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">
            Admin Dashboard
          </h1>
          <p className="text-white/60">Manage leads, track sales, and discount codes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Total Leads */}
          <div className="bg-charcoal-light border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/70 text-sm font-medium">Total Email Leads</h3>
              <Mail className="w-5 h-5 text-teal" />
            </div>
            <div className="text-3xl font-bold text-white">
              {statsQuery.isLoading ? "..." : statsQuery.data?.totalLeads || 0}
            </div>
            <p className="text-white/40 text-xs mt-2">All time</p>
          </div>

          {/* Leads Today */}
          <div className="bg-charcoal-light border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/70 text-sm font-medium">Leads Today</h3>
              <TrendingUp className="w-5 h-5 text-gold" />
            </div>
            <div className="text-3xl font-bold text-white">
              {statsQuery.isLoading ? "..." : statsQuery.data?.leadsToday || 0}
            </div>
            <p className="text-white/40 text-xs mt-2">Last 24 hours</p>
          </div>

          {/* Discount Code */}
          <div className="bg-charcoal-light border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/70 text-sm font-medium">Discount Code</h3>
              <BarChart3 className="w-5 h-5 text-teal" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gold">
                {statsQuery.data?.discountCode || "—"}
              </span>
              <button
                onClick={() => handleCopyCode(statsQuery.data?.discountCode || "")}
                className="p-2 hover:bg-white/10 rounded transition-colors cursor-pointer"
              >
                {copiedCode ? (
                  <Check className="w-4 h-4 text-teal" />
                ) : (
                  <Copy className="w-4 h-4 text-white/40 hover:text-white/60" />
                )}
              </button>
            </div>
            <p className="text-white/40 text-xs mt-2">10% discount</p>
          </div>

          {/* SMS Subscribers */}
          <div className="bg-charcoal-light border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/70 text-sm font-medium">SMS Subscribers</h3>
              <Phone className="w-5 h-5 text-teal" />
            </div>
            <div className="text-3xl font-bold text-white">
              {statsQuery.isLoading ? "..." : statsQuery.data?.totalSmsSubscribers || 0}
            </div>
            <p className="text-white/40 text-xs mt-2">Active opt-ins</p>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-charcoal-light border border-white/10 rounded-xl overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Email Leads</h2>
          </div>

          {leadsQuery.isLoading ? (
            <div className="p-6 text-center text-white/60">Loading leads...</div>
          ) : leadsQuery.data && leadsQuery.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10 bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-white/70 font-medium">Email</th>
                    <th className="px-6 py-3 text-left text-white/70 font-medium">Discount Code</th>
                    <th className="px-6 py-3 text-left text-white/70 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {leadsQuery.data.map((lead) => (
                    <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white">{lead.email}</td>
                      <td className="px-6 py-4 text-gold font-mono">{lead.discountCode}</td>
                      <td className="px-6 py-4 text-white/60 text-xs">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-white/60">No email leads yet</div>
          )}
        </div>

        {/* SMS Subscribers Table */}
        <div className="bg-charcoal-light border border-white/10 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">SMS Subscribers</h2>
            <Button
              onClick={handleExportCsv}
              disabled={exportCsvQuery.isFetching}
              className="bg-teal hover:bg-teal/80 text-white text-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {exportCsvQuery.isFetching ? "Exporting..." : "Export CSV"}
            </Button>
          </div>

          {smsSubscribersQuery.isLoading ? (
            <div className="p-6 text-center text-white/60">Loading subscribers...</div>
          ) : smsSubscribersQuery.data && smsSubscribersQuery.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10 bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-white/70 font-medium">Phone Number</th>
                    <th className="px-6 py-3 text-left text-white/70 font-medium">Email</th>
                    <th className="px-6 py-3 text-left text-white/70 font-medium">Ticket Type</th>
                    <th className="px-6 py-3 text-left text-white/70 font-medium">Status</th>
                    <th className="px-6 py-3 text-left text-white/70 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {smsSubscribersQuery.data.map((sub: any) => (
                    <tr key={sub.phoneNumber} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-mono">{sub.phoneNumber}</td>
                      <td className="px-6 py-4 text-white/80">{sub.email || "—"}</td>
                      <td className="px-6 py-4 text-white/80 capitalize">{sub.ticketType || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          sub.status === 'active' ? 'bg-teal/20 text-teal' : 'bg-white/10 text-white/60'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/60 text-xs">
                        {new Date(sub.optedInAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-white/60">No SMS subscribers yet</div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
