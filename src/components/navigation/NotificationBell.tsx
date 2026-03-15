"use client";

import { getNotifications } from "@/http/api";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  MessageSquare,
  CalendarCheck,
  CalendarX,
  Star,
  FileCheck,
  FileX,
  CreditCard,
  Inbox,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Notification, NotificationType } from "@/types/notifications";

const NOTIFICATION_ICONS: Record<
  NotificationType,
  React.ComponentType<{ className?: string }>
> = {
  message_guest: MessageSquare,
  message_host: MessageSquare,
  booking_new: CalendarCheck,
  booking_cancelled: CalendarX,
  review_new: Star,
  inspection_approved: FileCheck,
  inspection_cancelled: FileX,
  subscription_renewal: CreditCard,
};

const ICON_COLORS: Record<NotificationType, string> = {
  message_guest: "text-blue-500",
  message_host: "text-blue-500",
  booking_new: "text-emerald-500",
  booking_cancelled: "text-amber-500",
  review_new: "text-amber-400",
  inspection_approved: "text-emerald-500",
  inspection_cancelled: "text-red-500",
  subscription_renewal: "text-violet-500",
};

function formatNotificationDate(createdAt: string): string {
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

type NotificationBellProps = {
  userId: string;
  role?: "guest" | "host";
};

export default function NotificationBell({ userId, role }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["notification-bell", userId, role],
    queryFn: () => getNotifications(userId, role),
    enabled: !!userId,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  const notifications: Notification[] = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;
  const hasNotifications = unreadCount > 0 || notifications.length > 0;
  const displayNotifications = notifications.slice(0, 8);

  const viewAllLink =
    role === "host" ? "/hosts/dashboard/inbox" : "/dashboard/inbox";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      {/* Bell Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <span className="notification-badge absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1 ring-2 ring-primary">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          className="
          absolute top-[calc(100%+8px)]
          left-1/2 -translate-x-1/2
          w-[92vw] max-w-sm
          sm:left-auto sm:translate-x-0 sm:right-0 sm:w-80
          bg-white rounded-xl shadow-2xl border border-gray-100
          z-[99999] overflow-hidden notification-dropdown-enter
        "
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="text-xs text-primary font-medium">
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[360px] overflow-y-auto">
            {displayNotifications.length > 0 ? (
              displayNotifications.map((notification) => {
                const Icon = NOTIFICATION_ICONS[notification.type];
                const iconColor = ICON_COLORS[notification.type];

                return (
                  <Link
                    key={notification.id}
                    href={notification.link}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className="shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {notification.title}
                        </p>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                          {formatNotificationDate(notification.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {notification.message}
                      </p>

                      {!notification.read && (
                        <span className="inline-flex mt-1 px-1.5 py-0.5 rounded-full bg-red-50 text-[10px] font-semibold text-red-600">
                          New
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Inbox className="w-6 h-6 text-gray-400" />
                </div>

                <p className="text-sm font-medium text-gray-500">
                  No new notifications
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  You&apos;re all caught up
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100">
            <Link
              href={viewAllLink}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-primary hover:bg-gray-50 transition-colors"
            >
              View all in inbox
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}