import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log("Starting migration...");

  // Create enums
  await sql`DO $$ BEGIN
    CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$`;
  console.log("✓ lead_status enum");

  await sql`DO $$ BEGIN
    CREATE TYPE subscriber_status AS ENUM ('pending', 'confirmed', 'unsubscribed');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$`;
  console.log("✓ subscriber_status enum");

  // Alter existing leads table — add new columns if missing
  const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'leads'`;
  const existing = cols.map(c => c.column_name);

  if (!existing.includes("company")) {
    await sql`ALTER TABLE leads ADD COLUMN company VARCHAR(255)`;
    console.log("✓ added leads.company");
  }
  if (!existing.includes("message")) {
    await sql`ALTER TABLE leads ADD COLUMN message TEXT`;
    // Copy old 'idea' data to 'message' if exists
    if (existing.includes("idea")) {
      await sql`UPDATE leads SET message = idea WHERE idea IS NOT NULL`;
      console.log("✓ copied idea → message");
    }
    console.log("✓ added leads.message");
  }
  if (!existing.includes("source")) {
    await sql`ALTER TABLE leads ADD COLUMN source VARCHAR(100) DEFAULT 'website'`;
    console.log("✓ added leads.source");
  }
  if (!existing.includes("utm_source")) {
    await sql`ALTER TABLE leads ADD COLUMN utm_source VARCHAR(255)`;
    console.log("✓ added leads.utm_source");
  }
  if (!existing.includes("utm_medium")) {
    await sql`ALTER TABLE leads ADD COLUMN utm_medium VARCHAR(255)`;
    console.log("✓ added leads.utm_medium");
  }
  if (!existing.includes("utm_campaign")) {
    await sql`ALTER TABLE leads ADD COLUMN utm_campaign VARCHAR(255)`;
    console.log("✓ added leads.utm_campaign");
  }
  if (!existing.includes("status")) {
    await sql`ALTER TABLE leads ADD COLUMN status lead_status DEFAULT 'new'`;
    console.log("✓ added leads.status");
  }
  if (!existing.includes("notes")) {
    await sql`ALTER TABLE leads ADD COLUMN notes TEXT`;
    console.log("✓ added leads.notes");
  }
  if (!existing.includes("updated_at")) {
    await sql`ALTER TABLE leads ADD COLUMN updated_at TIMESTAMP DEFAULT NOW() NOT NULL`;
    console.log("✓ added leads.updated_at");
  }

  // Create lead_events table
  await sql`CREATE TABLE IF NOT EXISTS lead_events (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER NOT NULL REFERENCES leads(id),
    event_type VARCHAR(100) NOT NULL,
    payload JSONB,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
  )`;
  console.log("✓ lead_events table");

  // Create email_subscribers table
  await sql`CREATE TABLE IF NOT EXISTS email_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    source VARCHAR(100),
    tags TEXT[],
    status subscriber_status DEFAULT 'pending',
    confirmed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
  )`;
  console.log("✓ email_subscribers table");

  // Create email_campaigns table
  await sql`CREATE TABLE IF NOT EXISTS email_campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    sent_at TIMESTAMP,
    stats JSONB,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
  )`;
  console.log("✓ email_campaigns table");

  // Create email_sends table
  await sql`CREATE TABLE IF NOT EXISTS email_sends (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER NOT NULL REFERENCES email_campaigns(id),
    subscriber_id INTEGER NOT NULL REFERENCES email_subscribers(id),
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    bounced_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
  )`;
  console.log("✓ email_sends table");

  console.log("\n✅ Migration complete!");
}

migrate().catch(console.error);
