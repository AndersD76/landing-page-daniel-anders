import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads, emailSubscribers } from "@/lib/db/schema";
import { desc, sql, gte, count, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const token = auth?.replace("Bearer ", "");

  if (!token || token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Run all queries in parallel
    const [
      totalLeadsResult,
      todayLeadsResult,
      weekLeadsResult,
      monthLeadsResult,
      leadsBySource,
      leadsByStatus,
      totalSubscribersResult,
      confirmedSubscribersResult,
      dailyTrend,
      recentLeads,
    ] = await Promise.all([
      // Total leads
      db.select({ count: count() }).from(leads),

      // Leads today
      db
        .select({ count: count() })
        .from(leads)
        .where(gte(leads.createdAt, startOfToday)),

      // Leads this week
      db
        .select({ count: count() })
        .from(leads)
        .where(gte(leads.createdAt, startOfWeek)),

      // Leads this month
      db
        .select({ count: count() })
        .from(leads)
        .where(gte(leads.createdAt, startOfMonth)),

      // Leads by source
      db
        .select({
          source: leads.source,
          count: count(),
        })
        .from(leads)
        .groupBy(leads.source)
        .orderBy(desc(count())),

      // Leads by status
      db
        .select({
          status: leads.status,
          count: count(),
        })
        .from(leads)
        .groupBy(leads.status)
        .orderBy(desc(count())),

      // Total email subscribers
      db.select({ count: count() }).from(emailSubscribers),

      // Confirmed email subscribers
      db
        .select({ count: count() })
        .from(emailSubscribers)
        .where(eq(emailSubscribers.status, "confirmed")),

      // Daily lead trend (last 30 days)
      db
        .select({
          date: sql<string>`DATE(${leads.createdAt})`.as("date"),
          count: count(),
        })
        .from(leads)
        .where(gte(leads.createdAt, thirtyDaysAgo))
        .groupBy(sql`DATE(${leads.createdAt})`)
        .orderBy(sql`DATE(${leads.createdAt})`),

      // Recent leads (last 10)
      db
        .select()
        .from(leads)
        .orderBy(desc(leads.createdAt))
        .limit(10),
    ]);

    const totalLeads = totalLeadsResult[0]?.count ?? 0;
    const totalSubscribers = totalSubscribersResult[0]?.count ?? 0;

    return NextResponse.json({
      totalLeads,
      leadsToday: todayLeadsResult[0]?.count ?? 0,
      leadsThisWeek: weekLeadsResult[0]?.count ?? 0,
      leadsThisMonth: monthLeadsResult[0]?.count ?? 0,
      leadsBySource: leadsBySource.map((r) => ({
        source: r.source ?? "unknown",
        count: r.count,
      })),
      leadsByStatus: leadsByStatus.map((r) => ({
        status: r.status ?? "new",
        count: r.count,
      })),
      totalSubscribers,
      confirmedSubscribers: confirmedSubscribersResult[0]?.count ?? 0,
      dailyTrend: dailyTrend.map((r) => ({
        date: r.date,
        count: r.count,
      })),
      recentLeads,
      conversionRate:
        totalSubscribers > 0 && totalLeads > 0
          ? Math.round((totalLeads / (totalLeads + totalSubscribers)) * 100)
          : 0,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
