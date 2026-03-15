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
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[99999] animate-slide-down">
      <div className="bg-white shadow-xl border border-gray-200 rounded-xl px-6 py-3 flex items-center gap-3">
        <span className="text-sm text-gray-700">
          Please complete your profile.
        </span>

        <Link
          href={url}
          className="text-primary font-semibold text-sm hover:underline"
        >
          Go to Profile
        </Link>
      </div>
    </div>
  );
}