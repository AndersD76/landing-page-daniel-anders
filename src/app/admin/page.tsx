"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface StatsData {
  totalLeads: number;
  leadsToday: number;
  leadsThisWeek: number;
  leadsThisMonth: number;
  leadsBySource: { source: string; count: number }[];
  leadsByStatus: { status: string; count: number }[];
  totalSubscribers: number;
  confirmedSubscribers: number;
  dailyTrend: { date: string; count: number }[];
  recentLeads: {
    id: number;
    name: string;
    email: string;
    company: string | null;
    phone: string | null;
    message: string | null;
    source: string | null;
    status: string | null;
    created_at: string;
  }[];
  conversionRate: number;
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  contacted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  qualified: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  proposal: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  won: "bg-green-500/20 text-green-400 border-green-500/30",
  lost: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchStats(token: string) {
    const res = await fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Unauthorized");
    return res.json() as Promise<StatsData>;
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await fetchStats(password);
      setStats(data);
      setAuthenticated(true);
      sessionStorage.setItem("admin_token", password);
    } catch {
      setError("Senha incorreta");
    }
    setLoading(false);
  }

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) {
      fetchStats(saved)
        .then((data) => {
          setStats(data);
          setAuthenticated(true);
        })
        .catch(() => sessionStorage.removeItem("admin_token"));
    }
  }, []);

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-surface-black text-foreground flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 no-underline mb-8">
            <img src="/logo.png" alt="Anders Dev" className="w-8 h-8" />
            <span className="font-heading text-lg font-bold text-foreground tracking-tight">
              anders<span className="text-brand">dev</span>
            </span>
          </Link>
          <h1 className="font-heading text-2xl font-bold mb-6">Admin Dashboard</h1>
          <form onSubmit={login} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full px-5 py-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-foreground placeholder:text-[#444] focus:border-brand/30 focus:outline-none transition-colors"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="cta-btn w-full justify-center"
            >
              {loading ? "..." : "Entrar"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (!stats) {
    return (
      <main className="min-h-screen bg-surface-black text-foreground flex items-center justify-center">
        <div className="text-[#555]">Carregando...</div>
      </main>
    );
  }

  const maxDailyCount = Math.max(...stats.dailyTrend.map((d) => d.count), 1);
  const maxSourceCount = Math.max(...stats.leadsBySource.map((s) => s.count), 1);

  return (
    <main className="min-h-screen bg-surface-black text-foreground">
      {/* NAV */}
      <nav className="border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <img src="/logo.png" alt="Anders Dev" className="w-8 h-8" />
            <span className="font-heading text-lg font-bold text-foreground tracking-tight">
              anders<span className="text-brand">dev</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#555] hidden sm:inline">Admin Dashboard</span>
            <button
              onClick={() => {
                sessionStorage.removeItem("admin_token");
                setAuthenticated(false);
                setStats(null);
              }}
              className="text-sm text-[#555] hover:text-red-400 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="font-heading text-3xl font-bold mb-8">Dashboard</h1>

        {/* TOP STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <StatCard label="Total Leads" value={stats.totalLeads} />
          <StatCard label="Hoje" value={stats.leadsToday} />
          <StatCard label="Esta Semana" value={stats.leadsThisWeek} />
          <StatCard label="Este Mes" value={stats.leadsThisMonth} />
          <StatCard label="Inscritos" value={stats.totalSubscribers} />
          <StatCard label="Taxa Conv." value={`${stats.conversionRate}%`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* DAILY TREND CHART */}
          <div className="lg:col-span-2 glass-card">
            <h2 className="font-heading text-lg font-bold mb-4">
              Leads - Ultimos 30 dias
            </h2>
            {stats.dailyTrend.length === 0 ? (
              <p className="text-[#555] text-sm">Sem dados no periodo.</p>
            ) : (
              <div className="flex items-end gap-[2px] h-40">
                {stats.dailyTrend.map((day) => {
                  const height = Math.max((day.count / maxDailyCount) * 100, 4);
                  const dateObj = new Date(day.date + "T00:00:00");
                  const label = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
                  return (
                    <div
                      key={day.date}
                      className="flex-1 flex flex-col items-center justify-end group relative"
                    >
                      <div
                        className="absolute -top-8 bg-[#1a2744] text-foreground text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
                      >
                        {label}: {day.count} lead{day.count !== 1 ? "s" : ""}
                      </div>
                      <div
                        className="w-full bg-brand/80 hover:bg-brand rounded-t transition-colors min-h-[4px]"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* LEADS BY STATUS */}
          <div className="glass-card">
            <h2 className="font-heading text-lg font-bold mb-4">Por Status</h2>
            <div className="flex flex-wrap gap-2">
              {stats.leadsByStatus.map((s) => (
                <span
                  key={s.status}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${STATUS_COLORS[s.status] ?? "bg-white/10 text-[#999] border-white/10"}`}
                >
                  {s.status}
                  <span className="font-bold">{s.count}</span>
                </span>
              ))}
              {stats.leadsByStatus.length === 0 && (
                <p className="text-[#555] text-sm">Sem dados.</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* LEADS BY SOURCE */}
          <div className="glass-card lg:col-span-2">
            <h2 className="font-heading text-lg font-bold mb-4">Por Fonte</h2>
            {stats.leadsBySource.length === 0 ? (
              <p className="text-[#555] text-sm">Sem dados.</p>
            ) : (
              <div className="space-y-3">
                {stats.leadsBySource.map((s) => {
                  const width = Math.max((s.count / maxSourceCount) * 100, 2);
                  return (
                    <div key={s.source}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-foreground">{s.source}</span>
                        <span className="text-sm font-bold text-brand">{s.count}</span>
                      </div>
                      <div className="w-full bg-white/[0.04] rounded-full h-2">
                        <div
                          className="bg-brand/70 h-2 rounded-full transition-all"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* QUICK LINKS */}
          <div className="glass-card">
            <h2 className="font-heading text-lg font-bold mb-4">Links</h2>
            <div className="space-y-3">
              <QuickLink href="/admin/leads" label="Ver Todos os Leads" />
              <QuickLink href="/" label="Ver Site" />
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="text-xs text-[#555] mb-1">Inscritos</div>
                <div className="text-sm">
                  <span className="text-foreground">{stats.totalSubscribers} total</span>
                  <span className="text-[#555] mx-2">/</span>
                  <span className="text-green-400">{stats.confirmedSubscribers} confirmados</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT LEADS TABLE */}
        <div className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold">Leads Recentes</h2>
            <Link
              href="/admin/leads"
              className="text-xs text-brand hover:text-brand/80 transition-colors no-underline"
            >
              Ver todos
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-3 px-4 text-[#555] font-medium">Nome</th>
                  <th className="text-left py-3 px-4 text-[#555] font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-[#555] font-medium hidden md:table-cell">
                    Fonte
                  </th>
                  <th className="text-left py-3 px-4 text-[#555] font-medium hidden md:table-cell">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-[#555] font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 px-4 text-foreground font-medium">{lead.name}</td>
                    <td className="py-3 px-4 text-brand">{lead.email}</td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-[0.65rem] text-brand/70 bg-brand/[0.06] px-2 py-0.5 rounded-full">
                        {lead.source ?? "website"}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span
                        className={`text-[0.65rem] px-2 py-0.5 rounded-full border ${STATUS_COLORS[lead.status ?? "new"] ?? "bg-white/10 text-[#999] border-white/10"}`}
                      >
                        {lead.status ?? "new"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#555] text-xs">
                      {new Date(lead.created_at).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {stats.recentLeads.length === 0 && (
            <p className="text-center text-[#555] py-8">Nenhum lead encontrado.</p>
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass-card text-center">
      <div className="text-2xl md:text-3xl font-heading font-bold text-brand">
        {value}
      </div>
      <div className="text-xs text-[#555] mt-1">{label}</div>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between px-4 py-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] rounded-lg text-sm text-foreground no-underline transition-colors group"
    >
      <span>{label}</span>
      <span className="text-[#555] group-hover:text-brand transition-colors">
        &rarr;
      </span>
    </Link>
  );
}
