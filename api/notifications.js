import { deleteNotification, getNotifications, updateNotification, upsertNotification } from '../lib/kv.js';
import { requireAdmin } from '../lib/auth.js';

function extractId(req) {
  // Try query param first
  if (req.query?.id) return req.query.id;
  // Fallback parse from URL path /api/notifications/123
  const path = (req.url || '').split('?')[0];
  const parts = path.split('/').filter(Boolean);
  const idx = parts.indexOf('notifications');
  if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const id = extractId(req);

  if (req.method === 'GET') {
    const data = await getNotifications(true);
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return;
    const { id: bodyId, text, backgroundColor, backgroundGradient, borderColor, textColor, active } = req.body || {};
    const result = await upsertNotification({
      id: bodyId,
      text,
      backgroundColor,
      backgroundGradient,
      borderColor,
      textColor,
      active
    });
    if (!result.ok) {
      return res.status(500).json({
        error: 'Failed to create notification',
        reason: result.reason,
        detail: result.detail,
        code: result.code
      });
    }
    return res.status(201).json({ ok: true });
  }

  if (req.method === 'PUT') {
    if (!requireAdmin(req, res)) return;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    const { text, backgroundColor, backgroundGradient, borderColor, textColor, active } = req.body || {};
    const result = await updateNotification(id, {
      ...(text !== undefined ? { text } : {}),
      ...(backgroundColor !== undefined ? { backgroundColor } : {}),
      ...(backgroundGradient !== undefined ? { backgroundGradient } : {}),
      ...(borderColor !== undefined ? { borderColor } : {}),
      ...(textColor !== undefined ? { textColor } : {}),
      ...(active !== undefined ? { active } : {})
    });
    if (!result.ok) {
      return res.status(500).json({
        error: 'Failed to update notification',
        reason: result.reason,
        detail: result.detail,
        code: result.code
      });
    }
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    if (!requireAdmin(req, res)) return;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    const result = await deleteNotification(id);
    if (!result.ok) {
      return res.status(500).json({
        error: 'Failed to delete notification',
        reason: result.reason,
        detail: result.detail,
        code: result.code
      });
    }
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
