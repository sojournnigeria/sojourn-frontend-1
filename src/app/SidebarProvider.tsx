"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isCreateProperty = pathname.startsWith(
    "/hosts/dashboard/properties/create"
  );

  const paddingClass = isHome
    ? "sm:pt-20 py-0"
    : isCreateProperty
    ? ""
    : "pt-20";

  return <div className={`w-full min-h-screen ${paddingClass}`}>{children}</div>;
}