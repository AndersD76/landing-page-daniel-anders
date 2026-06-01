"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Lead {
  id: number;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string | null;
  source: string | null;
  status: string;
  created_at: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads", {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
        setAuthenticated(true);
        sessionStorage.setItem("admin_token", password);
      } else {
        alert("Senha incorreta");
      }
    } catch {
      alert("Erro de conexão");
    }
    setLoading(false);
  }

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) {
      fetch("/api/admin/leads", {
        headers: { Authorization: `Bearer ${saved}` },
      })
        .then((r) => {
          if (r.ok) return r.json();
          throw new Error("Unauthorized");
        })
        .then((data) => {
          setLeads(data);
          setAuthenticated(true);
        })
        .catch(() => sessionStorage.removeItem("admin_token"));
    }
  }, []);

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-surface-black text-foreground flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="font-heading text-2xl font-bold text-foreground no-underline tracking-[-2px] block mb-8"
          >
            DA<span className="text-brand">.</span>
          </Link>
          <h1 className="font-heading text-2xl font-bold mb-6">Admin</h1>
          <form onSubmit={login} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full px-5 py-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-foreground placeholder:text-[#444] focus:border-brand/30 focus:outline-none transition-colors"
            />
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

  const filteredLeads = leads.filter(
    (l) =>
      !filter ||
      l.name.toLowerCase().includes(filter.toLowerCase()) ||
      l.email.toLowerCase().includes(filter.toLowerCase()) ||
      l.source?.toLowerCase().includes(filter.toLowerCase())
  );

  const stats = {
    total: leads.length,
    today: leads.filter(
      (l) =>
        new Date(l.created_at).toDateString() === new Date().toDateString()
    ).length,
    thisWeek: leads.filter(
      (l) =>
        Date.now() - new Date(l.created_at).getTime() < 7 * 24 * 60 * 60 * 1000
    ).length,
    sources: Object.entries(
      leads.reduce(
        (acc, l) => {
          const s = l.source || "unknown";
          acc[s] = (acc[s] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      )
    ).sort((a, b) => b[1] - a[1]),
  };

  return (
    <main className="min-h-screen bg-surface-black text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/"
              className="font-heading text-2xl font-bold text-foreground no-underline tracking-[-2px]"
            >
              DA<span className="text-brand">.</span>
            </Link>
            <h1 className="font-heading text-3xl font-bold mt-2">Leads</h1>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem("admin_token");
              setAuthenticated(false);
            }}
            className="text-sm text-[#555] hover:text-red-400 transition-colors"
          >
            Sair
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card text-center">
            <div className="text-3xl font-heading font-bold text-brand">
              {stats.total}
            </div>
            <div className="text-xs text-[#555]">Total</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-3xl font-heading font-bold text-brand">
              {stats.today}
            </div>
            <div className="text-xs text-[#555]">Hoje</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-3xl font-heading font-bold text-brand">
              {stats.thisWeek}
            </div>
            <div className="text-xs text-[#555]">Últimos 7 dias</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-3xl font-heading font-bold text-brand">
              {stats.sources.length}
            </div>
            <div className="text-xs text-[#555]">Fontes</div>
          </div>
        </div>

        {/* FILTER */}
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtrar por nome, email ou fonte..."
          className="w-full px-5 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-foreground placeholder:text-[#444] focus:border-brand/30 focus:outline-none transition-colors mb-6"
        />

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-3 px-4 text-[#555] font-medium">
                  Nome
                </th>
                <th className="text-left py-3 px-4 text-[#555] font-medium">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-[#555] font-medium hidden md:table-cell">
                  Telefone
                </th>
                <th className="text-left py-3 px-4 text-[#555] font-medium hidden lg:table-cell">
                  Fonte
                </th>
                <th className="text-left py-3 px-4 text-[#555] font-medium hidden lg:table-cell">
                  Mensagem
                </th>
                <th className="text-left py-3 px-4 text-[#555] font-medium">
                  Data
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 px-4 text-foreground font-medium">
                    {lead.name}
                  </td>
                  <td className="py-3 px-4 text-brand">{lead.email}</td>
                  <td className="py-3 px-4 text-[#666] hidden md:table-cell">
                    {lead.phone || "—"}
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-[0.65rem] text-brand/70 bg-brand/[0.06] px-2 py-0.5 rounded-full">
                      {lead.source || "website"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#666] hidden lg:table-cell max-w-[200px] truncate">
                    {lead.message || "—"}
                  </td>
                  <td className="py-3 px-4 text-[#555] text-xs">
                    {new Date(lead.created_at).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <p className="text-center text-[#555] py-12">Nenhum lead encontrado.</p>
        )}
      </div>
    </main>
  );
}
