"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function SlideNotification({ url }: { url: string }) {
  const [show, setShow] = useState(false);

  const isLoggedIn = useSelector((state: RootState) => state.user.loggedIn);
  const isUserProfileComplete = useSelector(
    (state: RootState) => state.user.me.userProfileComplete
  );

  useEffect(() => {
    // Only show if logged in AND profile is incomplete
    if (isLoggedIn && !isUserProfileComplete) {
      const alreadyShown = sessionStorage.getItem("profileReminderShown");

      if (!alreadyShown) {
        setShow(true);
        sessionStorage.setItem("profileReminderShown", "true");

        const timer = setTimeout(() => {
          setShow(false);
        }, 4000);

        return () => clearTimeout(timer);
      }
    } else {
      // reset if logged out
      sessionStorage.removeItem("profileReminderShown");
    }
  }, [isLoggedIn, isUserProfileComplete]);

  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[99999] w-[92%] max-w-sm animate-slide-down">
      <div className="bg-white shadow-lg border border-gray-200 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3">
        <span className="text-sm text-gray-700">
          Please complete your profile.
        </span>

        <Link
          href={url}
          className="shrink-0 text-primary font-semibold text-sm hover:underline"
        >
          Go to Profile
        </Link>
      </div>
    </div>
  );
}