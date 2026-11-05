const naira = new Intl.NumberFormat("en-NG");

/** 15000 -> "₦15,000" */
export const formatNaira = (amount: number) => `₦${naira.format(amount)}`;