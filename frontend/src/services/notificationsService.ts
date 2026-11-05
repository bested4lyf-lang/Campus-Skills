import { apiGet, apiSend } from "../api/client";
import type { AppNotification, NotificationEvent, NotificationFeed } from "../types/notifications";

interface ApiNotification {
  id: number;
  event_type: NotificationEvent;
  title: string;
  message: string;
  deep_link: string | null;
  is_read: boolean;
  created_at: string;
  time_ago: string;
}

interface ApiFeed {
  unread_count?: number;
  results?: ApiNotification[];
}

function toNotification(n: ApiNotification): AppNotification {
  return {
    id: n.id,
    eventType: n.event_type,
    title: n.title,
    message: n.message,
    deepLink: n.deep_link || "/activity",
    isRead: n.is_read,
    createdAt: n.created_at,
    timeAgo: n.time_ago,
  };
}

/** GET /api/notifications/ -> { unread_count, results } */
async function list(): Promise<NotificationFeed> {
  const data = await apiGet<ApiFeed>("/notifications/");
  const results = (data.results ?? []).map(toNotification);
  return {
    unreadCount: data.unread_count ?? results.filter((n) => !n.isRead).length,
    results,
  };
}

export const notificationsService = {
  list,

  /** PATCH /api/notifications/<id>/read/ */
  async markRead(id: number): Promise<NotificationFeed> {
    await apiSend("PATCH", `/notifications/${id}/read/`);
    return list();
  },

  /** POST /api/notifications/mark-all-read/ */
  async markAllRead(): Promise<NotificationFeed> {
    await apiSend("POST", "/notifications/mark-all-read/");
    return list();
  },
};