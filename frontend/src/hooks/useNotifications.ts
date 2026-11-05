import { useCallback, useEffect, useState } from "react";
import { notificationsService } from "../services/notificationsService";
import type { NotificationFeed } from "../types/notifications";

const EMPTY: NotificationFeed = { unreadCount: 0, results: [] };

export function useNotifications() {
  const [feed, setFeed] = useState<NotificationFeed>(EMPTY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setFeed(await notificationsService.list());
    } catch {
      setError("We couldn't load your notifications.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const markRead = useCallback(async (id: number) => {
    try {
      setFeed(await notificationsService.markRead(id));
    } catch {
      // The alert just stays unread
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      setFeed(await notificationsService.markAllRead());
    } catch {
      // Same as above
    }
  }, []);

  return {
    notifications: feed.results,
    unreadCount: feed.unreadCount,
    isLoading,
    error,
    reload,
    markRead,
    markAllRead,
  };
}