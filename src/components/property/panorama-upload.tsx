"use client";

import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import {
  Camera,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Smartphone,
  ScanLine,
  MonitorSmartphone,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

export interface PanoramaFile {
  id: string;
  label: string;
  file?: File;
  previewUrl: string;
}

interface PanoramaUploadProps {
  panoramas: PanoramaFile[];
  onChange: (panoramas: PanoramaFile[]) => void;
  maxFiles?: number;
}

const ROOM_LABELS = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Dining Room",
  "Balcony",
  "Study",
  "Hallway",
  "Guest Room",
  "Master Bedroom",
];

function HowToGuide() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3 rounded-xl border border-black/8 bg-gradient-to-br from-gray-50/80 to-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Lightbulb size={15} className="text-amber-500" />
          <span className="text-xs font-semibold text-black/70">
            How to capture 360° photos for your apartment
          </span>
        </div>
        {open ? (
          <ChevronUp size={14} className="text-black/40" />
        ) : (
          <ChevronDown size={14} className="text-black/40" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 text-xs text-black/60 leading-relaxed">
          <div className="h-px bg-black/5" />

          {/* Option 1: Google Street View */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Smartphone size={14} className="text-blue-500" />
              </div>
              <h4 className="text-xs font-bold text-black/80">
                Option 1: Google Street View App (Free)
              </h4>
            </div>
            <ol className="ml-9 space-y-1.5 list-decimal list-outside marker:text-black/30 marker:font-semibold">
              <li>
                Download the <span className="font-semibold text-black/80">Google Street View</span> app
                (available on <span className="font-medium">iOS</span> and <span className="font-medium">Android</span>)
              </li>
              <li>
                Open the app and tap the <span className="font-semibold text-black/80">camera icon</span> to
                start a new 360° photo
              </li>
              <li>
                Stand in the <span className="font-semibold text-black/80">center of the room</span> and
                hold your phone at chest height
              </li>
              <li>
                Follow the orange dots — slowly <span className="font-semibold text-black/80">rotate in a full circle</span>,
                tilting up and down as guided
              </li>
              <li>
                The app will automatically stitch the photos into a single 360° panorama
              </li>
              <li>
                <span className="font-semibold text-black/80">Save the image</span> to your camera roll,
                then upload it here
              </li>
            </ol>
          </div>

          {/* Option 2: 360° Camera */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                <ScanLine size={14} className="text-purple-500" />
              </div>
              <h4 className="text-xs font-bold text-black/80">
                Option 2: 360° Camera
              </h4>
            </div>
            <p className="ml-9">
              Use a dedicated 360° camera like <span className="font-semibold text-black/80">Ricoh Theta</span>,{" "}
              <span className="font-semibold text-black/80">Insta360</span>, or{" "}
              <span className="font-semibold text-black/80">GoPro MAX</span>.
              Place it on a tripod in the center of each room, take one shot, and export the image.
            </p>
          </div>

          {/* Tips */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <CheckCircle2 size={14} className="text-emerald-500" />
              </div>
              <h4 className="text-xs font-bold text-black/80">
                Tips for the best results
              </h4>
            </div>
            <ul className="ml-9 space-y-1.5">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                <span>Tidy up the room and turn on all the lights</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                <span>Shoot during <span className="font-medium text-black/70">daytime</span> with curtains open for natural light</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                <span>Stand in the <span className="font-medium text-black/70">center</span> of each room — avoid corners</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                <span>Keep your phone <span className="font-medium text-black/70">steady</span> — move slowly and smoothly</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                <span>Cover the <span className="font-medium text-black/70">key rooms</span>: living room, bedroom, kitchen, and bathroom</span>
              </li>
            </ul>
          </div>

          {/* File format note */}
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-amber-50/80 border border-amber-100">
            <MonitorSmartphone size={14} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-[11px] text-amber-800">
              <span className="font-semibold">File format:</span> The image should be a standard JPEG or PNG
              in <span className="font-semibold">equirectangular format</span> (a wide, stretched image with a 2:1 aspect ratio).
              The Google Street View app and 360° cameras automatically produce this format.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PanoramaUpload({
  panoramas,
  onChange,
  maxFiles = 8,
}: PanoramaUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    if (panoramas.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} panoramic photos allowed.`);
      setTimeout(() => setError(""), 4000);
      return;
    }

    const newPanoramas: PanoramaFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const usedLabels = new Set([
        ...panoramas.map((p) => p.label),
        ...newPanoramas.map((p) => p.label),
      ]);
      const nextLabel =
        ROOM_LABELS.find((l) => !usedLabels.has(l)) ??
        `Room ${panoramas.length + newPanoramas.length + 1}`;

      newPanoramas.push({
        id: `pano-${Date.now()}-${i}`,
        label: nextLabel,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    onChange([...panoramas, ...newPanoramas]);
    setError("");

    if (fileRef.current) fileRef.current.value = "";
  };

  const removeByIndex = (idx: number) => {
    const updated = panoramas.filter((_, i) => i !== idx);
    onChange(updated);
  };

  const updateLabel = (idx: number, label: string) => {
    const updated = [...panoramas];
    updated[idx] = { ...updated[idx], label };
    onChange(updated);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Camera size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-black">
            360° Virtual Tour Photos
          </h3>
          <p className="text-xs text-black/50">
            Let guests walk through your apartment before they book. Optional — up to {maxFiles} rooms.
          </p>
        </div>
      </div>

      <HowToGuide />

      {/* Uploaded panoramas */}
      {panoramas.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 mb-4">
          {panoramas.map((pano, idx) => (
            <div
              key={pano.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-black/10 bg-white group hover:border-primary/30 transition-colors"
            >
              <GripVertical
                size={16}
                className="text-black/20 shrink-0 cursor-grab"
              />
              <div className="w-16 h-10 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src={pano.previewUrl}
                  alt={pano.label}
                  fill
                  className="object-cover"
                />
              </div>
              <input
                type="text"
                value={pano.label}
                onChange={(e) => updateLabel(idx, e.target.value)}
                className="flex-1 min-w-0 text-sm font-medium bg-transparent border-0 outline-none focus:ring-0 text-black placeholder:text-black/30"
                placeholder="Room name"
              />
              <button
                type="button"
                onClick={() => removeByIndex(idx)}
                className="p-1.5 rounded-md text-black/30 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {panoramas.length < maxFiles && (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full mt-4 py-8 border-2 border-dashed border-black/15 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Plus size={20} className="text-primary" />
          </div>
          <span className="text-sm font-medium text-black/60">
            Add 360° panoramic photo
          </span>
          <span className="text-xs text-black/40">
            JPEG or PNG &middot; equirectangular format
          </span>
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
