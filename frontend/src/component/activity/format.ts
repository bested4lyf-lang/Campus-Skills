const naira = new Intl.NumberFormat("en-NG");
const monthDay = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const weekdayMonthDay = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

/** 15000 -> "₦15,000" */
export const formatNaira = (amount: number) => `₦${naira.format(amount)}`;

/** "2026-10-08T09:30:00" -> "Oct 8" */
export const formatShortDate = (iso: string) => monthDay.format(new Date(iso));

/** "2026-10-17T15:00:00" -> "Sat, Oct 17 • 3:00 PM" */
export const formatNeededBy = (iso: string) => {
  const date = new Date(iso);
  return `${weekdayMonthDay.format(date)} • ${time.format(date)}`;
};