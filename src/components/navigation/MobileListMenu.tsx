"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMenuState } from "@/context/MenuContext";
import ChevronDownIcon from "../svgs/chevronDownIcon";
import { usePathname } from "next/navigation";
import ProfileMenu from "./hosts/profile-menu";
import React from "react";
import { setCurrency } from "@/store/features/currency-slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

let currentRoute: string;

const MobileListMenu = () => {
  const modalRef = useRef(null);

  const currency = useSelector((state: RootState) => state.currency.currency);

  currentRoute = usePathname();

  const dispatch = useDispatch();

  const { isMenuOpen, setMenuOpen } = useMenuState();

  const [preferences, setPreferences] = useState({
    currency: {
      selected: "naira",
      open: false,
    },
    language: {
      selected: "english",
      open: false,
    },
  });

  const closeModal = () => {
    setMenuOpen(false);
  };

  const handleClickOutside = (event: Event) => {
    //@ts-ignore
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
    event.stopPropagation();
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    closeModal();
  }, [currentRoute]);

  useEffect(() => {
    if (currency === "NGN") {
      setPreferences((prevState) => ({
        ...prevState,
        currency: {
          ...prevState.currency,
          selected: "naira",
        },
      }));
    } else {
      setPreferences((prevState) => ({
        ...prevState,
        currency: {
          ...prevState.currency,
          selected: "dollar",
        },
      }));
    }
  }, [currency]);

  return (
    <div
      style={{ display: isMenuOpen ? "flex " : "none" }}
      ref={modalRef}
className="absolute z-[99999] w-full min-h-[140px] ease duration-300 shadow-navbar-shadow bg-paper flex-col sm:absolute sm:top-full sm:right-6 sm:w-[200px]"    >
      <ul className="w-full h-full p-0 m-0 overflow-hidden text-black font-[500] text-[14px] relative">
        <li className="w-full block py-3 px-5 sm:hidden list-none">
          <div
            onClick={(e) => {
              setPreferences((prevState) => ({
                ...prevState,
                currency: {
                  ...prevState.currency,
                  open: !prevState.currency.open,
                },
              }));
            }}
            className="w-full flex items-center justify-between"
          >
            <div>
              {preferences.currency.selected === "naira"
                ? "NGN (₦)"
                : "USD ($)"}
            </div>
            <ChevronDownIcon size={14} />
          </div>
          {preferences.currency.open && (
            <ul className="w-full list-none px-5">
              <li
                className="w-full list-none py-3"
                onClick={(e) => {
                  dispatch(setCurrency("NGN"));
                  setPreferences((prevState) => ({
                    ...prevState,
                    currency: {
                      ...prevState.currency,
                      selected: "naira",
                    },
                  }));
                }}
              >
                NGN (₦)
              </li>
              <li
                className="w-full list-none py-3"
                onClick={(e) => {
                  dispatch(setCurrency("USD"));
                  setPreferences((prevState) => ({
                    ...prevState,
                    currency: {
                      ...prevState.currency,
                      selected: "dollar",
                    },
                  }));
                }}
              >
                USD ($)
              </li>
            </ul>
          )}
        </li>
        <li className="w-full block py-3 px-5 sm:hidden">
          <div
            onClick={(e) => {
              setPreferences((prevState) => ({
                ...prevState,
                language: {
                  ...prevState.language,
                  open: !prevState.language.open,
                },
              }));
            }}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center space-x-1">
              <>
                {preferences.language.selected === "english" ? (
                  <Image
                    src="/assets/icons/english-flag.png"
                    alt="english flag"
                    width={15}
                    height={15}
                  />
                ) : (
                  <Image
                    src="/assets/icons/french-flag.png"
                    alt="french flag"
                    width={15}
                    height={15}
                  />
                )}
              </>
              <span>
                {preferences.language.selected === "english" ? "EN" : "FR"}
              </span>
            </div>
            <ChevronDownIcon size={14} />
          </div>
          {preferences.language.open && (
            <ul className="w-full list-none px-5">
              <li
                className="w-full list-none py-3"
                onClick={(e) => {
                  setPreferences((prevState) => ({
                    ...prevState,
                    language: {
                      ...prevState.language,
                      selected: "english",
                    },
                  }));
                }}
              >
                EN
              </li>
              <li
                className="w-full list-none py-3"
                onClick={(e) => {
                  setPreferences((prevState) => ({
                    ...prevState,
                    language: {
                      ...prevState.language,
                      selected: "french",
                    },
                  }));
                }}
              >
                FR
              </li>
            </ul>
          )}
        </li>
        <ProfileMenu />
      </ul>
    </div>
  );
};

export default MobileListMenu;
