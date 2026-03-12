/**
 * Returns today's date as a YYYY-MM-DD string in local time.
 */
export function todayStr() {
  const d = new Date();
  return toLocalISODate(d);
}

/**
 * Converts a Date object to a YYYY-MM-DD string using local time,
 * avoiding UTC offset issues that come with toISOString().
 */
export function toLocalISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Returns true if the given YYYY-MM-DD string matches today's local date.
 */
export function isToday(dateStr) {
  return dateStr === todayStr();
}

/**
 * Returns true if dateStr falls within the next `days` calendar days from today (inclusive).
 */
export function isDueSoon(dateStr, days = 3) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  const cutoff = new Date(today);
  cutoff.setDate(today.getDate() + days);
  return target >= today && target <= cutoff;
}

/**
 * Formats a YYYY-MM-DD string to a human-readable short date, e.g. "Mon Mar 15".
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

/**
 * Returns an array of YYYY-MM-DD strings for the next `count` days starting from today.
 */
export function getNextDays(count = 30) {
  const days = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(toLocalISODate(d));
  }
  return days;
}
