import { getStatistics } from '../lib/kv.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const stats = await getStatistics();
  const yearsExperience = Math.max(0, new Date().getFullYear() - (stats.yearsExperienceStart || 2014));
  return res.status(200).json({
    performedInspections: stats.performedInspections,
    yearsExperience,
    satisfactionPercentage: stats.satisfactionPercentage
  });
}
