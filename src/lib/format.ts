import { translations, type Language } from "@/lib/i18n/translations";

export function formatRelativeTime(dateStr: string, lang: Language = "ko"): string {
  const t = translations[lang].common.relativeTime;
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return t.justNow;
  if (minutes < 60) return t.minutesAgo(minutes);

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t.hoursAgo(hours);

  const days = Math.floor(hours / 24);
  if (days < 30) return t.daysAgo(days);

  const months = Math.floor(days / 30);
  if (months < 12) return t.monthsAgo(months);

  return t.yearsAgo(Math.floor(months / 12));
}
