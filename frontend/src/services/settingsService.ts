import { apiGet, apiGetAll, apiSend } from "../api/client";
import type { Page } from "../api/client";
import type {
  AccountStatus,
  ActiveSession,
  Bank,
  NotificationPrefs,
  PayoutInfo,
  PayoutInput,
  WhatsappVisibility,
} from "../types/settings";

interface ApiPayout {
  bank_name: string | null;
  account_number: string | null;
  account_name: string | null;
  pending_payout_balance: string | number | null;
}

interface ApiSession {
  id: number;
  device_label: string;
  ip_address: string | null;
  location: string | null;
  last_active: string;
}

const PREFS_KEY = "campusskill_notification_prefs";
const DEFAULT_PREFS: NotificationPrefs = { newRequests: true, statusUpdates: true, newReviews: true };

const toPayout = (row: ApiPayout): PayoutInfo => ({
  bankName: row.bank_name ?? "",
  accountNumber: row.account_number ?? "",
  accountName: row.account_name ?? "",
  pendingPayoutBalance: Number(row.pending_payout_balance ?? 0),
});

/**
 *   getAccountStatus  -> GET    /api/requests/?status=pending and ?status=accepted, /api/payouts/bank-details/
 *   deactivateAccount -> PATCH  /api/auth/settings/privacy/   { is_deactivated: true }
 *   deleteAccount     -> DELETE /api/auth/delete-account/     { password, confirm_text }
 *   changePassword    -> POST   /api/auth/change-password/    { old_password, new_password }
 *   listSessions      -> GET    /api/auth/sessions/
 *   listBanks         -> GET    /api/payouts/banks/
 *   getPayoutInfo / savePayoutInfo -> GET / PATCH /api/payouts/bank-details/
 *   getPrivacy / savePrivacy       -> GET / PATCH /api/auth/settings/privacy/
 * Notification preferences have no backend endpoint, so they stay in this browser.
 */
export const settingsService = {
  async getAccountStatus(): Promise<AccountStatus> {
    const [pending, accepted, payout] = await Promise.all([
      apiGet<Page<unknown>>("/requests/?status=pending"),
      apiGet<Page<unknown>>("/requests/?status=accepted"),
      apiGet<ApiPayout>("/payouts/bank-details/"),
    ]);
    return {
      pendingRequests: pending.count + accepted.count,
      pendingPayout: toPayout(payout).pendingPayoutBalance,
    };
  },

  async deactivateAccount(): Promise<void> {
    await apiSend("PATCH", "/auth/settings/privacy/", { is_deactivated: true });
  },

  async deleteAccount(password: string, confirmText: string): Promise<void> {
    await apiSend("DELETE", "/auth/delete-account/", { password, confirm_text: confirmText });
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiSend("POST", "/auth/change-password/", { old_password: oldPassword, new_password: newPassword });
  },

  async listSessions(): Promise<ActiveSession[]> {
    const rows = await apiGetAll<ApiSession>("/auth/sessions/");
    return rows.map((row, index) => ({
      id: row.id,
      deviceLabel: row.device_label,
      ipAddress: row.ip_address ?? "",
      location: row.location ?? "",
      lastActive: row.last_active,
      isCurrent: index === 0,
    }));
  },

  async listBanks(): Promise<Bank[]> {
    return apiGet<Bank[]>("/payouts/banks/");
  },

  async getPayoutInfo(): Promise<PayoutInfo> {
    return toPayout(await apiGet<ApiPayout>("/payouts/bank-details/"));
  },

  async savePayoutInfo(input: PayoutInput): Promise<PayoutInfo> {
    const row = await apiSend<ApiPayout>("PATCH", "/payouts/bank-details/", {
      bank_name: input.bankName,
      account_number: input.accountNumber,
      account_name: input.accountName,
    });
    return toPayout(row);
  },

  async getPrivacy(): Promise<WhatsappVisibility> {
    const row = await apiGet<{ whatsapp_visibility: WhatsappVisibility }>("/auth/settings/privacy/");
    return row.whatsapp_visibility;
  },

  async savePrivacy(next: WhatsappVisibility): Promise<WhatsappVisibility> {
    const row = await apiSend<{ whatsapp_visibility: WhatsappVisibility }>("PATCH", "/auth/settings/privacy/", {
      whatsapp_visibility: next,
    });
    return row.whatsapp_visibility;
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