"use client";

import React, {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  APIProvider,
  Map,
  MapMouseEvent,
  Marker,
} from "@vis.gl/react-google-maps";
import { getPropertyMapPosition } from "@/http/api";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../svgs/Spinner";
import { CreateInspectionForm } from "@/lib/utils";
import {
  MoveRight,
  MapPin,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Navigation,
} from "lucide-react";

function buildGeocodingAddress(form: CreateInspectionForm): string {
  const parts: string[] = [];
  if (form.houseNumber) parts.push(String(form.houseNumber));
  if (form.street?.trim()) parts.push(form.street.trim());
  if (form.zip?.trim()) {
    const zipParts = form.zip.split(",").map((s) => s.trim()).filter(Boolean);
    if (zipParts.length >= 2) {
      parts.push(zipParts[1]);
      parts.push(zipParts[0]);
    } else {
      parts.push(zipParts[0]);
    }
  }
  if (form.city?.trim()) parts.push(form.city.trim());
  parts.push("Nigeria");
  return parts.join(", ");
}

function buildAddressDisplay(form: CreateInspectionForm): string {
  const lines: string[] = [];
  if (form.houseNumber) lines.push(`No. ${form.houseNumber}`);
  if (form.street?.trim()) lines.push(form.street.trim());
  if (form.zip?.trim()) {
    const zipParts = form.zip.split(",").map((s) => s.trim()).filter(Boolean);
    lines.push(...zipParts);
  }
  if (form.city?.trim()) lines.push(form.city.trim());
  lines.push("Nigeria");
  return lines.join(", ");
}

const NIGERIA_CENTER = { lat: 9.082, lng: 8.6753 };

export default ({
  form,
  setForm,
  next,
  prev,
}: {
  form: CreateInspectionForm;
  setForm: Dispatch<SetStateAction<CreateInspectionForm>>;
  next: () => void;
  prev: (e: MouseEvent<HTMLButtonElement>) => void;
}) => {
  const geocodingAddress = buildGeocodingAddress(form);
  const displayAddress = buildAddressDisplay(form);
  const hasPinSet = !!(form.lat && form.lng && +form.lat && +form.lng);

  const [pinCoords, setPinCoords] = useState<{ lat: number; lng: number } | null>(
    hasPinSet ? { lat: +form.lat, lng: +form.lng } : null
  );
  const [userMoved, setUserMoved] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const { data, isLoading, error, isFetching } = useQuery({
    queryFn: () => getPropertyMapPosition(geocodingAddress),
    queryKey: ["property-position-host", geocodingAddress, retryKey],
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data && !userMoved) {
      const coords = { lat: +data.lat, lng: +data.lng };
      setPinCoords(coords);
      setForm((prev) => ({
        ...prev,
        lat: String(data.lat),
        lng: String(data.lng),
      }));
    }
  }, [data, userMoved]);

  const handleMapClick = useCallback(
    (ev: MapMouseEvent) => {
      const lat = ev.detail.latLng?.lat;
      const lng = ev.detail.latLng?.lng;
      if (lat == null || lng == null) return;
      setPinCoords({ lat, lng });
      setUserMoved(true);
      setForm((prev) => ({ ...prev, lat: String(lat), lng: String(lng) }));
    },
    [setForm]
  );

  const handleRetry = () => {
    setUserMoved(false);
    setRetryKey((k) => k + 1);
  };

  const mapCenter =
    pinCoords ?? (data ? { lat: +data.lat, lng: +data.lng } : NIGERIA_CENTER);
  const mapZoom = pinCoords || data ? 16 : 6;
  const canProceed = hasPinSet || !!pinCoords;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canProceed) next();
      }}
      className="w-full min-h-screen bg-gray-50 flex flex-col"
    >
      {/* ── Scrollable centred content ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 pb-24">
        {/* Page heading */}
        <div className="w-full max-w-[1000px] mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Pin your exact location
          </h2>
          <p className="text-sm text-gray-500">
            We've placed a pin based on your address. Tap the map to fine-tune it.
          </p>
        </div>

        {/* ── Card ── */}
        <div className="w-full max-w-[1000px] rounded-3xl shadow-[0_4px_32px_0_rgba(0,0,0,0.08)] overflow-hidden bg-white">

          {/* Address strip */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-start gap-3">
            <div className="mt-0.5 w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <MapPin size={16} className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
                Searching for
              </p>
              <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">
                {displayAddress}
              </p>
            </div>
          </div>

          {/* Map */}
          <div className="relative w-full" style={{ height: 620 }}>
            {/* Loading overlay */}
            {(isLoading || isFetching) && !pinCoords && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-2">
                <Spinner size={26} color="#E11D48" />
                <p className="text-xs font-medium text-gray-500">Locating address…</p>
              </div>
            )}

            <APIProvider
              apiKey={process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY as string}
            >
              <Map
                onClick={handleMapClick}
                style={{ width: "100%", height: "100%" }}
                defaultCenter={mapCenter}
                defaultZoom={mapZoom}
                gestureHandling="greedy"
                mapId="4098f60762d1cbb1"
              >
                {pinCoords && <Marker position={pinCoords} />}
              </Map>
            </APIProvider>

            {/* No-pin hint */}
            {!pinCoords && !isLoading && !isFetching && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur-sm shadow-md rounded-full px-4 py-2 flex items-center gap-2">
                <MapPin size={13} className="text-primary" />
                <span className="text-xs font-medium text-gray-700">
                  Tap anywhere to drop a pin
                </span>
              </div>
            )}
          </div>

          {/* Status bar */}
          <div className="px-5 py-3 flex items-center justify-between gap-3 bg-gray-50 border-t border-gray-100">
            {/* Left — status */}
            <div className="flex items-center gap-1.5 min-w-0">
              {isLoading || isFetching ? (
                <>
                  <Spinner size={12} color="gray" />
                  <span className="text-xs text-gray-500 truncate">Finding on map…</span>
                </>
              ) : error && !pinCoords ? (
                <>
                  <AlertCircle size={13} className="text-red-500 flex-shrink-0" />
                  <span className="text-xs text-red-600 truncate">
                    Couldn't auto-locate — tap the map to place your pin
                  </span>
                </>
              ) : pinCoords ? (
                <>
                  <CheckCircle size={13} className="text-green-600 flex-shrink-0" />
                  <span className="text-xs text-green-700 truncate">
                    {userMoved ? "Pin placed" : "Address found — tap to adjust"}
                  </span>
                </>
              ) : (
                <>
                  <Navigation size={13} className="text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-500 truncate">
                    Tap map to place pin
                  </span>
                </>
              )}
            </div>

            {/* Right — retry */}
            {(error || userMoved) && (
              <button
                type="button"
                onClick={handleRetry}
                className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline flex-shrink-0"
              >
                <RefreshCw size={11} />
                Re-locate
              </button>
            )}
          </div>
        </div>

        {/* Coordinates badge (shown when pin is set) */}
        {pinCoords && (
          <div className="mt-5 flex items-center gap-2 bg-white border border-gray-100 rounded-full px-5 py-2 shadow-sm text-sm text-gray-500">
            <MapPin size={14} className="text-primary" />
            <span>
              {pinCoords.lat.toFixed(5)}, {pinCoords.lng.toFixed(5)}
            </span>
          </div>
        )}
      </div>

      {/* ── Fixed footer ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-[60px] flex items-center justify-between px-5 z-30">
        <button
          type="button"
          onClick={prev}
          className="text-sm py-2 px-6 text-gray-700 font-semibold hover:text-black transition-colors underline"
        >
          Back
        </button>

        <button
          type="submit"
          disabled={!canProceed}
          className={`text-sm py-2 px-7 flex items-center gap-2 rounded-full font-semibold transition-all duration-200 ${
            canProceed
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <span>Next</span>
          <MoveRight size={17} color={canProceed ? "white" : "#9ca3af"} />
        </button>
      </div>
    </form>
  );
};
