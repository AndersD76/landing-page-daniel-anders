const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function setup() {
  const sql = neon(process.env.DATABASE_URL);

  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      sector VARCHAR(255),
      idea TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  console.log('Tabela "leads" criada com sucesso!');

  const result = await sql`SELECT COUNT(*) FROM leads`;
  console.log('Leads atuais:', result[0].count);
}

setup().catch(console.error);
