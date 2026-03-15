"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SlideNotification({ url }: { url: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);

    const timer = setTimeout(() => {
      setShow(false);
    }, 5000); // visible for 5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[99999] w-[82%] max-w-lg animate-slide-down">
      <div className="bg-white shadow-xl border border-gray-200 rounded-2xl px-5 py-3 sm:px-7 sm:py-4 flex items-center justify-between gap-3">
        
        <span className="text-base sm:text-lg text-gray-800 font-medium">
          Please complete your profile to unlock all features.
        </span>

        <Link
          href={url}
          className="shrink-0 bg-primary text-white font-semibold text-sm sm:text-base px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Go to Profile
        </Link>

      </div>
    </div>
  );
}