export type SettingsTab = "security" | "payout" | "notifications" | "privacy" | "danger";

/** What blocks a student from deleting their account */
export interface AccountStatus {
  pendingRequests: number;
  /** Naira awaiting payout */
  pendingPayout: number;
}

export type WhatsappVisibility = "accepted_only" | "public" | "private";

export interface ActiveSession {
  id: number;
  deviceLabel: string;
  ipAddress: string;
  location: string;
  /** ISO date-time */
  lastActive: string;
  isCurrent?: boolean;
}

export interface Bank {
  code: string;
  name: string;
}

export interface PayoutInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
  pendingPayoutBalance: number;
}

export type PayoutInput = Pick<PayoutInfo, "bankName" | "accountNumber" | "accountName">;

export interface NotificationPrefs {
  newRequests: boolean;
  statusUpdates: boolean;
  newReviews: boolean;
}