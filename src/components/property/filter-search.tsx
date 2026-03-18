"use client";

import { AMMENITIES } from "@/constants";
import { Slider } from "../ui/slider";
import { Dispatch, SetStateAction, useState } from "react";
import useQueryString from "@/hooks/useQueryString";
import { getNonFalsyKeys } from "@/lib/utils";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import {
  BedDouble,
  Home,
  Hotel,
  Star,
  RotateCcw,
  X,
} from "lucide-react";

type ApartmentType = {
  townHouse: boolean;
  primeInn: boolean;
};

type NumberOfRooms = {
  one: boolean;
  two: boolean;
  three: boolean;
  greaterThan3: boolean;
};

type CloseMobileSearchType = ActionCreatorWithPayload<
  boolean,
  "host/setMobileSearchStatus"
>;

const PROPERTY_TYPES = [
  { key: "townHouse", label: "Town House", icon: Home },
  { key: "primeInn", label: "Prime Inn", icon: Hotel },
] as const;

const ROOM_OPTIONS = [
  { key: "one", value: 1, label: "1" },
  { key: "two", value: 2, label: "2" },
  { key: "three", value: 3, label: "3" },
  { key: "greaterThan3", value: 4, label: "4+" },
] as const;

const RATING_OPTIONS = [5, 4, 3, 2, 1] as const;

export default ({
  setOpen,
  setMobileSearchStatus,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setMobileSearchStatus: CloseMobileSearchType;
}) => {
  const { router } = useQueryString();
  const dispatch = useDispatch();
  const { params } = useQueryString();

  const [price, setPrice] = useState([5000]);
  const [minRating, setMinRating] = useState<number | null>(null);

  const [apartments, setApartment] = useState<ApartmentType>({
    primeInn: false,
    townHouse: false,
  });

  const [rooms, setRooms] = useState<NumberOfRooms>({
    one: false,
    two: false,
    three: false,
    greaterThan3: false,
  });

  const [roomValues, setRoomValues] = useState<number[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);

  const tomorrow = new Date(Date.now() + 86400000);
  const city = params.get("city") as string;
  const adults = Number(params.get("adults"));
  const children = Number(params.get("children"));
  const checkInDate = params.get("check-in")
    ? new Date(params.get("check-in") as string)
    : new Date();
  const checkOutDate = params.get("check-out")
    ? new Date(params.get("check-out") as string)
    : tomorrow;
  const infants = Number(params.get("infants"));

  const queryParamString =
    `/properties?city=${city}&adults=${adults}&children=${children}&infants=${infants}&check-in=${checkInDate}&check-out=${checkOutDate}&types_of_property=${getNonFalsyKeys(apartments)}&number_of_rooms=${roomValues.join(",")}&price=${price ? +price : null}&amenities=${amenities.join(",")}`.trim();

  function closeMobileMenu() {
    setOpen(false);
    dispatch(setMobileSearchStatus(false));
  }

  function toggleRoom(key: keyof NumberOfRooms, value: number) {
    const isPresent = roomValues.includes(value);
    if (isPresent) {
      setRoomValues((prev) => prev.filter((v) => v !== value));
    } else {
      setRoomValues((prev) => [...prev, value]);
    }
    setRooms((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleAmenity(text: string) {
    setAmenities((prev) =>
      prev.includes(text) ? prev.filter((a) => a !== text) : [...prev, text]
    );
  }

  function resetAll() {
    setApartment({ primeInn: false, townHouse: false });
    setRooms({ one: false, two: false, three: false, greaterThan3: false });
    setRoomValues([]);
    setAmenities([]);
    setPrice([5000]);
    setMinRating(null);
  }

  const activeCount =
    Object.values(apartments).filter(Boolean).length +
    roomValues.length +
    amenities.length +
    (price[0] > 5000 ? 1 : 0) +
    (minRating ? 1 : 0);

  return (
    <div className="flex flex-col max-h-[75vh]">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Property Type */}
        <section>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Property type
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {PROPERTY_TYPES.map(({ key, label, icon: Icon }) => {
              const active = apartments[key as keyof ApartmentType];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setApartment((prev) => ({
                      ...prev,
                      [key]: !prev[key as keyof ApartmentType],
                    }))
                  }
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    active
                      ? "border-primary bg-red-50 text-primary"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={22} strokeWidth={1.5} />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Bedrooms */}
        <section>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Bedrooms
          </h4>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setRooms({
                  one: false,
                  two: false,
                  three: false,
                  greaterThan3: false,
                });
                setRoomValues([]);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                roomValues.length === 0
                  ? "border-primary bg-red-50 text-primary"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              Any
            </button>
            {ROOM_OPTIONS.map(({ key, value, label }) => {
              const active = rooms[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleRoom(key, value)}
                  className={`w-12 h-10 rounded-full text-sm font-medium border transition-all flex items-center justify-center ${
                    active
                      ? "border-primary bg-red-50 text-primary"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Price Range */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-900">
              Price range
            </h4>
            <span className="text-sm font-bold text-primary">
              ₦{price[0].toLocaleString()}
              {price[0] >= 1000000 ? "" : "+"}
            </span>
          </div>
          <div className="px-1">
            <Slider
              defaultValue={price}
              value={price}
              min={5000}
              max={1000000}
              step={5000}
              className="w-full"
              onValueChange={(value: number[]) => setPrice(value)}
            />
          </div>
          <div className="flex justify-between mt-2 text-[11px] text-gray-400">
            <span>₦5,000</span>
            <span>₦1,000,000</span>
          </div>
        </section>

        {/* Amenities */}
        <section>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Amenities
          </h4>
          <div className="flex flex-wrap gap-2">
            {AMMENITIES.map((amenity, idx) => {
              const active = amenities.includes(amenity.text);
              const Icon = amenity.Icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleAmenity(amenity.text)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm border transition-all ${
                    active
                      ? "border-primary bg-red-50 text-primary font-medium"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={15} strokeWidth={1.5} />
                  <span className="capitalize">{amenity.text}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Guest Rating */}
        <section>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Guest rating
          </h4>
          <div className="flex gap-2">
            {RATING_OPTIONS.map((rating) => {
              const active = minRating === rating;
              return (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setMinRating(active ? null : rating)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm border transition-all ${
                    active
                      ? "border-primary bg-red-50 text-primary font-medium"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <Star
                    size={13}
                    fill={active ? "currentColor" : "none"}
                    strokeWidth={1.5}
                  />
                  <span>{rating}+</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Fixed bottom bar */}
      <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={resetAll}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
        >
          <RotateCcw size={14} />
          Clear all
          {activeCount > 0 && (
            <span className="ml-1 bg-gray-200 text-gray-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </button>
        <button
          onClick={() => {
            router.push(queryParamString);
            closeMobileMenu();
          }}
          className="px-8 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-red-700 transition-colors shadow-sm"
        >
          Show results
        </button>
      </div>
    </div>
  );
};
