import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase'

const TABLE = 'play_sessions'
const ENTRY_TABLE = 'entry_attempts'
const DEVICE_KEY = 'gift_device_id'

function getDeviceId() {
  const existing = window.localStorage.getItem(DEVICE_KEY)

  if (existing) {
    return existing
  }

  const next = crypto.randomUUID()
  window.localStorage.setItem(DEVICE_KEY, next)
  return next
}

function warnIfMissingConfig() {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.')
    return true
  }

  return false
}

export async function startPlaySession({ isAdminEntry }) {
  if (warnIfMissingConfig()) {
    return null
  }

  const supabase = getSupabaseClient()
  const payload = {
    device_id: getDeviceId(),
    is_admin_entry: Boolean(isAdminEntry),
    level_reached: 0,
    started_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from(TABLE).insert(payload).select('id').single()

  if (error) {
    console.error('Failed to start play session:', error.message)
    return null
  }

  return data.id
}

export async function trackEntryAttempt({ wasSuccessful, isAdminAttempt }) {
  if (warnIfMissingConfig()) {
    return
  }

  const supabase = getSupabaseClient()
  const payload = {
    device_id: getDeviceId(),
    was_successful: Boolean(wasSuccessful),
    is_admin_attempt: Boolean(isAdminAttempt),
    attempted_at: new Date().toISOString(),
  }

  const { error } = await supabase.from(ENTRY_TABLE).insert(payload)

  if (error) {
    console.error('Failed to track entry attempt:', error.message)
  }
}

export async function trackLevelReached(sessionId, levelReached) {
  if (!sessionId || warnIfMissingConfig()) {
    return
  }

  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from(TABLE)
    .update({ level_reached: levelReached, updated_at: new Date().toISOString() })
    .eq('id', sessionId)

  if (error) {
    console.error('Failed to update level reached:', error.message)
  }
}

export async function completePlaySession(sessionId, elapsedSeconds) {
  if (!sessionId || warnIfMissingConfig()) {
    return
  }

  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from(TABLE)
    .update({
      level_reached: 3,
      final_time_seconds: elapsedSeconds,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId)

  if (error) {
    console.error('Failed to complete play session:', error.message)
  }
}
