"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Inbox = dynamic(() => import("@/components/pages/inbox"), { ssr: false });

export default () => {
  return (
    <Suspense fallback={<></>}>
      <Inbox />
    </Suspense>
  );
};
