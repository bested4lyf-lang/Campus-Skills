export type NotificationEvent =
  | "request_received"
  | "request_accepted"
  | "request_rejected"
  | "request_completed"
  | "review_received";

// Named AppNotification so it doesn't clash with the browser's built-in Notification
export interface AppNotification {
  id: number;
  eventType: NotificationEvent;
  title: string;
  message: string;
  /** Route to open when the notification is clicked */
  deepLink: string;
  isRead: boolean;
  createdAt: string;
  /** Ready-made label such as "10 minutes ago" */
  timeAgo: string;
}

export interface NotificationFeed {
  unreadCount: number;
  results: AppNotification[];
}