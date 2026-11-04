import type {
  AccountStatus,
  ActiveSession,
  Bank,
  NotificationPrefs,
  PayoutInfo,
  PayoutInput,
  WhatsappVisibility,
} from "../types/settings";

/**
 * In-memory stand-in for the account endpoints. Each method becomes one call later:
 *   getAccountStatus      -> GET    /api/requests/ and /api/auth/settings/payout/
 *   deactivateAccount     -> PATCH  /api/auth/settings/privacy/  { is_deactivated: true }
 *   deleteAccount         -> DELETE /api/auth/delete-account/    { password, confirm_text }
 *   changePassword        -> POST   /api/auth/change-password/   { old_password, new_password }
 *   listSessions          -> GET    /api/auth/sessions/
 *   listBanks             -> GET    /api/payouts/banks/
 *   getPayoutInfo/save    -> GET/PUT /api/auth/settings/payout/
 *   getPrivacy/savePrivacy-> GET/PATCH /api/auth/settings/privacy/ { whatsapp_visibility }
 * Notification preferences have no backend endpoint, so they stay in this browser.
 * To test the unblocked delete flow, set PENDING_REQUESTS and pendingPayoutBalance to 0.
 */
const PENDING_REQUESTS = 2;
const PREFS_KEY = "campusskill_notification_prefs";
const DEFAULT_PREFS: NotificationPrefs = { newRequests: true, statusUpdates: true, newReviews: true };

// Same codes as the backend list (shortened for the demo)
const BANKS: Bank[] = [
  { code: "access", name: "Access Bank" },
  { code: "firstbank", name: "First Bank of Nigeria" },
  { code: "gtbank", name: "Guaranty Trust Bank (GTBank)" },
  { code: "uba", name: "United Bank for Africa (UBA)" },
  { code: "zenith", name: "Zenith Bank" },
  { code: "fcmb", name: "First City Monument Bank (FCMB)" },
  { code: "fidelity", name: "Fidelity Bank" },
  { code: "polaris", name: "Polaris Bank" },
  { code: "stanbic", name: "Stanbic IBTC Bank" },
  { code: "sterling", name: "Sterling Bank" },
  { code: "union", name: "Union Bank of Nigeria" },
  { code: "wema", name: "Wema Bank" },
  { code: "ecobank", name: "Ecobank Nigeria" },
  { code: "providus", name: "Providus Bank" },
  { code: "jaiz", name: "Jaiz Bank" },
  { code: "opay", name: "OPay" },
  { code: "palmpay", name: "PalmPay" },
  { code: "kuda", name: "Kuda Bank" },
  { code: "moniepoint", name: "Moniepoint MFB" },
  { code: "fairmoney", name: "FairMoney MFB" },
];

let payout: PayoutInfo = {
  bankName: "",
  accountNumber: "",
  accountName: "",
  pendingPayoutBalance: 8000,
};
let visibility: WhatsappVisibility = "accepted_only";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

export const settingsService = {
  async getAccountStatus(): Promise<AccountStatus> {
    await wait(250);
    return { pendingRequests: PENDING_REQUESTS, pendingPayout: payout.pendingPayoutBalance };
  },

  async deactivateAccount(): Promise<void> {
    await wait(400);
  },

  async deleteAccount(password: string, confirmText: string): Promise<void> {
    await wait(500);
    if (confirmText !== "DELETE") {
      throw new Error("You must type 'DELETE' to confirm account deletion.");
    }
    if (!password) {
      throw new Error("Please enter your password.");
    }
    if (PENDING_REQUESTS > 0 || payout.pendingPayoutBalance > 0) {
      throw new Error(
        "Cannot delete account: you still have pending requests or an awaiting payout. Resolve them first.",
      );
    }
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await wait(500);
    if (!oldPassword) throw new Error("Current password is incorrect.");
    if (newPassword.length < 8) {
      throw new Error("This password is too short. It must contain at least 8 characters.");
    }
  },

  async listSessions(): Promise<ActiveSession[]> {
    await wait(250);
    return [
      { id: 1, deviceLabel: "Chrome on Windows", ipAddress: "102.89.0.10", location: "Lagos, Nigeria", lastActive: hoursAgo(0), isCurrent: true },
      { id: 2, deviceLabel: "Safari on iPhone", ipAddress: "102.89.0.24", location: "Lagos, Nigeria", lastActive: hoursAgo(5) },
    ];
  },

  async listBanks(): Promise<Bank[]> {
    await wait(150);
    return BANKS.map((bank) => ({ ...bank }));
  },

  async getPayoutInfo(): Promise<PayoutInfo> {
    await wait(250);
    return { ...payout };
  },

  async savePayoutInfo(input: PayoutInput): Promise<PayoutInfo> {
    await wait(500);
    const accountNumber = input.accountNumber.trim().replace(/[\s-]/g, "");
    if (!/^\d{10}$/.test(accountNumber)) {
      throw new Error("NUBAN account number must be exactly 10 numerical digits.");
    }
    const accountName = input.accountName.trim();
    if (accountName.length < 3) {
      throw new Error("Please enter a valid account name matching your bank records.");
    }
    if (!BANKS.some((bank) => bank.code === input.bankName)) {
      throw new Error("Please choose a bank from the list.");
    }
    payout = { ...payout, bankName: input.bankName, accountNumber, accountName };
    return { ...payout };
  },

  async getPrivacy(): Promise<WhatsappVisibility> {
    await wait(200);
    return visibility;
  },

  async savePrivacy(next: WhatsappVisibility): Promise<WhatsappVisibility> {
    await wait(400);
    visibility = next;
    return visibility;
  },

  getNotificationPrefs(): NotificationPrefs {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      return raw ? { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<NotificationPrefs>) } : { ...DEFAULT_PREFS };
    } catch {
      return { ...DEFAULT_PREFS };
    }
  },

  saveNotificationPrefs(prefs: NotificationPrefs): void {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
      // Storage can be blocked; the switches still work for this visit
    }
  },
};