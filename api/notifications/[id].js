import { deleteNotification, updateNotification } from '../../lib/kv.js';
import { requireAdmin } from '../../lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  if (!requireAdmin(req, res)) return;

  if (req.method === 'PUT') {
    const { text, backgroundColor, backgroundGradient, borderColor, textColor, active } = req.body || {};
    const result = await updateNotification(id, {
      ...(text !== undefined ? { text } : {}),
      ...(backgroundColor !== undefined ? { backgroundColor } : {}),
      ...(backgroundGradient !== undefined ? { backgroundGradient } : {}),
      ...(borderColor !== undefined ? { borderColor } : {}),
      ...(textColor !== undefined ? { textColor } : {}),
      ...(active !== undefined ? { active } : {})
    });
    if (!result.ok) return res.status(500).json({ error: 'Failed to update notification', reason: result.reason });
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    const result = await deleteNotification(id);
    if (!result.ok) return res.status(500).json({ error: 'Failed to delete notification', reason: result.reason });
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
