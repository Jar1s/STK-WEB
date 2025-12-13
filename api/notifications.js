import { getNotifications, upsertNotification } from '../lib/kv.js';
import { requireAdmin } from '../lib/auth.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') {
    const data = await getNotifications(true);
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return;
    const { text, backgroundColor, backgroundGradient, borderColor, textColor, active } = req.body || {};
    const result = await upsertNotification({
      text,
      backgroundColor,
      backgroundGradient,
      borderColor,
      textColor,
      active
    });
    if (!result.ok) return res.status(500).json({ error: 'Failed to create notification', reason: result.reason });
    return res.status(201).json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
