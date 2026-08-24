const express = require('express');
const cors = require('cors');
const path = require('path');
const { neon } = require('@neondatabase/serverless');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const sql = neon(process.env.DATABASE_URL);

const ALLOWED_ORIGINS = [
  'https://www.andersdev.com.br',
  'https://andersdev.com.br',
];

app.use(cors({
  origin(origin, callback) {
    // Sem "origin" = request server-to-server/curl (mesma origem já é servida
    // por este próprio processo via express.static, então não precisa de CORS).
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.NOTIFY_EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function sendNotification(lead) {
  if (!process.env.EMAIL_PASSWORD) return;

  try {
    await transporter.sendMail({
      from: process.env.NOTIFY_EMAIL,
      to: process.env.NOTIFY_EMAIL,
      subject: `🚀 Novo Lead: ${lead.name} — ${lead.sector || 'Não informado'}`,
      html: `
        <h2>Novo lead da landing page!</h2>
        <table style="border-collapse:collapse;font-family:Arial,sans-serif;">
          <tr><td style="padding:8px;font-weight:bold;">Nome:</td><td style="padding:8px;">${lead.name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Email:</td><td style="padding:8px;">${lead.email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">WhatsApp:</td><td style="padding:8px;">${lead.phone || '-'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Setor:</td><td style="padding:8px;">${lead.sector || '-'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Ideia/Dor:</td><td style="padding:8px;">${lead.idea || '-'}</td></tr>
        </table>
      `
    });
  } catch (err) {
    console.error('Erro ao enviar email:', err.message);
  }
}

app.post('/api/lead', async (req, res) => {
  try {
    const { name, email, phone, sector, idea } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios' });
    }

    await sql`
      INSERT INTO leads (name, email, phone, sector, idea)
      VALUES (${name}, ${email}, ${phone || null}, ${sector || null}, ${idea || null})
    `;

    sendNotification({ name, email, phone, sector, idea });

    res.json({ success: true, message: 'Lead salvo com sucesso' });
  } catch (err) {
    console.error('Erro ao salvar lead:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

app.get('/api/leads', async (req, res) => {
  try {
    const leads = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar leads' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
