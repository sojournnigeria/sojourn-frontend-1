"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function SlideNotification({ url }: { url: string }) {
  const [show, setShow] = useState(false);

  const isLoggedIn = useSelector((state: RootState) => state.user.loggedIn);

  const prevLoginState = useRef(isLoggedIn);

  useEffect(() => {
    // Detect login event (false -> true)
    if (!prevLoginState.current && isLoggedIn) {
      setShow(true);

      const timer = setTimeout(() => {
        setShow(false);
      }, 4000);

      return () => clearTimeout(timer);
    }

    prevLoginState.current = isLoggedIn;
  }, [isLoggedIn]);

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