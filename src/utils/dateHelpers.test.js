import { isToday, isDueSoon, formatDate, getNextDays, toLocalISODate } from './dateHelpers';

function localISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

describe('dateHelpers', () => {
  describe('isToday', () => {
    test('returns true for today', () => {
      expect(isToday(localISO(new Date()))).toBe(true);
    });

    test('returns false for yesterday', () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      expect(isToday(localISO(d))).toBe(false);
    });

    test('returns false for tomorrow', () => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      expect(isToday(localISO(d))).toBe(false);
    });
  });

  describe('isDueSoon', () => {
    test('returns true for today', () => {
      expect(isDueSoon(localISO(new Date()))).toBe(true);
    });

    test('returns true for a date within default 3 days', () => {
      const d = new Date();
      d.setDate(d.getDate() + 2);
      expect(isDueSoon(localISO(d))).toBe(true);
    });

    test('returns false for a date beyond the window', () => {
      const d = new Date();
      d.setDate(d.getDate() + 5);
      expect(isDueSoon(localISO(d))).toBe(false);
    });

    test('returns false for a past date', () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      expect(isDueSoon(localISO(d))).toBe(false);
    });

    test('respects custom days parameter', () => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      expect(isDueSoon(localISO(d), 7)).toBe(true);
      expect(isDueSoon(localISO(d), 6)).toBe(false);
    });
  });

  describe('formatDate', () => {
    test('returns a non-empty string', () => {
      expect(formatDate('2026-03-15')).toBeTruthy();
    });

    test('includes the day number', () => {
      expect(formatDate('2026-03-15')).toMatch(/15/);
    });
  });

  describe('getNextDays', () => {
    test('returns 30 days by default', () => {
      expect(getNextDays()).toHaveLength(30);
    });

    test('first entry is today', () => {
      expect(getNextDays()[0]).toBe(localISO(new Date()));
    });

    test('entries are sequential YYYY-MM-DD strings', () => {
      const days = getNextDays(5);
      for (let i = 1; i < days.length; i++) {
        const prev = new Date(days[i - 1] + 'T00:00:00');
        const curr = new Date(days[i] + 'T00:00:00');
        expect(curr - prev).toBe(86400000);
      }
    });

    test('respects custom count', () => {
      expect(getNextDays(7)).toHaveLength(7);
    });
  });

  describe('toLocalISODate', () => {
    test('formats date correctly', () => {
      expect(toLocalISODate(new Date(2026, 2, 5))).toBe('2026-03-05');
    });

    test('pads single-digit month and day', () => {
      expect(toLocalISODate(new Date(2026, 0, 1))).toBe('2026-01-01');
    });
  });
});
