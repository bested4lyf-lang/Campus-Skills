const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

/** 15000 -> "₦15,000" */
export function formatNaira(amount: number): string {
  return naira.format(amount);
}
