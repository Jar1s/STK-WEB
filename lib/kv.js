import { supabase, hasSupabase, hasServiceRole } from './supabase.js';

const NOTIFICATIONS_TABLE = 'notifications';
const STATISTICS_TABLE = 'statistics';

const defaultNotifications = [];
const defaultStatistics = {
  performedInspections: 15000,
  yearsExperienceStart: 2014,
  satisfactionPercentage: 98,
  googlePlaceId: null
};

// Notifications
export async function getNotifications(activeOnly = true) {
  if (!hasSupabase()) {
    return { notifications: defaultNotifications };
  }

  try {
    const query = supabase.from(NOTIFICATIONS_TABLE).select('*').order('created_at', { ascending: false });
    if (activeOnly) query.eq('active', true);
    const { data, error } = await query;

    if (error) {
      console.error('Error reading notifications:', error);
      return { notifications: defaultNotifications };
    }

    const notifications = (data || []).map((item) => ({
      id: item.id?.toString(),
      text: item.text,
      backgroundColor: item.background_color,
      backgroundGradient: item.background_gradient,
      borderColor: item.border_color,
      textColor: item.text_color,
      active: item.active,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));

    return { notifications };
  } catch (error) {
    console.error('Unexpected error reading notifications:', error);
    return { notifications: defaultNotifications };
  }
}

export async function upsertNotification(payload) {
  if (!hasSupabase() || !hasServiceRole()) {
    return { ok: false, reason: 'missing-service-role' };
  }

  const now = new Date().toISOString();
  const notificationData = {
    text: payload.text,
    background_color: payload.backgroundColor,
    background_gradient: payload.backgroundGradient,
    border_color: payload.borderColor,
    text_color: payload.textColor,
    active: payload.active ?? true,
    updated_at: now
  };

  let error;
  if (payload.id) {
    ({ error } = await supabase
      .from(NOTIFICATIONS_TABLE)
      .update(notificationData)
      .eq('id', payload.id));
  } else {
    notificationData.created_at = now;
    ({ error } = await supabase
      .from(NOTIFICATIONS_TABLE)
      .insert(notificationData));
  }

  if (error) {
    console.error('Error saving notification:', error);
    return { ok: false, reason: 'db-error', detail: error.message, code: error.code };
  }

  return { ok: true };
}

export async function updateNotification(id, changes) {
  if (!hasSupabase() || !hasServiceRole()) {
    return { ok: false, reason: 'missing-service-role' };
  }

  const mapChange = {};
  if (changes.text !== undefined) mapChange.text = changes.text;
  if (changes.backgroundColor !== undefined) mapChange.background_color = changes.backgroundColor;
  if (changes.backgroundGradient !== undefined) mapChange.background_gradient = changes.backgroundGradient;
  if (changes.borderColor !== undefined) mapChange.border_color = changes.borderColor;
  if (changes.textColor !== undefined) mapChange.text_color = changes.textColor;
  if (changes.active !== undefined) mapChange.active = changes.active;

  const updateData = { ...mapChange, updated_at: new Date().toISOString() };

  const { error } = await supabase.from(NOTIFICATIONS_TABLE).update(updateData).eq('id', id);
  if (error) {
    console.error('Error updating notification:', error);
    return { ok: false, reason: 'db-error' };
  }
  return { ok: true };
}

export async function deleteNotification(id) {
  if (!hasSupabase() || !hasServiceRole()) {
    return { ok: false, reason: 'missing-service-role' };
  }
  const { error } = await supabase.from(NOTIFICATIONS_TABLE).delete().eq('id', id);
  if (error) {
    console.error('Error deleting notification:', error);
    return { ok: false, reason: 'db-error', detail: error.message, code: error.code };
  }
  return { ok: true };
}

// Statistics
export async function getStatistics() {
  if (!hasSupabase()) {
    return defaultStatistics;
  }

  try {
    // Prefer the most recently updated row (fallback to any single row)
    let { data, error } = await supabase
      .from(STATISTICS_TABLE)
      .select('*')
      .order('updated_at', { ascending: false, nullsLast: true })
      .limit(1)
      .maybeSingle();

    if (!data && !error) {
      // Fallback: try id=1 if nothing was returned
      ({ data, error } = await supabase
        .from(STATISTICS_TABLE)
        .select('*')
        .eq('id', 1)
        .maybeSingle());
    }

    if (error) {
      console.error('Error reading statistics:', error);
      return defaultStatistics;
    }

    if (!data) return defaultStatistics;

    return {
      performedInspections: data.performed_inspections ?? defaultStatistics.performedInspections,
      yearsExperienceStart: data.years_experience_start ?? defaultStatistics.yearsExperienceStart,
      satisfactionPercentage: data.satisfaction_percentage ?? defaultStatistics.satisfactionPercentage,
      googlePlaceId: data.google_place_id ?? defaultStatistics.googlePlaceId
    };
  } catch (error) {
    console.error('Unexpected error reading statistics:', error);
    return defaultStatistics;
  }
}

export async function saveStatistics(stats) {
  if (!hasSupabase() || !hasServiceRole()) {
    return { ok: false, reason: 'missing-service-role' };
  }

  const row = {
    id: 1,
    performed_inspections: stats.performedInspections ?? defaultStatistics.performedInspections,
    years_experience_start: stats.yearsExperienceStart ?? defaultStatistics.yearsExperienceStart,
    satisfaction_percentage: stats.satisfactionPercentage ?? defaultStatistics.satisfactionPercentage,
    google_place_id: stats.googlePlaceId ?? defaultStatistics.googlePlaceId,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase.from(STATISTICS_TABLE).upsert(row, { onConflict: 'id' });
  if (error) {
    console.error('Error saving statistics:', error);
    return { ok: false, reason: 'db-error', detail: error.message, code: error.code };
  }
  return { ok: true };
}
