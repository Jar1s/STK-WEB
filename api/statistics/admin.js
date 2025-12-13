import { getStatistics, saveStatistics } from '../../lib/kv.js';
import { requireAdmin } from '../../lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!requireAdmin(req, res)) return;

  if (req.method === 'GET') {
    const stats = await getStatistics();
    return res.status(200).json(stats);
  }

  if (req.method === 'PUT') {
    const body = req.body || {};
    const stats = {
      performedInspections: body.performedInspections,
      yearsExperienceStart: body.yearsExperienceStart,
      satisfactionPercentage: body.satisfactionPercentage,
      googlePlaceId: body.googlePlaceId
    };
    const result = await saveStatistics(stats);
    if (!result.ok) return res.status(500).json({ error: 'Failed to save statistics', reason: result.reason });
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
