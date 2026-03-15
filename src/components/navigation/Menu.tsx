"use client";

import { useSelector } from "react-redux";
import NetworkBanner from "../network/network-banner";
import { useConnection } from "../network/network-provider";
import MenuSSR from "./MenuSSR";
import dynamic from "next/dynamic";
import { RootState } from "@/store";
import Notification from "../notification/notification";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNotification } from "../notification/notification-provider";
import SlideNotification from "../notification/SlideNotification";

const MobileListMenuComponent = dynamic(() => import("./MobileListMenu"));
const Menu = () => {
  const { isOnline } = useConnection();
  const isUserProfileComplete = useSelector(
    (state: RootState) => state.user.me.userProfileComplete
  );

  const isLoggedIn = useSelector((state: RootState) => state.user.loggedIn);

  const pathname = usePathname();

  const isNotProiflePage =
    pathname !== "/dashboard/profile" &&
    pathname !== "/hosts/dashboard/manage-profile";

  const url = pathname.includes("/hosts")
    ? "/hosts/dashboard/manage-profile"
    : "/dashboard/profile";

  const isHostCreationPage = !pathname.includes(
    "/hosts/dashboard/properties/create"
  );

  const { type } = useNotification();

  const pClass = type === "message" ? "text-green-700" : "text-amber-700";

  const linkClass =
    type === "message"
      ? "text-green-700 underline"
      : "text-amber-700 underline";

  const message = (
    <p className={pClass}>
      Please complete your profile as soon as possible...
      <Link className={linkClass} href={url} prefetch>
        Go to Profile
      </Link>
    </p>
  );

  return isHostCreationPage ? (
    //<div className="w-full sticky bg-paper top-0 z-[9999] font-sans ">
    <div className="w-full fixed bg-primary top-0 left-0 z-[9999] font-sans"> 
    {isOnline === "not-connected" ? <NetworkBanner /> : null}
      {!isUserProfileComplete && isNotProiflePage && isLoggedIn ? (
        // <Notification message={message} />
        <SlideNotification url={url} />
      ) : null}
      <MenuSSR />
      <MobileListMenuComponent />
    </div>
  ) : null;
};

export default Menu;
