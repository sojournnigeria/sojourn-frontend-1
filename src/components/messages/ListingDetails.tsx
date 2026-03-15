"use client";

import Link from "next/link";
import Image from "next/image";
import {
  X,
  ChevronRight,
  Clock,
  CheckCircle,
  ShieldCheck,
  ShieldBan,
  BedDouble,
  Bath,
  Users,
} from "lucide-react";
import DefaultAvatar from "@/components/ui/default-avatar";
import { numberOfNights } from "@/lib/utils";

interface ListingDetailsProps {
  ticketData: any;
  onClose: () => void;
}

export default function ListingDetails({
  ticketData,
  onClose,
}: ListingDetailsProps) {
  if (!ticketData) return null;

  const {
    propertyId,
    propertyPhoto,
    propertyTitle,
    location,
    price,
    amountPaid,
    cautionFee,
    bookingCheckInDate,
    bookingCheckOutDate,
    hostFullName,
    hostPhoto,
    hostVerified,
    propertyCheckInTime,
    propertyCheckOutTime,
    ammenities,
    houseRules,
    numberOfRooms,
    maxNumberOfPeople,
  } = ticketData;

  const nights =
    bookingCheckInDate && bookingCheckOutDate
      ? numberOfNights(
          new Date(bookingCheckInDate),
          new Date(bookingCheckOutDate)
        )
      : undefined;

  return (
    <div className="w-full border-l border-gray-200 bg-white flex flex-col h-screen md:h-full shadow-lg animate-slide-in">

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-y-contain">

        {/* Property Image */}
        <div className="p-4">
          <div className="relative w-full h-64 bg-gray-200 rounded-lg border-4 border-white shadow-xl overflow-hidden group">
            {propertyPhoto ? (
              <Image
                src={propertyPhoto}
                alt={propertyTitle}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <svg
                      className="w-16 h-16 mx-auto mb-2 opacity-80"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <p className="text-sm font-medium opacity-90">
                      Property Image
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>

            <Link
              href={`/properties/${propertyId}`}
              target="_blank"
              className="absolute top-3 left-3 px-3 py-1.5 bg-white text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 z-10"
            >
              View Property
            </Link>

            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition-all duration-200 active:scale-95 z-20 shadow-md hover:shadow-lg"
              aria-label="Close listing details"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Property Title */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-900 mb-1">
            {propertyTitle}
          </h2>
          {location && (
            <p className="text-sm text-gray-600 capitalize">{location}</p>
          )}
        </div>

        {/* Property Details */}
        <div className="p-4 border-b border-gray-200">
          <div className="rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-3 divide-x divide-gray-100 p-3">

              <div className="flex flex-col items-center gap-1.5 px-1">
                <BedDouble className="w-4 h-4 text-blue-500" />
                <p className="text-lg font-bold text-gray-900">
                  {numberOfRooms || "—"}
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                  Bedrooms
                </p>
              </div>

              <div className="flex flex-col items-center gap-1.5 px-1">
                <Bath className="w-4 h-4 text-purple-500" />
                <p className="text-lg font-bold text-gray-900">
                  {numberOfRooms
                    ? Math.max(1, Math.ceil(numberOfRooms / 2))
                    : "—"}
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                  Bathrooms
                </p>
              </div>

              <div className="flex flex-col items-center gap-1.5 px-1">
                <Users className="w-4 h-4 text-amber-500" />
                <p className="text-lg font-bold text-gray-900">
                  {maxNumberOfPeople || "—"}
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                  Max guests
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Amenities */}
        {ammenities?.length > 0 && (
          <div className="p-4 border-b border-gray-200">
            <h4 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Amenities
            </h4>

            <div className="flex flex-wrap gap-1.5">
              {ammenities.map((item: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs font-medium text-gray-700 capitalize shadow-sm"
                >
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* House Rules */}
        {houseRules?.length > 0 && (
          <div className="p-4 border-b border-gray-200">
            <h4 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              House rules
            </h4>

            <div className="space-y-1.5">
              {houseRules.map((rule: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <ShieldBan className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="text-xs text-gray-600 capitalize">
                    {rule}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing */}
        {price !== undefined && (
          <div className="p-4 border-b border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Price per night</p>

            <p className="text-2xl font-bold text-gray-900">
              ₦{new Number(price).toLocaleString()}
            </p>
          </div>
        )}

        {/* Host */}
        <div className="p-4 border-b border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Host
          </p>

          <div className="flex items-center gap-3">

            {hostPhoto ? (
              <Image
                src={hostPhoto}
                alt={hostFullName}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <DefaultAvatar size="md" />
            )}

            <div>
              <p className="font-semibold text-sm text-gray-900">
                {hostFullName}
              </p>

              {hostVerified && (
                <div className="flex items-center gap-1 text-emerald-600 text-xs">
                  <ShieldCheck className="w-3 h-3" />
                  Verified host
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="p-4">
          <Link
            href="/terms-of-use#refund-policy"
            target="_blank"
            className="flex items-center justify-between w-full group"
          >
            <div>
              <p className="text-xs text-gray-500 mb-1">
                Cancellation policy
              </p>
              <p className="text-sm text-gray-700 font-medium">
                {bookingCheckInDate ? "Flexible" : "Standard"}
              </p>
            </div>

            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition" />
          </Link>
        </div>

      </div>
    </div>
  );
}