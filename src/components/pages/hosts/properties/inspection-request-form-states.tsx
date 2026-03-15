"use client";
import {
  AMMENITIES,
  WHAT_IS_NEAR,
} from "@/constants";
import {
  Check,
  CheckCircle,
  MoveLeft,
  MoveRight,
  School,
  X,
  Home,
  Camera,
  MapPin,
  ClipboardList,
  DollarSign,
  CalendarCheck,
  ArrowRight,
  Sparkles,
  PartyPopper,
  Sun,
  Maximize,
  ImageIcon,
  Users,
  Building2,
  Bath,
  BedDouble,
  Trash2,
  Plus,
  Upload,
  Info,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  ChangeEvent,
  Dispatch,
  FC,
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import React from "react";
import { Switch } from "@/components/ui/switch";
import {
  CreateInspectionForm,
  CreateInspectionFormValidationType,
  RoomFormEntry,
  defaultValues,
  getInspectionValidationResult,
  validateAmmenities,
  validateBasicPropertyDetailsSection,
  validateContactInfo,
  validateHouseRules,
  validateInspectionDateAndTime,
  validateNumberOfPictures,
  validatePrice,
  validatePropertyLocationDetails,
  validateTypeOfProperty,
  validateWhatIsNear,
} from "@/lib/utils";

import Spinner from "@/components/svgs/Spinner";
import PanoramaUpload, {
  PanoramaFile,
} from "@/components/property/panorama-upload";
import { FormStates } from "@/store/features/inspection-request-slice";
import {
  NIGERIAN_STATES_LGAS,
  SOJOURN_OPERATIONAL_STATES,
  stateToCityValue,
} from "@/constants/nigerian-addresses";
import { createInspection, getProperties, me } from "@/http/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const CalendarDateAndTime = dynamic(
  () => import("@/components/ui/calendar-date-time")
);

const LISTING_STEPS = [
  {
    icon: Home,
    title: "Describe your place",
    desc: "Share your property title, type, number of rooms, and a short description.",
  },
  {
    icon: Camera,
    title: "Add photos",
    desc: "Upload high-quality images so guests can see what makes your space special.",
  },
  {
    icon: MapPin,
    title: "Set your location",
    desc: "Pin your property on the map and tell us about the neighbourhood.",
  },
  {
    icon: ClipboardList,
    title: "Amenities & rules",
    desc: "List what you offer — Wi-Fi, parking, pool — and set clear house rules.",
  },
  {
    icon: DollarSign,
    title: "Set your price",
    desc: "Choose a nightly rate. You'll see a breakdown of fees and what you earn.",
  },
  {
    icon: CalendarCheck,
    title: "Schedule inspection",
    desc: "Pick a date for our team to verify and approve your property listing.",
  },
];

export const FormDescription: FC<{
  next: () => void;
  prev: (e: MouseEvent<HTMLButtonElement>) => void;
}> = ({ next, prev }) => {
  const hostId = useSelector((state: RootState) => state.user.me?.host?.id);
  const [ready, setReady] = useState(false);

  const { data: existingProperties } = useQuery({
    queryKey: ["host-properties-check", hostId],
    queryFn: () => getProperties(hostId!),
    enabled: !!hostId,
  });

  const isFirstListing =
    !existingProperties || (Array.isArray(existingProperties) && existingProperties.length === 0);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        next();
      }}
      className="w-full relative h-full overflow-y-auto bg-primary overflow-x-hidden"
    >
      {/* ── Vector background ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Houses silhouette along bottom */}
        <svg className="absolute bottom-0 left-0 w-full h-56 sm:h-72" viewBox="0 0 1200 200" fill="none" preserveAspectRatio="xMidYMax slice">
          <rect x="0" y="180" width="1200" height="20" fill="rgba(255,255,255,0.06)" />
          <g className="activity-bg-float-2" style={{ transformOrigin: "120px 180px" }}>
            <rect x="80" y="130" width="80" height="50" fill="rgba(255,255,255,0.07)" />
            <polygon points="80,130 120,95 160,130" fill="rgba(255,255,255,0.08)" />
            <rect x="105" y="150" width="18" height="30" fill="rgba(255,255,255,0.04)" />
            <rect x="88" y="142" width="12" height="12" fill="rgba(255,255,255,0.04)" />
            <rect x="138" y="142" width="12" height="12" fill="rgba(255,255,255,0.04)" />
          </g>
          <g>
            <rect x="220" y="100" width="70" height="80" fill="rgba(255,255,255,0.07)" />
            <polygon points="220,100 255,65 290,100" fill="rgba(255,255,255,0.09)" />
            <rect x="243" y="145" width="16" height="35" fill="rgba(255,255,255,0.04)" />
            <rect x="228" y="112" width="12" height="12" fill="rgba(255,255,255,0.04)" />
            <rect x="260" y="112" width="12" height="12" fill="rgba(255,255,255,0.04)" />
          </g>
          <g>
            <rect x="340" y="80" width="60" height="100" fill="rgba(255,255,255,0.07)" />
            <rect x="348" y="90" width="10" height="10" fill="rgba(255,255,255,0.04)" />
            <rect x="363" y="90" width="10" height="10" fill="rgba(255,255,255,0.04)" />
            <rect x="378" y="90" width="10" height="10" fill="rgba(255,255,255,0.04)" />
            <rect x="348" y="108" width="10" height="10" fill="rgba(255,255,255,0.04)" />
            <rect x="363" y="108" width="10" height="10" fill="rgba(255,255,255,0.04)" />
            <rect x="378" y="108" width="10" height="10" fill="rgba(255,255,255,0.04)" />
            <rect x="360" y="150" width="18" height="30" fill="rgba(255,255,255,0.04)" />
          </g>
          <g className="activity-bg-float-1" style={{ transformOrigin: "500px 180px" }}>
            <rect x="460" y="125" width="90" height="55" fill="rgba(255,255,255,0.07)" />
            <polygon points="455,125 505,80 555,125" fill="rgba(255,255,255,0.08)" />
            <rect x="490" y="148" width="20" height="32" fill="rgba(255,255,255,0.04)" />
            <rect x="465" y="138" width="14" height="14" fill="rgba(255,255,255,0.04)" />
            <rect x="530" y="138" width="14" height="14" fill="rgba(255,255,255,0.04)" />
          </g>
          <g>
            <rect x="700" y="115" width="85" height="65" fill="rgba(255,255,255,0.07)" />
            <polygon points="700,115 742,75 785,115" fill="rgba(255,255,255,0.08)" />
            <rect x="730" y="148" width="18" height="32" fill="rgba(255,255,255,0.04)" />
            <rect x="708" y="128" width="12" height="12" fill="rgba(255,255,255,0.04)" />
            <rect x="758" y="128" width="12" height="12" fill="rgba(255,255,255,0.04)" />
          </g>
          <g>
            <rect x="950" y="120" width="75" height="60" fill="rgba(255,255,255,0.07)" />
            <polygon points="950,120 987,85 1025,120" fill="rgba(255,255,255,0.08)" />
            <rect x="975" y="148" width="16" height="32" fill="rgba(255,255,255,0.04)" />
          </g>
          <g>
            <rect x="1080" y="110" width="65" height="70" fill="rgba(255,255,255,0.07)" />
            <polygon points="1080,110 1112,75 1145,110" fill="rgba(255,255,255,0.09)" />
            <rect x="1100" y="148" width="16" height="32" fill="rgba(255,255,255,0.04)" />
          </g>
        </svg>

        {/* Trees */}
        <svg className="absolute bottom-0 left-0 w-full h-56 sm:h-72 activity-bg-float-1" viewBox="0 0 1200 200" fill="none" preserveAspectRatio="xMidYMax slice">
          <rect x="40" y="155" width="6" height="25" fill="rgba(255,255,255,0.06)" />
          <circle cx="43" cy="145" r="18" fill="rgba(255,255,255,0.05)" />
          <circle cx="35" cy="150" r="14" fill="rgba(255,255,255,0.04)" />
          <rect x="195" y="158" width="5" height="22" fill="rgba(255,255,255,0.06)" />
          <circle cx="197" cy="148" r="16" fill="rgba(255,255,255,0.05)" />
          <rect x="427" y="155" width="5" height="25" fill="rgba(255,255,255,0.06)" />
          <polygon points="410,155 430,110 450,155" fill="rgba(255,255,255,0.05)" />
          <polygon points="415,140 430,100 445,140" fill="rgba(255,255,255,0.04)" />
          <rect x="620" y="160" width="5" height="20" fill="rgba(255,255,255,0.06)" />
          <circle cx="622" cy="150" r="15" fill="rgba(255,255,255,0.05)" />
          <rect x="780" y="152" width="5" height="28" fill="rgba(255,255,255,0.06)" />
          <polygon points="763,152 783,100 803,152" fill="rgba(255,255,255,0.05)" />
          <rect x="890" y="158" width="5" height="22" fill="rgba(255,255,255,0.06)" />
          <circle cx="892" cy="148" r="16" fill="rgba(255,255,255,0.05)" />
          <ellipse cx="170" cy="174" rx="20" ry="10" fill="rgba(255,255,255,0.04)" />
          <ellipse cx="580" cy="176" rx="18" ry="8" fill="rgba(255,255,255,0.04)" />
          <ellipse cx="850" cy="175" rx="22" ry="9" fill="rgba(255,255,255,0.04)" />
        </svg>

        {/* Stars */}
        <svg className="absolute top-0 left-0 w-full h-40" viewBox="0 0 1200 120" fill="none" preserveAspectRatio="xMidYMin slice">
          <circle cx="80" cy="25" r="1.5" fill="rgba(255,255,255,0.18)" className="activity-bg-pulse" />
          <circle cx="200" cy="50" r="1" fill="rgba(255,255,255,0.14)" className="activity-bg-pulse-delay" />
          <circle cx="350" cy="18" r="1.5" fill="rgba(255,255,255,0.12)" className="activity-bg-pulse" />
          <circle cx="520" cy="40" r="1" fill="rgba(255,255,255,0.18)" className="activity-bg-pulse-delay" />
          <circle cx="680" cy="15" r="1.5" fill="rgba(255,255,255,0.14)" className="activity-bg-pulse" />
          <circle cx="800" cy="55" r="1" fill="rgba(255,255,255,0.12)" className="activity-bg-pulse-delay" />
          <circle cx="950" cy="30" r="1.5" fill="rgba(255,255,255,0.18)" className="activity-bg-pulse" />
          <circle cx="1100" cy="20" r="1" fill="rgba(255,255,255,0.14)" className="activity-bg-pulse-delay" />
          <circle cx="1050" cy="65" r="1" fill="rgba(255,255,255,0.12)" className="activity-bg-pulse" />
          <circle cx="140" cy="70" r="1" fill="rgba(255,255,255,0.10)" className="activity-bg-pulse-delay" />
          <circle cx="450" cy="75" r="1.5" fill="rgba(255,255,255,0.12)" className="activity-bg-pulse" />
          <circle cx="750" cy="80" r="1" fill="rgba(255,255,255,0.14)" className="activity-bg-pulse-delay" />
        </svg>

        {/* Warm glows */}
        <div className="absolute bottom-0 left-1/4 w-96 h-48 rounded-full bg-white/[0.04] blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-72 h-40 rounded-full bg-white/[0.05] blur-[60px]" />
        <div className="absolute top-1/3 right-0 w-64 h-64 rounded-full bg-white/[0.03] blur-[100px]" />
      </div>

      {/* ── Content (above background) ── */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-10 pt-10 sm:pt-16 pb-28 flex flex-col items-center min-h-full justify-center">
        {/* ── Hero message ── */}
        <div
          className="mb-12 text-center transition-all duration-700 ease-out"
          style={{
            opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0)" : "translateY(24px)",
          }}
        >
          {isFirstListing ? (
            <>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] font-[var(--font-playfair)]">
                Congratulations on listing your first property!
              </h1>
              <p className="mt-4 text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                You&apos;re about to join a community of hosts earning on Sojourn.
                We&apos;ll walk you through every step — it only takes a few minutes.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] font-[var(--font-playfair)]">
                Tell us about your apartment
              </h1>
              <p className="mt-4 text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                Great to have you back! Let&apos;s add another property to your portfolio.
                Here&apos;s what the process looks like.
              </p>
            </>
          )}
        </div>

        {/* ── Numbered steps — 2-column grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 w-full max-w-4xl">
          {LISTING_STEPS.map((step, i) => {
            const Icon = step.icon;
            const delay = 200 + i * 100;
            return (
              <div
                key={step.title}
                className="flex gap-4 transition-all duration-700 ease-out"
                style={{
                  opacity: ready ? 1 : 0,
                  transform: ready ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: `${delay}ms`,
                }}
              >
                <span className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-primary flex items-center justify-center text-xl sm:text-2xl font-extrabold shadow-lg">
                  {i + 1}
                </span>

                <div className="pt-0.5">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-white/60" />
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Get Started button ── */}
        <div
          className="mt-12 flex justify-center transition-all duration-700 ease-out"
          style={{
            opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "1000ms",
          }}
        >
          <button
            type="submit"
            className="group inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-primary font-bold text-lg sm:text-xl px-12 sm:px-16 py-4 sm:py-5 rounded-2xl transition-all duration-300 active:scale-[0.97] shadow-xl shadow-black/10 hover:shadow-2xl"
          >
            Get Started
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* ── Logo pinned to bottom-left corner ── */}
      <div
        className="fixed bottom-10 left-10 z-40 transition-all duration-700 ease-out"
        style={{
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(12px)",
          transitionDelay: "1200ms",
        }}
      >
        <div className="animate-pulse">
            <Image
              src="/assets/logo/soj_white.svg"
              alt="Sojourn"
              width={50}
              height={50}
              priority
              className="opacity-60"
          />
        </div>
      </div>
    </form>
  );
};

export const TitleAndPropertyDescription: FC<{
  form: CreateInspectionForm;
  setForm: Dispatch<SetStateAction<CreateInspectionForm>>;
  formValidation: CreateInspectionFormValidationType;
  setFormValidation: Dispatch<
    SetStateAction<CreateInspectionFormValidationType>
  >;
  next: () => void;
  prev: (e: MouseEvent<HTMLButtonElement>) => void;
}> = ({ form, setForm, setFormValidation, next, formValidation, prev }) => {
  const titleInValidStyle = formValidation.title
    ? "border-primary border-[2px]"
    : "";
  const maxNumberOfPeopleInValidStyle = formValidation.maxNumberOfPeople
    ? "border-primary border-[2px]"
    : "";
  const numberOfRoomsInValidStyle = formValidation.numberOfRooms
    ? "border-primary border-[2px]"
    : "";
  const descriptionInValidStyle = formValidation.description
    ? "border-primary border-[2px]"
    : "";

  const areFieldsMissing =
    formValidation.title ||
    formValidation.maxNumberOfPeople ||
    formValidation.numberOfRooms ||
    formValidation.description;

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        const values = validateBasicPropertyDetailsSection(form);

        if (Object.keys(values).length) {
          setFormValidation((prev) => ({ ...prev, ...values }));

          return;
        } else {
          next();
        }
      }}
className="w-full relative min-h-screen overflow-y-auto flex items-center justify-center max-w-[1400px] mx-auto"
    >
      <div className="w-5/6 min-h-[100px] md:w-4/6 lg:w-1/2 about-one">
        <h3 className="text-xl md:text-3xl mb-10">Basic Property Details.</h3>
        <div className="w-full">
          {areFieldsMissing ? (
            <h4 className="text-primary text-md font-semibold">
              Please fill in missing fields
            </h4>
          ) : null}
          <div className="w-full flex flex-col">
            <div className="w-full flex flex-col space-y-2 mb-4">
              <label htmlFor="title">Title</label>
              <div className="w-full flex  space-x-2">
                <input
                  className={`w-[96%] border border-black rounded-md p-3  placeholder:text-gray-300 text-md ${titleInValidStyle}`}
                  name="title"
                  id="title"
                  value={form.title}
                  onChange={(e) => {
                    setForm((prevState: any) => ({
                      ...prevState,
                      title: e.target.value,
                    }));
                    if (e.target.value) {
                      setFormValidation((prev) => ({ ...prev, title: false }));
                    }
                  }}
                  placeholder="Enter Property Title"
                />
              </div>
            </div>
            <div className="w-full flex items-center space-x-5">
              <div className="w-1/2 flex flex-col space-y-2 mb-4">
                <label htmlFor="max-number-of-people">Max No. of People</label>
                <div className="w-full flex  space-x-2">
                  <input
                    className={`w-[96%] border border-black rounded-md p-3  placeholder:text-gray-300 text-md ${maxNumberOfPeopleInValidStyle}`}
                    name="maxNumberOfPeople"
                    id="max-number-of-people"
                    value={form.maxNumberOfPeople}
                    onChange={(e) => {
                      if (isNaN(Number(e.target.value))) return;
                      setForm((prevState: any) => ({
                        ...prevState,
                        maxNumberOfPeople: Number(e.target.value),
                      }));
                      if (e.target.value) {
                        setFormValidation((prev) => ({
                          ...prev,
                          maxNumberOfPeople: false,
                        }));
                      }
                    }}
                    placeholder="Enter the max no. of people allowed "
                  />
                </div>
              </div>
              <div className="w-1/2 flex flex-col space-y-2 mb-4">
                <label htmlFor="number-of-rooms">No. of rooms</label>
                <div className="w-full flex  space-x-2">
                  <input
                    className={`w-[93%] border border-black rounded-md p-3  placeholder:text-gray-300 text-md ${numberOfRoomsInValidStyle}`}
                    name="numberOfRooms"
                    id="number-of-rooms"
                    value={form.numberOfRooms}
                    onChange={(e) => {
                      if (isNaN(Number(e.target.value))) return;
                      setForm((prevState: any) => ({
                        ...prevState,
                        numberOfRooms: Number(e.target.value),
                      }));
                      if (e.target.value) {
                        setFormValidation((prev) => ({
                          ...prev,
                          numberOfRooms: false,
                        }));
                      }
                    }}
                    placeholder="4"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full space-y-2">
            <label htmlFor="property-description">Description</label>
            <div className="w-full flex  space-x-2">
              <textarea
                className={`w-[96%] border border-black rounded-md p-3 h-[160px] resize-none md:h-[120px] placeholder:text-gray-300 text-md ${descriptionInValidStyle}`}
                name="description"
                id="property-description"
                value={form.description}
                onChange={(e) => {
                  setForm((prevState: any) => ({
                    ...prevState,
                    description: e.target.value,
                  }));
                  if (e.target.value) {
                    setFormValidation((prev) => ({
                      ...prev,
                      description: false,
                    }));
                  }
                }}
                placeholder="Describe your property max (200) characters."
              />
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bg-white w-full h-[60px] bottom-0 border-t border-t-gray-400 flex items-center justify-between px-5">
        <button
          onClick={prev}
          className="border-0 outline-none text-sm py-2 px-7 bg-white text-black font-semibold underline"
        >
          Back
        </button>
        <button className="border-0 outline-none text-sm py-2 px-7 flex items-center space-x-2 rounded-full bg-black text-white font-semibold ease duration-300 hover:bg-red-700">
          <span> Next</span>
          <MoveRight color="white" size={20} />
        </button>
      </div>
    </form>
  );
};

const PHOTO_TIPS = [
  { icon: Sun, title: "Natural lighting", desc: "Shoot during the day with curtains open — bright spaces feel larger and more inviting." },
  { icon: Maximize, title: "Wide angles", desc: "Capture full rooms from a corner to show the entire layout in one shot." },
  { icon: Sparkles, title: "Clean & styled", desc: "Tidy up, make the bed, add fresh towels — small touches make a big difference." },
  { icon: ImageIcon, title: "At least 3 photos", desc: "Cover living areas, bedrooms, kitchen, bathroom, and any standout features." },
];

export const UploadPropertyImages: FC<{
  form: CreateInspectionForm;
  setForm: Dispatch<SetStateAction<CreateInspectionForm>>;
  formValidation: CreateInspectionFormValidationType;
  setFormValidation: Dispatch<
    SetStateAction<CreateInspectionFormValidationType>
  >;
  next: () => void;
  prev: (e: MouseEvent<HTMLButtonElement>) => void;
}> = ({ form, setForm, formValidation, setFormValidation, next, prev }) => {
  const fileUploadRef = useRef({} as HTMLInputElement);

  const [photos, setPhotos] = useState<string[]>([]);

  const [error, setError] = useState("");

  const removePhotoByIndex =
    (targetIdx: number) => (e: MouseEvent<HTMLDivElement>) => {
      const photoSlice = photos.filter((_, idx: number) => idx !== targetIdx);
      const filesSlice = form.files.filter(
        (_: any, idx: number) => idx !== targetIdx
      );
      setForm((prevState: CreateInspectionForm) => ({
        ...prevState,
        files: filesSlice,
      }));
      setPhotos(photoSlice);
    };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const listOfPhotos = files as FileList;

    if (listOfPhotos.length + photos.length > 10) {
      setError("Cannot upload more than 10 images.");
      setTimeout(() => setError(""), 4000);
      return;
    }

    const displayUrls: string[] = [];
    const filesList: File[] = [];
    for (let i = 0; i < listOfPhotos.length; i++) {
      const url = URL.createObjectURL(listOfPhotos[i]);
      displayUrls.push(url);
      const file = files?.item(i) as File;
      filesList.push(file);
    }
    setForm((prevState: CreateInspectionForm) => ({
      ...prevState,
      files: [...prevState.files, ...filesList],
    }));
    if ([...form.files, ...filesList].length >= 3) {
      setFormValidation((prev) => ({ ...prev, files: false }));
      setError("");
    }

    setPhotos((prevState) => [...prevState, ...displayUrls]);
  };

  useEffect(() => {
    const listOfPhotos = form.files;
    const displayUrls: string[] = [];
    for (let i = 0; i < listOfPhotos.length; i++) {
      const url = URL.createObjectURL(listOfPhotos[i]);
      displayUrls.push(url);
    }
    setPhotos(displayUrls);
  }, []);

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        const values = validateNumberOfPictures(form);

        if (Object.keys(values).length) {
          setFormValidation((prev) => ({ ...prev, ...values }));
          setError("You need at least 3 photos to continue.");
          return;
        } else {
          next();
        }
      }}
      className="w-full relative h-full overflow-y-auto"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-28">
        {/* ── Header ── */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            Add property photos
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-xl">
            Great photos are the #1 reason guests book. Show off your space — upload between 3 and 10 images.
          </p>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl">
            <X className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* ── Two-column layout: Upload area + Tips ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Left: Upload zone + photo grid (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-6">

            {/* Photo grid */}
            {photos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs sm:text-sm text-gray-400">
                    Click a photo to remove it &middot; {photos.length}/10 uploaded
                  </p>
                  {photos.length < 10 && (
                    <button
                      type="button"
                      onClick={() => fileUploadRef.current.click()}
                      className="text-xs sm:text-sm font-semibold text-primary hover:text-red-700 transition-colors"
                    >
                      + Add more
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {photos.map((url, idx) => (
                    <div
                      onClick={removePhotoByIndex(idx)}
                      key={idx}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md cursor-pointer group ring-1 ring-gray-200 hover:ring-primary transition-all"
                    >
                      <Image
                        src={url}
                        alt={`Property photo ${idx + 1}`}
                        fill
                        priority
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <X className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      {idx === 0 && (
                        <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Drop zone */}
            <div
              onClick={() => fileUploadRef.current.click()}
              className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
                photos.length === 0
                  ? "border-gray-300 bg-gray-50 hover:border-primary hover:bg-red-50/30 py-16 sm:py-20"
                  : "border-gray-200 bg-gray-50/50 hover:border-primary py-8"
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                <Camera className="w-6 h-6 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm sm:text-base font-semibold text-gray-700">
                  {photos.length === 0 ? "Upload your property photos" : "Upload more photos"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG or JPEG &middot; Max 10 images
                </p>
              </div>
              <span className="text-xs font-bold text-primary border border-primary rounded-full px-4 py-1.5 hover:bg-primary hover:text-white transition-colors">
                Browse files
              </span>
            </div>
            <input
              onChange={handleUpload}
              name="photos"
              ref={fileUploadRef}
              className="hidden"
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              multiple
            />

            {/* 360° Panorama */}
            <div className="mt-4">
              <PanoramaUpload
                panoramas={form.panoramaFiles as PanoramaFile[]}
                onChange={(updated) =>
                  setForm((prev) => ({ ...prev, panoramaFiles: updated }))
                }
              />
            </div>
          </div>

          {/* Right: Photo tips (2 cols on lg) */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Tips for great photos
              </h3>
              <div className="space-y-5">
                {PHOTO_TIPS.map((tip) => {
                  const TipIcon = tip.icon;
                  return (
                    <div key={tip.title} className="flex gap-3">
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                        <TipIcon className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{tip.title}</p>
                        <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{tip.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Properties with 5+ high-quality photos get <span className="font-semibold text-gray-600">3x more bookings</span> on average. First impressions matter!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="fixed bg-white w-full h-[60px] bottom-0 border-t border-t-gray-200 flex items-center justify-between px-5 z-30">
        <button
          onClick={prev}
          className="border-0 outline-none text-sm py-2 px-7 bg-white text-black font-semibold underline"
        >
          Back
        </button>
        <button className="border-0 outline-none text-sm py-2.5 px-8 flex items-center space-x-2 rounded-full bg-gray-900 text-white font-semibold ease duration-300 hover:bg-gray-800 shadow-md">
          <span>Next</span>
          <MoveRight color="white" size={18} />
        </button>
      </div>
    </form>
  );
};

export type PropertyTypes = "prime-inn" | "town-house" | "";

const PROPERTY_OPTIONS: {
  type: PropertyTypes;
  label: string;
  icon: typeof Home;
  tagline: string;
  description: string;
  features: string[];
  badge?: string;
}[] = [
  {
    type: "prime-inn",
    label: "Prime Inn",
    icon: Building2,
    tagline: "Private apartment or hotel room",
    description:
      "A fully self-contained private apartment or hotel room equipped with everything a guest needs. One booking covers the entire unit.",
    features: [
      "Entire place for one booking",
      "Private kitchen and bathroom",
      "All amenities included",
      "Best for short stays and business travel",
      "Single price per night",
    ],
  },
  {
    type: "town-house",
    label: "Town House",
    icon: Home,
    tagline: "Spacious home for longer stays",
    description:
      "A larger apartment or house designed for short to long-term stays (up to 6 months). Ideal for families, groups, or extended relocations.",
    features: [
      "Entire home with multiple rooms",
      "Suitable for 3–6 month stays",
      "Great for families and groups",
      "Full kitchen and living spaces",
      "Single price per night",
    ],
  },
];

export const TypeOfProperty: FC<{
  form: CreateInspectionForm;
  setForm: Dispatch<SetStateAction<CreateInspectionForm>>;
  formValidation: CreateInspectionFormValidationType;
  setFormValidation: Dispatch<
    SetStateAction<CreateInspectionFormValidationType>
  >;
  next: () => void;
  prev: (e: MouseEvent<HTMLButtonElement>) => void;
}> = ({ form, setForm, formValidation, next, prev, setFormValidation }) => {
  const selectPropertyType = (value: PropertyTypes) => {
    setForm((prevState: any) => ({ ...prevState, typeOfProperty: value }));
    setFormValidation((prev) => ({ ...prev, typeOfProperty: false }));
  };

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        const values = validateTypeOfProperty(form);
        if (Object.keys(values).length) {
          setFormValidation((prev) => ({ ...prev, ...values }));
          return;
        }
        next();
      }}
      className="w-full relative h-full overflow-y-auto"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-28">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            What type of property is this?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-lg mx-auto">
            This determines how guests will book and how you&apos;ll manage your listing. Choose the one that best fits your space.
          </p>
          {formValidation.typeOfProperty && (
            <p className="mt-3 text-sm font-semibold text-primary">
              Please select a property type to continue
            </p>
          )}
        </div>

        {/* Property type cards */}
        <div className="space-y-4">
          {PROPERTY_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = form.typeOfProperty === opt.type;
            return (
              <div
                key={opt.type}
                onClick={() => selectPropertyType(opt.type)}
                className={`relative cursor-pointer rounded-2xl border-2 p-5 sm:p-6 transition-all duration-200 ${
                  isSelected
                    ? "border-gray-900 bg-gray-50 shadow-lg"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                }`}
              >
                {/* Badge */}
                {opt.badge && (
                  <span className="absolute -top-2.5 right-4 bg-primary text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                    {opt.badge}
                  </span>
                )}

                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Icon + radio */}
                  <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2 sm:w-20 flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-gray-900"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                        {opt.label}
                      </h3>
                      <span className="text-xs font-medium text-gray-400 hidden sm:inline">
                        &mdash; {opt.tagline}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-3">
                      {opt.description}
                    </p>

                    {/* Feature list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                      {opt.features.map((f) => (
                        <div
                          key={f}
                          className="flex items-center gap-2 text-xs sm:text-sm text-gray-600"
                        >
                          <CheckCircle
                            className={`w-3.5 h-3.5 flex-shrink-0 ${
                              isSelected
                                ? "text-emerald-500"
                                : "text-gray-300"
                            }`}
                          />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bg-white w-full h-[60px] bottom-0 border-t border-t-gray-200 flex items-center justify-between px-5 z-30">
        <button
          onClick={prev}
          className="border-0 outline-none text-sm py-2 px-7 bg-white text-black font-semibold underline"
        >
          Back
        </button>
        <button className="border-0 outline-none text-sm py-2.5 px-8 flex items-center space-x-2 rounded-full bg-gray-900 text-white font-semibold ease duration-300 hover:bg-gray-800 shadow-md">
          <span>Next</span>
          <MoveRight color="white" size={18} />
        </button>
      </div>
    </form>
  );
};

/* ─────────────────────────────────────────────
   SmartShare Room Setup (section-4 for smart-share)
   ───────────────────────────────────────────── */

const generateRoomId = () => `room-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const SmartShareRoomSetup: FC<{
  form: CreateInspectionForm;
  setForm: Dispatch<SetStateAction<CreateInspectionForm>>;
  formValidation: CreateInspectionFormValidationType;
  setFormValidation: Dispatch<SetStateAction<CreateInspectionFormValidationType>>;
  next: () => void;
  prev: (e: MouseEvent<HTMLButtonElement>) => void;
}> = ({ form, setForm, formValidation, next, prev, setFormValidation }) => {
  const addRoom = () => {
    const newRoom: RoomFormEntry = {
      id: generateRoomId(),
      name: `Room ${form.rooms.length + 1}`,
      photos: [],
      bathroomType: "shared",
      capacity: 1,
      price: 0,
    };
    setForm((prev) => ({ ...prev, rooms: [...prev.rooms, newRoom] }));
  };

  const updateRoom = (roomId: string, updates: Partial<RoomFormEntry>) => {
    setForm((prev) => ({
      ...prev,
      rooms: prev.rooms.map((r) => (r.id === roomId ? { ...r, ...updates } : r)),
    }));
  };

  const removeRoom = (roomId: string) => {
    setForm((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((r) => r.id !== roomId),
    }));
  };

  const handleRoomPhotos = (roomId: string, files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    updateRoom(roomId, {
      photos: [...(form.rooms.find((r) => r.id === roomId)?.photos || []), ...newFiles].slice(0, 10),
    });
  };

  const removeRoomPhoto = (roomId: string, photoIndex: number) => {
    const room = form.rooms.find((r) => r.id === roomId);
    if (!room) return;
    updateRoom(roomId, {
      photos: room.photos.filter((_, i) => i !== photoIndex),
    });
  };

  const handleSharedSpacePhotos = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setForm((prev) => ({
      ...prev,
      sharedSpaceFiles: [...prev.sharedSpaceFiles, ...newFiles].slice(0, 10),
    }));
  };

  const removeSharedPhoto = (index: number) => {
    setForm((prev) => ({
      ...prev,
      sharedSpaceFiles: prev.sharedSpaceFiles.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    if (form.rooms.length === 0) {
      setFormValidation((prev) => ({ ...prev, rooms: true }));
      return false;
    }
    for (const room of form.rooms) {
      if (room.photos.length === 0) {
        setFormValidation((prev) => ({ ...prev, rooms: true }));
        return false;
      }
      if (!room.name.trim()) {
        setFormValidation((prev) => ({ ...prev, rooms: true }));
        return false;
      }
    }
    setFormValidation((prev) => ({ ...prev, rooms: false }));
    return true;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (validate()) next();
      }}
      className="w-full h-full overflow-y-auto"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-28">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Set up your rooms
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-xl">
            Since this is a Smart Share property, each room can be booked individually.
            Add each room with its photos, capacity, bathroom type, and price.
          </p>
          {formValidation.rooms && (
            <p className="mt-3 text-sm font-semibold text-primary">
              Add at least one room with a name and at least one photo each.
            </p>
          )}
        </div>

        {/* Room cards */}
        <div className="space-y-5">
          {form.rooms.map((room, idx) => (
            <div
              key={room.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Room {idx + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeRoom(room.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Room name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room name
                </label>
                <input
                  type="text"
                  value={room.name}
                  onChange={(e) => updateRoom(room.id, { name: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                  placeholder="e.g. Master Bedroom, Room A"
                />
              </div>

              {/* Bathroom type + capacity row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Bath className="w-3.5 h-3.5 inline mr-1" />
                    Bathroom
                  </label>
                  <div className="flex gap-2">
                    {(["ensuite", "shared"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => updateRoom(room.id, { bathroomType: type })}
                        className={`flex-1 rounded-lg border-2 py-2 text-sm font-medium capitalize transition-all ${
                          room.bathroomType === type
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {type === "ensuite" ? "En-suite" : "Shared"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <BedDouble className="w-3.5 h-3.5 inline mr-1" />
                    Max guests
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        updateRoom(room.id, {
                          capacity: Math.max(1, room.capacity - 1),
                        })
                      }
                      className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-50"
                    >
                      &minus;
                    </button>
                    <span className="text-lg font-bold w-8 text-center">
                      {room.capacity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateRoom(room.id, {
                          capacity: Math.min(10, room.capacity + 1),
                        })
                      }
                      className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Price per night */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <DollarSign className="w-3.5 h-3.5 inline mr-1" />
                  Price per night (₦)
                </label>
                <input
                  type="number"
                  min={0}
                  value={room.price || ""}
                  onChange={(e) =>
                    updateRoom(room.id, { price: +e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
                  placeholder="0"
                />
              </div>

              {/* Room photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Camera className="w-3.5 h-3.5 inline mr-1" />
                  Room photos ({room.photos.length}/10)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {room.photos.map((file, pi) => (
                    <div
                      key={pi}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden group"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Room photo ${pi + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeRoomPhoto(room.id, pi)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {room.photos.length < 10 && (
                    <label className="aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                      <Upload className="w-5 h-5 text-gray-400 mb-1" />
                      <span className="text-[10px] text-gray-400">Add</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleRoomPhotos(room.id, e.target.files)}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add room button */}
          <button
            type="button"
            onClick={addRoom}
            className="w-full rounded-2xl border-2 border-dashed border-gray-300 py-5 flex flex-col items-center justify-center gap-1 hover:border-gray-400 hover:bg-gray-50 transition-all"
          >
            <Plus className="w-6 h-6 text-gray-400" />
            <span className="text-sm font-semibold text-gray-500">
              Add a room
            </span>
          </button>
        </div>

        {/* Shared spaces section */}
        <div className="mt-10">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            Shared spaces
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Upload photos of common areas guests will share — kitchen, living room, balcony, etc.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {form.sharedSpaceFiles.map((file, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] rounded-lg overflow-hidden group"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Shared space ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeSharedPhoto(i)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {form.sharedSpaceFiles.length < 10 && (
              <label className="aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                <Upload className="w-5 h-5 text-gray-400 mb-1" />
                <span className="text-[10px] text-gray-400">Add</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleSharedSpacePhotos(e.target.files)}
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bg-white w-full h-[60px] bottom-0 border-t border-t-gray-200 flex items-center justify-between px-5 z-30">
        <button
          onClick={prev}
          className="border-0 outline-none text-sm py-2 px-7 bg-white text-black font-semibold underline"
        >
          Back
        </button>
        <button className="border-0 outline-none text-sm py-2.5 px-8 flex items-center space-x-2 rounded-full bg-gray-900 text-white font-semibold ease duration-300 hover:bg-gray-800 shadow-md">
          <span>Next</span>
          <MoveRight color="white" size={18} />
        </button>
      </div>
    </form>
  );
};

export const PropertyLocation: FC<{
  form: CreateInspectionForm;
  setForm: Dispatch<SetStateAction<CreateInspectionForm>>;
  formValidation: CreateInspectionFormValidationType;
  setFormValidation: Dispatch<
    SetStateAction<CreateInspectionFormValidationType>
  >;
  next: () => void;
  prev: (e: MouseEvent<HTMLButtonElement>) => void;
}> = ({ form, setForm, setFormValidation, formValidation, next, prev }) => {
  // Nigerian address: State → LGA → Area → Street → House No
  const selectedState =
    SOJOURN_OPERATIONAL_STATES.find(
      (s) => stateToCityValue(s).toLowerCase() === form.city?.toLowerCase()
    ) ?? (form.city || "");
  const lgasForState = selectedState
    ? (NIGERIAN_STATES_LGAS[selectedState] ?? [])
    : [];
  // Parse existing zip: "LGA, Area" or just "Area" for backward compatibility
  const [localLga, setLocalLga] = useState(() => {
    const zip = form.zip?.trim();
    if (!zip) return "";
    if (zip.includes(", ")) return zip.split(", ")[0] ?? "";
    return "";
  });
  const [localArea, setLocalArea] = useState(() => {
    const zip = form.zip?.trim();
    if (!zip) return "";
    if (zip.includes(", ")) return zip.split(", ").slice(1).join(", ").trim();
    return zip; // Backward compat: whole zip is area
  });

  // Ensure country is Nigeria for Nigerian address form
  useEffect(() => {
    if (!form.country || form.country.toLowerCase() !== "nigeria") {
      setForm((prev) => ({ ...prev, country: "nigeria" }));
    }
  }, [form.country, setForm]);

  // const handleStateChange = (e: ChangeEvent<HTMLSelectElement>) => {
  //   const state = e.target.value;
  //   setForm((prev) => ({
  //     ...prev,
  //     city: state ? stateToCityValue(state) : "",
  //   }));
  //   setFormValidation((prev) => ({ ...prev, city: false }));
  //   setLocalLga("");
  //   setLocalArea("");
  // };

 const handleStateChange = (e: ChangeEvent<HTMLSelectElement>) => {
  const state = e.target.value;

  setForm((prev) => ({
    ...prev,
    city: state ? stateToCityValue(state) : "",
    zip: "",
  }));

  setFormValidation((prev) => ({ ...prev, city: false }));

  setLocalLga("");
  setLocalArea("");
};

  // const handleLgaChange = (e: ChangeEvent<HTMLSelectElement>) => {
  //   const lga = e.target.value;
  //   setLocalLga(lga);
  //   setForm((prev) => ({
  //     ...prev,
  //     zip: localArea ? `${lga}, ${localArea}`.trim() : lga,
  //   }));
  //   setFormValidation((prev) => ({ ...prev, zip: false }));
  // };

  const handleLgaChange = (e: ChangeEvent<HTMLSelectElement>) => {
  const lga = e.target.value;

  setLocalLga(lga);

  setForm((prev) => ({
    ...prev,
    zip: localArea ? `${lga}, ${localArea}` : lga,
  }));

  setFormValidation((prev) => ({ ...prev, zip: false }));
};

  const handleAreaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const area = e.target.value;
    setLocalArea(area);
    setForm((prev) => ({
      ...prev,
      zip: localLga ? (area ? `${localLga}, ${area}` : localLga) : area,
    }));
    setFormValidation((prev) => ({ ...prev, zip: false }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prevState: CreateInspectionForm) => ({
      ...prevState,
      [name]: type === "number" ? +value || 0 : value,
    }));
    setFormValidation((prev) => ({ ...prev, [name]: false }));
  };

  const invalidCountryStyle = formValidation.country
    ? "border-red-500 border-2"
    : "border-gray-200";
  const invalidStateStyle = formValidation.city
    ? "border-red-500 border-2"
    : "border-gray-200";
  const invalidLgaStyle = formValidation.zip
    ? "border-red-500 border-2"
    : "border-gray-200";
  const invalidStreetStyle = formValidation.street
    ? "border-red-500 border-2"
    : "border-gray-200";
  const invalidHouseNumberStyle = formValidation.houseNumber
    ? "border-red-500 border-2"
    : "border-gray-200";

  const isLocationFormValid =
    formValidation.country ||
    formValidation.city ||
    formValidation.street ||
    formValidation.houseNumber ||
    formValidation.zip;

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        const values = validatePropertyLocationDetails(form);

        if (Object.keys(values).length) {
          setFormValidation((prev) => ({ ...prev, ...values }));
          return;
        } else {
          next();
        }
      }}
className="w-full relative min-h-screen overflow-y-auto flex items-center justify-center max-w-[1400px] mx-auto"
    >
      <div className="w-5/6 flex flex-col items-center min-h-[100px] md:w-5/6 about-one max-w-[1400px] mx-auto pb-24">
        <div className="w-full md:w-4/6 lg:w-1/2 flex flex-col items-center">
          <h3 className="w-full text-xl md:text-3xl mb-2 md:text-center font-semibold">
            Where is this property located?
          </h3>
          <p className="w-full text-sm text-gray-600 mb-5 md:text-center">
            Sojourn is currently available in Lagos, Abuja, Rivers, Akwa Ibom,
            Delta, Oyo & Edo. Enter your address below.
          </p>
          {isLocationFormValid ? (
            <span className="text-red-600 font-medium text-sm mb-3">
              Please fill all required fields
            </span>
          ) : null}

          <div className="w-full space-y-4">
            {/* Country - fixed Nigeria */}
            <div className="space-y-1.5">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                className={`w-full border rounded-lg px-4 py-3 text-base bg-gray-50 text-gray-600 cursor-not-allowed ${invalidCountryStyle}`}
                name="country"
                id="country"
                disabled
                value="Nigeria"
              />
            </div>

            {/* State */}
            <div className="space-y-1.5">
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full border rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${invalidStateStyle}`}
                id="state"
                value={selectedState}
                onChange={handleStateChange}
              >
                <option value="">Select your state</option>
                {SOJOURN_OPERATIONAL_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* LGA */}
            <div className="space-y-1.5">
              <label htmlFor="lga" className="block text-sm font-medium text-gray-700">
                Local Government Area (LGA) <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full border rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${invalidLgaStyle}`}
                id="lga"
                value={localLga}
                onChange={handleLgaChange}
                disabled={!selectedState}
              >
                <option value="">Select LGA</option>
                {lgasForState.map((lga) => (
                  <option key={lga} value={lga}>
                    {lga}
                  </option>
                ))}
              </select>
            </div>

            {/* Area / Neighbourhood */}
            <div className="space-y-1.5">
              <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                Area / Neighbourhood
              </label>
              <input
                className={`w-full border rounded-lg px-4 py-3 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${invalidLgaStyle}`}
                id="area"
                value={localArea}
                onChange={handleAreaChange}
                placeholder="e.g. Lekki Phase 1, Victoria Island, Wuse II"
              />
            </div>

            {/* Street / Road */}
            <div className="space-y-1.5">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                Street / Road name <span className="text-red-500">*</span>
              </label>
              <input
                className={`w-full border rounded-lg px-4 py-3 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${invalidStreetStyle}`}
                name="street"
                id="street"
                value={form.street}
                onChange={handleChange}
                placeholder="e.g. Admiralty Way, Ogunlana Drive"
              />
            </div>

            {/* House / Plot number */}
            <div className="space-y-1.5">
              <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700">
                House / Plot number <span className="text-red-500">*</span>
              </label>
              <input
                className={`w-full border rounded-lg px-4 py-3 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${invalidHouseNumberStyle}`}
                name="houseNumber"
                id="houseNumber"
                value={form.houseNumber ? form.houseNumber : ""}
                onChange={handleChange}
                type="number"
                min="1"
                placeholder="e.g. 5, 12, 45"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-white fixed h-[60px] bottom-0 border-t border-gray-200 flex items-center justify-between px-5">
        <button
          type="button"
          onClick={prev}
          className="border-0 outline-none text-sm py-2 px-7 bg-white text-gray-700 font-semibold hover:text-black transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="text-sm py-2 px-7 flex items-center space-x-2 rounded-full bg-black text-white font-semibold hover:bg-gray-800 ease duration-300 transition-colors"
        >
          <span>Next</span>
          <MoveRight color="white" size={20} />
        </button>
      </div>
    </form>
  );
};

export const ContactInformation: FC<{
  form: CreateInspectionForm;
  setForm: Dispatch<SetStateAction<CreateInspectionForm>>;
  formValidation: CreateInspectionFormValidationType;
  setFormValidation: Dispatch<
    SetStateAction<CreateInspectionFormValidationType>
  >;
  next: () => void;
  prev: (e: MouseEvent<HTMLButtonElement>) => void;
}> = ({ form, setForm, setFormValidation, formValidation, prev, next }) => {
   console.log("ContactInformation mounted");
  console.log("form values:", form);
  console.log("formValidation:", formValidation);
  console.log("next function:", next);
  console.log("prev function:", prev);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevState: CreateInspectionForm) => ({
      ...prevState,
      [name]: value,
    }));
    setFormValidation((prev) => ({ ...prev, [name]: false }));
  };

  const invalidContactNameStyle = formValidation.contactName
    ? "border-primary border-[2px]"
    : "";
  const invalidContactEmailStyle = formValidation.contactEmail
    ? "border-primary border-[2px]"
    : "";
  const invalidContactPhoneStyle = formValidation.contactPhoneNumber
    ? "border-primary border-[2px]"
    : "";

  const isContactFormValid =
    formValidation.contactName ||
    formValidation.contactEmail ||
    formValidation.contactPhoneNumber;

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        console.log("ContactInformation submit fired");
    console.log("form at submit:", form);
    

        const values = validateContactInfo(form);

    console.log("validateContactInfo result:", values);

        if (Object.keys(values).length) {
          setFormValidation((prev) => ({ ...prev, ...values }));
          return;
        } else {
          next();
        }
      }}
className="w-full relative min-h-screen overflow-y-auto flex items-center justify-center max-w-[1400px] mx-auto"
    >
      <div className="w-full flex flex-col items-center min-h-[100px] md:w-5/6 about-one max-w-[1400px] mx-auto">
        <div className="w-5/6 md:w-1/2 flex flex-col items-center">
          <h3 className="w-full text-xl md:text-3xl mb-5 md:text-center">
            How can you be contacted?
          </h3>
          {isContactFormValid ? (
            <span className="text-primary font-semibold md:text-center">
              Please fill in all fields
            </span>
          ) : null}
          <div className="w-full space-y-2 mb-4">
            <label htmlFor="contact_name">Contact Name</label>
            <input
              className={`w-[96%] border border-black rounded-md p-3 placeholder:text-gray-300 text-md ${invalidContactNameStyle}`}
              name="contactName"
              id="contact_name"
              value={form.contactName}
              onChange={handleChange}
              placeholder="Enter the contact name"
            />
          </div>
          <div className="w-full flex flex-col items-center md:flex-row">
            <div className="w-full space-y-2 mb-4 md:w-1/2">
              <label htmlFor="contact_phone">Phone Number</label>
              <input
                className={`w-[96%] border border-black rounded-md p-3  placeholder:text-gray-300 text-md ${invalidContactPhoneStyle}`}
                name="contactPhoneNumber"
                id="contact_phone"
                placeholder="Enter your phone number"
                value={form.contactPhoneNumber}
                onChange={handleChange}
              />
            </div>
            <div className="w-full space-y-2 mb-4 md:w-1/2">
              <label htmlFor="contact_email">Email Address</label>
              <input
                className={`w-[96%] border border-black rounded-md p-3  placeholder:text-gray-300 text-md ${invalidContactEmailStyle}`}
                name="contactEmail"
                id="contact_email"
                type="email"
                value={form.contactEmail}
                onChange={handleChange}
                placeholder="Enter the contact email"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-white fixed h-[60px] bottom-0 border-t border-t-gray-400 flex items-center justify-between px-5">
        <button
          onClick={prev}
          className="border-0 outline-none text-sm py-2 px-7 bg-white text-black font-semibold underline"
        >
          Back
        </button>
        <button className="border-0 outline-none text-sm py-2 px-7 flex items-center space-x-2 rounded-full bg-black text-white font-semibold ease duration-300 hover:bg-red-700">
          <span> Next</span>
          <MoveRight color="white" size={20} />
        </button>
      </div>
    </form>
  );
};

export const InpsectionDateAndComments: FC<{
  form: CreateInspectionForm;
  setForm: Dispatch<SetStateAction<CreateInspectionForm>>;
  formValidation: CreateInspectionFormValidationType;
  setFormValidation: Dispatch<
    SetStateAction<CreateInspectionFormValidationType>
  >;
  prev: (e: MouseEvent<HTMLButtonElement>) => void;
  currentFormState: FormStates;
  setFormState: Dispatch<SetStateAction<FormStates>>;
}> = ({
  form,
  setForm,
  formValidation,
  setFormValidation,
  prev,
  setFormState,
  currentFormState,
}) => {
  const router = useRouter();

  const [createInspectionStatus, setCreateInspectionStatus] = useState(false);

  const [error, setError] = useState("");

  // Prefer the Redux store (populated when nav bar is visible). If missing
  // (create page hides nav so HamburgerButton never fetches /hosts/me), fall
  // back to a direct API call so hostId is always available.
  const hostIdFromStore = useSelector(
    (state: RootState) => state.user.me?.host?.id as string | undefined
  );
  const { data: meData } = useQuery({
    queryKey: ["me-create-listing"],
    queryFn: () => me("hosts"),
    enabled: !hostIdFromStore,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
  const hostId: string | undefined =
    hostIdFromStore || meData?.host?.id || undefined;

  const mutation = useMutation({
    mutationFn: createInspection,
    onSuccess() {
      setError("");
      setCreateInspectionStatus(true);
      setForm(defaultValues);
      setFormState("section-13");
    },
    onError(error: unknown) {
      let message = "Inspection creation failed. Please try again.";
      if (error && typeof error === "object") {
        const err = error as { response?: { data?: { message?: string | string[] } }; message?: string };
        const msg = err.response?.data?.message;
        if (Array.isArray(msg)) {
          message = msg.join(". ");
        } else if (typeof msg === "string") {
          message = msg;
        } else if (typeof err.message === "string" && err.message.includes("Network")) {
          message = "Network error. Check your connection and try again.";
        } else if (typeof err.message === "string" && err.message.toLowerCase().includes("s3")) {
          message = "Photo upload failed. Please check your file sizes and try again.";
        }
      }
      setError(message);
    },
  });

  const onSubmit = () => {
    if (!hostId) {
      setError("Please sign in as a host to create a listing. Refresh the page if you've already signed in.");
      return;
    }
    const result = getInspectionValidationResult(form);
    if (!result.isValid) {
      setError(result.message);
    } else {
      const { files, panoramaFiles, rooms, sharedSpaceFiles, ...rest } = form;
      const keys = Object.keys(rest);
      const inspection = new FormData();
      inspection.append("hostId", hostId);
      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        inspection.append("files", element);
      }
      for (let i = 0; i < panoramaFiles.length; i++) {
        const pano = panoramaFiles[i];
        if (pano.file) {
          inspection.append("panoramaFiles", pano.file);
          inspection.append("panoramaLabels", pano.label);
        }
      }

      for (let key of keys) {
        //@ts-ignore
        let element = rest[key];
        if (Array.isArray(element)) {
          element = JSON.stringify(element);
        }
        inspection.append(key, element);
      }
      mutation.mutate(inspection);
    }
  };

  const isInspectionDateAndTimeFormValid =
    formValidation.inspectionDate || formValidation.inspectionTime;

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        setError("");
        const values = validateInspectionDateAndTime(form);

        if (Object.keys(values).length) {
          setFormValidation((prev) => ({ ...prev, ...values }));
          setError(
            "Please select an inspection date and time to continue."
          );
          return;
        }
        onSubmit();
      }}
className="w-full relative min-h-screen overflow-y-auto flex items-center justify-center max-w-[1400px] mx-auto"
    >
      <div className="fixed w-full bottom-[60px] left-0 right-0 z-40 flex flex-col items-center justify-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm border-t border-gray-100">
        {error ? (
          <>
            <span className="p-2 rounded-md text-red-600 font-semibold text-center md:text-left text-sm">
              {error}
            </span>
            {(() => {
              const result = getInspectionValidationResult(form);
              // Only show "Go to" for sections other than current (section-12)
              const sectionsToFix = result.missingBySection.filter(
                (s) => s.sectionId !== "section-12"
              );
              if (sectionsToFix.length > 0) {
                return (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {sectionsToFix.map(({ sectionId, sectionName }) => (
                      <button
                        key={sectionId}
                        type="button"
                        onClick={() => {
                          setFormState(sectionId as FormStates);
                          setError("");
                        }}
                        className="text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-700 font-medium hover:bg-red-100 transition-colors border border-red-200"
                      >
                        Go to: {sectionName}
                      </button>
                    ))}
                  </div>
                );
              }
              return null;
            })()}
          </>
        ) : null}
      </div>
      <div className="w-full flex flex-col items-center min-h-[100px] md:w-5/6 about-one max-w-[1400px] mx-auto">
        <div className="w-5/6 md:w-1/2 flex flex-col items-center">
          <h3 className="w-full text-xl md:text-3xl mb-5 md:text-center ">
            Schedule an Inspection date
          </h3>
          {isInspectionDateAndTimeFormValid ? (
            <span className="text-primary font-semibold md:text-center"></span>
          ) : null}
          <p className="w-full text-md md:text-md mb-2 md:text-center ">
            Click to open up calendar and time selectors.
          </p>
          <div className="w-full flex flex-col justify-center  relative md:w-4/5">
            <CalendarDateAndTime
              form={form}
              setForm={setForm}
              setFormValidation={setFormValidation}
              formValidation={formValidation}
            />
          </div>
          <div className="w-full flex mt-14 flex-col justify-center  relative lg:w-5/6">
            <p className="w-full text-sm font-semibold">
              Choose a date that you will be available, to avoid rescheduling.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full bg-white fixed h-[60px] bottom-0 border-t border-t-gray-400 flex items-center justify-between px-5">
        <button
          onClick={prev}
          className="border-0 outline-none text-sm py-2 px-7 bg-white text-black font-semibold underline"
        >
          Back
        </button>
        {currentFormState === "section-13" ? (
          <div className="flex items-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                router.push("/hosts/dashboard/properties");
              }}
              className="border-0 outline-none text-sm py-2 px-7 flex items-center justify-center rounded-full bg-black text-white font-semibold ease duration-300 hover:bg-red-700"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            {createInspectionStatus && (
              <span>
                <Check size={17} color="green" />
              </span>
            )}
            <button className="border-0 outline-none text-sm py-2 px-7 flex items-center justify-center rounded-full bg-black text-white font-semibold ease duration-300 hover:bg-red-700">
              {mutation.isPending ? <Spinner /> : <span>Submit</span>}
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export const WhatIsNear: FC<{
  form: CreateInspectionForm;
  setForm: Dispatch<SetStateAction<CreateInspectionForm>>;
  formValidation: CreateInspectionFormValidationType;
  setFormValidation: Dispatch<
    SetStateAction<CreateInspectionFormValidationType>
  >;
  next: () => void;
  prev: (e: MouseEvent<HTMLButtonElement>) => void;
}> = ({ form, setForm, formValidation, setFormValidation, prev, next }) => {
  const [others, setOthers] = useState<string[]>([]);

  const [other, setOther] = useState("");

  const [showOthers, setShowOthers] = useState(false);

  const handleOtherToggle =
    (value: string) => (e: MouseEvent<HTMLDivElement>) => {
      if (others.includes(value)) {
        const filtered = others.filter((target) => target !== value);
        const mainStateFiltered = form.nearbyPlaces.filter(
          (target: string) => target !== value
        );
        if (filtered.length === 0) {
          setShowOthers(false);
        }
        setOthers(filtered);
        setForm((prevState: CreateInspectionForm) => ({
          ...prevState,
          nearbyPlaces: mainStateFiltered,
        }));
      } else {
        setOthers((prevState) => [...prevState, value]);
        setForm((prevState: CreateInspectionForm) => ({
          ...prevState,
          nearbyPlaces: [...prevState.nearbyPlaces, value],
        }));
      }
    };

  const handleOtherChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOther(e.target.value);
  };

  const handleEnterKey = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      if (others.includes(other) || !other) return;
      setFormValidation((prev) => ({ ...prev, nearbyPlaces: false }));
      setOthers((prevState) => [...prevState, other]);
      setForm((prevState: CreateInspectionForm) => ({
        ...prevState,
        nearbyPlaces: [...prevState.nearbyPlaces, other],
      }));
      setOther("");
    }
  };

  const addOther = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (others.includes(other) || !other) return;
    setFormValidation((prev) => ({ ...prev, nearbyPlaces: false }));
    setOthers((prevState) => [...prevState, other]);
    setForm((prevState: CreateInspectionForm) => ({
      ...prevState,
      nearbyPlaces: [...prevState.nearbyPlaces, other],
    }));
    setOther("");
  };

  const onSelect = (value: string) => (e: MouseEvent<HTMLDivElement>) => {
    setFormValidation((prev) => ({ ...prev, nearbyPlaces: false }));

    if (form.nearbyPlaces.includes(value)) {
      const nearbyPlacesFiltered = form.nearbyPlaces.filter(
        (target: string) => target !== value
      );
      setForm((prevState: CreateInspectionForm) => ({
        ...prevState,
        nearbyPlaces: nearbyPlacesFiltered,
      }));
      return;
    }
    setForm((prevState: CreateInspectionForm) => ({
      ...prevState,
      nearbyPlaces: [...prevState.nearbyPlaces, value],
    }));
  };

  const places = WHAT_IS_NEAR.map(({ text, Icon }, idx: number) => {
    const isSelectedCss = form.nearbyPlaces.includes(text)
      ? "bg-gray-100 border-2 border-black"
      : "border border-gray-300";

    return (
      <div
        onClick={onSelect(text)}
        key={idx}
        className={`w-full rounded-md space-x-2 p-2 cursor-pointer flex items-center justify-center ${isSelectedCss}  hover:bg-gray-100`}
      >
        <Icon size={16} />
        <span className="capitalize font-semibold">{text}</span>
      </div>
    );
  });

  const isNearbyPlacesValid = formValidation.nearbyPlaces;

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        const values = validateWhatIsNear(form);

        if (Object.keys(values).length) {
          setFormValidation((prev) => ({ ...prev, ...values }));
          return;
        } else {
          next();
        }
      }}
className="w-full relative min-h-screen overflow-y-auto flex items-center justify-center max-w-[1400px] mx-auto"
    >
      <div className="w-full flex flex-col items-center min-h-[100px] md:w-5/6 about-one max-w-[1400px] mx-auto">
        <h3 className="text-xl mb-5 text-center mb-2 md:text-3xl ">
          Which of these are close by?
        </h3>
        {isNearbyPlacesValid ? (
          <span className="text-primary font-semibold">
            You have to add at least one
          </span>
        ) : null}
        <p className="text-black text-sm mb-2">
          Click on item to add or remove from choices.
        </p>
        {showOthers && others.length ? (
          <>
            <div className="w-5/6 grid grid-cols-2 gap-4 md:w-4/6 md:grid-cols-3 lg:w-1/2">
              {others.map((text, idx: number) => {
                const isSelectedCss = others.includes(text)
                  ? "bg-gray-100 border-2 border-black"
                  : "border border-gray-300";
                return (
                  <div
                    className={`w-full rounded-md space-x-2 p-2 cursor-pointer flex items-center justify-center ${isSelectedCss}  hover:bg-gray-100`}
                    key={idx}
                    onClick={handleOtherToggle(text)}
                  >
                    <CheckCircle size={16} />
                    <span className="capitalize font-semibold">{text}</span>
                  </div>
                );
              })}
            </div>
            {others.length ? (
              <div className="w-5/6 md:w-4/6 lg:w-1/2">
                <div
                  onClick={() => {
                    setShowOthers(false);
                  }}
                  className="w-[150px] item-left mt-4 space-x-1 cursor-pointer border-b-[1.5px] border-b-black flex items-end font-semibold"
                >
                  <MoveLeft size={16} />
                  <span>Back to selection</span>
                </div>
              </div>
            ) : (
              ""
            )}
          </>
        ) : (
          <div className="w-5/6 grid grid-cols-2 gap-4 md:w-4/6 md:grid-cols-3 lg:w-1/2">
            {places}
            {others.length ? (
              <div
                onClick={() => {
                  setShowOthers(true);
                }}
                className="w-full cursor-pointer md:col-span-2 underline flex items-end font-semibold"
              >
                <span>+{others.length} more...(click to view)</span>
              </div>
            ) : (
              ""
            )}
          </div>
        )}

        <div className="w-5/6 flex flex-col justify-center md:w-4/6 lg:w-1/2">
          <label htmlFor="others" className="mt-4">
            Can't find what you're looking for? Add it below.
          </label>
          <div className="w-full space-y-4 flex justify-center flex-col  mt-2 md:flex-row md:space-y-0">
            <input
              onKeyUp={handleEnterKey}
              onChange={handleOtherChange}
              id="others"
              name="others"
              value={other}
              className="py-3 px-5 w-full text-md font-[500] rounded-tl-full rounded-bl-full text-[16px] rounded-tr-full rounded-br-full border border-black box-border md:w-4/6  md:rounded-tr-none md:rounded-br-none"
            />
            <button
              onClick={addOther}
              className="bg-black p-[13px] w-full text-white rounded-tr-full rounded-br-full rounded-tl-full rounded-bl-full font-semibold border-0 box-border md:rounded-tl-none md:rounded-bl-none md:w-2/6"
            >
              Add place
            </button>
          </div>
        </div>
      </div>
      <div className="w-full bg-white fixed h-[60px] bottom-0 border-t border-t-gray-400 flex items-center justify-between px-5">
        <button
          onClick={prev}
          className="border-0 outline-none text-sm py-2 px-7 bg-white text-black font-semibold underline"
        >
          Back
        </button>
        <button className="border-0 outline-none text-sm py-2 px-7 flex items-center space-x-2 rounded-full bg-black text-white font-semibold ease duration-300 hover:bg-red-700">
          <span> Next</span>
          <MoveRight color="white" size={20} />
        </button>
      </div>
    </form>
  );
};

export const Ammenities: FC<{
  form: CreateInspectionForm;
  setForm: Dispatch<SetStateAction<CreateInspectionForm>>;
  formValidation: CreateInspectionFormValidationType;
  setFormValidation: Dispatch<
    SetStateAction<CreateInspectionFormValidationType>
  >;
  next: () => void;
  prev: (e: MouseEvent<HTMLButtonElement>) => void;
}> = ({ form, setForm, formValidation, setFormValidation, next, prev }) => {
  const [others, setOthers] = useState<string[]>([]);

  const [other, setOther] = useState("");

  const [showOthers, setShowOthers] = useState(false);

  const handleOtherToggle =
    (value: string) => (e: MouseEvent<HTMLDivElement>) => {
      if (others.includes(value)) {
        const filtered = others.filter((target) => target !== value);
        const mainStateFiltered = form.ammenities.filter(
          (target: string) => target !== value
        );
        if (filtered.length === 0) {
          setShowOthers(false);
        }
        setOthers(filtered);
        setForm((prevState: CreateInspectionForm) => ({
          ...prevState,
          ammenities: mainStateFiltered,
        }));
      } else {
        setOthers((prevState) => [...prevState, value]);
        setForm((prevState: CreateInspectionForm) => ({
          ...prevState,
          ammenities: [...prevState.ammenities, value],
        }));
      }
    };

  const handleOtherChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOther(e.target.value);
  };

  const handleEnterKey = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      if (others.includes(other) || !other) return;
      setFormValidation((prev) => ({ ...prev, ammenities: false }));
      setOthers((prevState) => [...prevState, other]);
      setForm((prevState: CreateInspectionForm) => ({
        ...prevState,
        ammenities: [...prevState.ammenities, other],
      }));
      setOther("");
    }
  };

  const addOther = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (others.includes(other) || !other) return;
    setFormValidation((prev) => ({ ...prev, ammenities: false }));
    setOthers((prevState) => [...prevState, other]);
    setForm((prevState: CreateInspectionForm) => ({
      ...prevState,
      ammenities: [...prevState.ammenities, other],
    }));
    setOther("");
  };

  const onSelect = (value: string) => (e: MouseEvent<HTMLDivElement>) => {
    setFormValidation((prev) => ({ ...prev, ammenities: false }));
    if (form.ammenities.includes(value)) {
      const ammenitiesFiltered = form.ammenities.filter(
        (target: string) => target !== value
      );
      setForm((prevState: CreateInspectionForm) => ({
        ...prevState,
        ammenities: ammenitiesFiltered,
      }));
      return;
    }
    setForm((prevState: CreateInspectionForm) => ({
      ...prevState,
      ammenities: [...prevState.ammenities, value],
    }));
  };

  const isAmmenitiesValid = formValidation.ammenities;

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        const values = validateAmmenities(form);

        if (Object.keys(values).length) {
          setFormValidation((prev) => ({ ...prev, ...values }));
          return;
        } else {
          next();
        }
      }}
className="w-full relative min-h-screen overflow-y-auto flex items-center justify-center max-w-[1400px] mx-auto"
    >
      <div className="w-full flex flex-col items-center min-h-[100px] md:w-5/6 about-one max-w-[1400px] mx-auto">
        <h3 className="text-xl mb-5 text-center mb-2 md:text-3xl ">
          Choose available amenities.
        </h3>
        {isAmmenitiesValid ? (
          <span className="text-primary font-semibold">
            You have to add at least one
          </span>
        ) : null}
        <p className="text-black text-sm mb-2">
          Click on item to add or remove from choices.
        </p>
        {showOthers && others.length ? (
          <>
            <div className="w-5/6 grid grid-cols-2 gap-4 md:w-5/6 md:grid-cols-3 lg:w-1/2">
              {others.map((text, idx: number) => {
                const isSelectedCss = others.includes(text)
                  ? "bg-gray-100 border-2 border-black"
                  : "border border-gray-300";
                return (
                  <div
                    className={`w-full rounded-md space-x-2 p-2 cursor-pointer flex items-center justify-center ${isSelectedCss} hover:bg-gray-100`}
                    key={idx}
                    onClick={handleOtherToggle(text)}
                  >
                    <CheckCircle size={16} />
                    <span className="capitalize font-semibold">{text}</span>
                  </div>
                );
              })}
            </div>
            {others.length ? (
              <div className="w-5/6 md:w-5/6 lg:w-1/2">
                <div
                  onClick={() => {
                    setShowOthers(false);
                  }}
                  className="w-[150px] item-left mt-4 space-x-1 cursor-pointer border-b-[1.5px] border-b-black flex items-end font-semibold"
                >
                  <MoveLeft size={16} />
                  <span>Back to selection</span>
                </div>
              </div>
            ) : (
              ""
            )}
          </>
        ) : (
          <div className="w-5/6 grid grid-cols-2 gap-4 md:w-5/6 md:grid-cols-3 lg:w-1/2">
            {AMMENITIES.map(({ text, Icon }, idx: number) => {
              const isSelectedCss = form.ammenities.includes(text)
                ? "bg-gray-100 border-2 border-black"
                : "border border-gray-300";

              return (
                <div
                  onClick={onSelect(text)}
                  key={idx}
                  className={`w-full rounded-md space-x-2 p-2 cursor-pointer flex items-center justify-center ${isSelectedCss}  hover:bg-gray-100`}
                >
                  <Icon size={16} />
                  <span className="capitalize font-semibold">{text}</span>
                </div>
              );
            })}
            {others.length ? (
              <div
                onClick={() => {
                  setShowOthers(true);
                }}
                className="w-full cursor-pointer md:col-span-2 underline flex items-end font-semibold"
              >
                <span>+{others.length} more...(click to view)</span>
              </div>
            ) : (
              ""
            )}
          </div>
        )}

        <div className="w-5/6 flex flex-col justify-center md:w-5/6 lg:w-1/2">
          <label htmlFor="others" className="mt-4">
            Can't find what you're looking for? Add it below.
          </label>
          <div className="w-full space-y-4 flex justify-center flex-col  mt-2 md:flex-row md:space-y-0">
            <input
              onKeyUp={handleEnterKey}
              onChange={handleOtherChange}
              id="others"
              name="others"
              value={other}
              className="py-3 px-5 w-full text-md font-[500] rounded-tl-full rounded-bl-full rounded-tr-full rounded-br-full border border-black box-border md:w-4/6  md:rounded-tr-none md:rounded-br-none"
            />
            <button
              onClick={addOther}
              className="bg-black p-[13px] w-full text-white rounded-tr-full rounded-br-full rounded-tl-full rounded-bl-full font-semibold border-0 box-border md:rounded-tl-none md:rounded-bl-none md:w-2/6"
            >
              Add more
            </button>
          </div>
        </div>
      </div>
      <div className="w-full fixed bg-white h-[60px] bottom-0 border-t border-t-gray-400 flex items-center justify-between px-5">
        <button
          onClick={prev}
          className="border-0 outline-none text-sm py-2 px-7 bg-white text-black font-semibold underline"
        >
          Back
        </button>
        <button className="border-0 outline-none text-sm py-2 px-7 flex items-center space-x-2 rounded-full bg-black text-white font-semibold ease duration-300 hover:bg-red-700">
          <span> Next</span>
          <MoveRight color="white" size={20} />
        </button>
      </div>
    </form>
  );
};

const RULES: { label: string; icon: string }[] = [
  { label: "No smoking indoors", icon: "🚬" },
  { label: "No pets allowed", icon: "🐾" },
  { label: "No open fire or candles", icon: "🕯️" },
  { label: "No unregistered visitors", icon: "🚷" },
  { label: "Damaged items will be charged", icon: "🛠️" },
  { label: "No loud music after 10 PM", icon: "🔇" },
  { label: "No parties or events", icon: "🎉" },
  { label: "No cooking of strong-smelling food", icon: "🍲" },
  { label: "Generator usage hours apply", icon: "⚡" },
  { label: "No use of AC after agreed hours", icon: "❄️" },
  { label: "Waste must be disposed properly", icon: "🗑️" },
  { label: "No overnight guests without notice", icon: "🌙" },
  { label: "Keep common areas clean", icon: "🧹" },
  { label: "No drying of clothes in common areas", icon: "👕" },
  { label: "Quiet hours between 10 PM and 7 AM", icon: "😴" },
  { label: "No use of personal hotplate or cooker", icon: "🍳" },
  { label: "Gate must be locked at all times", icon: "🔒" },
  { label: "No religious gatherings without notice", icon: "🙏" },
  { label: "Water usage is metered", icon: "💧" },
  { label: "No subletting without permission", icon: "📋" },
];

export const HouseRules: FC<{
  form: CreateInspectionForm;
  setForm: Dispatch<SetStateAction<CreateInspectionForm>>;
  formValidation: CreateInspectionFormValidationType;
  setFormValidation: Dispatch<SetStateAction<CreateInspectionFormValidationType>>;
  next: () => void;
  prev: (e: MouseEvent<HTMLButtonElement>) => void;
}> = ({ form, setForm, formValidation, setFormValidation, next, prev }) => {
  const [customRule, setCustomRule] = useState("");

  // ── helpers ──────────────────────────────────────────────────────────────
  const toggleRule = (label: string) => {
    setFormValidation((p) => ({ ...p, houseRules: false }));
    setForm((p) => ({
      ...p,
      houseRules: p.houseRules.includes(label)
        ? p.houseRules.filter((r) => r !== label)
        : [...p.houseRules, label],
    }));
  };

  const addCustomRule = () => {
    const trimmed = customRule.trim();
    if (!trimmed || form.houseRules.includes(trimmed)) return;
    setFormValidation((p) => ({ ...p, houseRules: false }));
    setForm((p) => ({ ...p, houseRules: [...p.houseRules, trimmed] }));
    setCustomRule("");
  };

  // ── AM/PM time picker helpers ─────────────────────────────────────────────
  const parseTime = (val: string) => {
    if (!val) return { h: "", m: "", period: "AM" };
    const [hh, mm] = val.split(":");
    const hour = parseInt(hh, 10);
    return {
      h: String(hour > 12 ? hour - 12 : hour === 0 ? 12 : hour).padStart(2, "0"),
      m: mm ?? "00",
      period: hour >= 12 ? "PM" : "AM",
    };
  };

  const buildTime = (h: string, m: string, period: string) => {
    let hour = parseInt(h, 10);
    if (isNaN(hour)) return "";
    if (period === "AM" && hour === 12) hour = 0;
    if (period === "PM" && hour !== 12) hour += 12;
    return `${String(hour).padStart(2, "0")}:${m}`;
  };

  const TimeInput = ({
    name,
    label,
    icon,
    value,
    invalid,
  }: {
    name: "checkInAfter" | "checkOutBefore";
    label: string;
    icon: string;
    value: string;
    invalid: boolean;
  }) => {
    const { h, m, period } = parseTime(value);
    const update = (newH: string, newM: string, newP: string) => {
      const time = buildTime(newH || h, newM ?? m, newP || period);
      if (time) {
        setForm((p) => ({ ...p, [name]: time }));
        setFormValidation((p) => ({ ...p, [name]: false }));
      }
    };
    const hours = Array.from({ length: 12 }, (_, i) =>
      String(i + 1).padStart(2, "0")
    );
    const minutes = ["00", "15", "30", "45"];

    return (
      <div className="flex-1 min-w-0">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          <span className="mr-1">{icon}</span>
          {label}
        </label>
        <div
          className={`flex items-center gap-1 rounded-xl border bg-white px-3 py-2.5 shadow-sm ${
            invalid ? "border-red-400" : "border-gray-200"
          }`}
        >
          {/* Hour */}
          <select
            value={h}
            onChange={(e) => update(e.target.value, m, period)}
            className="flex-1 text-sm font-semibold text-gray-800 bg-transparent outline-none cursor-pointer"
          >
            <option value="">HH</option>
            {hours.map((hv) => (
              <option key={hv} value={hv}>{hv}</option>
            ))}
          </select>
          <span className="text-gray-400 font-bold text-sm">:</span>
          {/* Minute */}
          <select
            value={m}
            onChange={(e) => update(h, e.target.value, period)}
            className="flex-1 text-sm font-semibold text-gray-800 bg-transparent outline-none cursor-pointer"
          >
            <option value="">MM</option>
            {minutes.map((mv) => (
              <option key={mv} value={mv}>{mv}</option>
            ))}
          </select>
          {/* AM / PM */}
          <div className="flex rounded-lg overflow-hidden border border-gray-200 ml-1">
            {["AM", "PM"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => update(h, m, p)}
                className={`px-2.5 py-1 text-xs font-bold transition-colors ${
                  period === p
                    ? "bg-black text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const presetLabels = RULES.map((r) => r.label);
  const customRules = form.houseRules.filter((r) => !presetLabels.includes(r));

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        const errors = validateHouseRules(form);
        if (Object.keys(errors).length) {
          setFormValidation((p) => ({ ...p, ...errors }));
        } else {
          next();
        }
      }}
      className="w-full min-h-screen bg-gray-50 pb-24 overflow-y-auto"
    >
      <div className="max-w-[680px] mx-auto px-4 pt-8">

        {/* ── Heading ── */}
        <div className="mb-8">
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1">
            House rules
          </h3>
          <p className="text-sm text-gray-500">
            Let guests know what's expected during their stay.
          </p>
        </div>

        {/* ── Check-in / Check-out ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            🕐 Check-in &amp; Check-out times
          </p>
          <div className="flex gap-4 flex-wrap">
            <TimeInput
              name="checkInAfter"
              label="Check-in after"
              icon="🔑"
              value={form.checkInAfter}
              invalid={!!formValidation.checkInAfter}
            />
            <TimeInput
              name="checkOutBefore"
              label="Check-out before"
              icon="🚪"
              value={form.checkOutBefore}
              invalid={!!formValidation.checkOutBefore}
            />
          </div>
        </div>

        {/* ── Preset rules ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-700">
              📋 Select applicable rules
            </p>
            {form.houseRules.length > 0 && (
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs font-bold">
                {form.houseRules.length}
              </span>
            )}
          </div>

          {formValidation.houseRules && (
            <p className="text-xs text-red-500 font-medium mb-3">
              Please select at least one house rule.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {RULES.map(({ label, icon }) => {
              const selected = form.houseRules.includes(label);
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleRule(label)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 ${
                    selected
                      ? "bg-black text-white border-black shadow-sm"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-base leading-none flex-shrink-0">
                    {selected ? "✓" : icon}
                  </span>
                  <span className="leading-snug">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Custom rules ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            ✏️ Add a custom rule
          </p>
          <div className="flex gap-2">
            <input
              value={customRule}
              onChange={(e) => setCustomRule(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && addCustomRule()}
              placeholder="e.g. No use of charcoal on the balcony"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors"
            />
            <button
              type="button"
              onClick={addCustomRule}
              disabled={!customRule.trim()}
              className="px-5 py-2.5 rounded-xl bg-black text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
            >
              Add
            </button>
          </div>

          {/* Custom rule chips */}
          {customRules.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {customRules.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => toggleRule(r)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <span>✏️ {r}</span>
                  <X size={12} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Selected summary ── */}
        {form.houseRules.length > 0 && (
          <div className="bg-green-50 border border-green-100 rounded-2xl px-5 py-4 mb-2">
            <p className="text-xs font-semibold text-green-700 mb-2">
              ✅ {form.houseRules.length} rule{form.houseRules.length > 1 ? "s" : ""} selected
            </p>
            <div className="flex flex-wrap gap-1.5">
              {form.houseRules.map((r) => {
                const preset = RULES.find((p) => p.label === r);
                return (
                  <span
                    key={r}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-green-200 text-xs text-gray-700"
                  >
                    {preset ? preset.icon : "✏️"} {r}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-[60px] flex items-center justify-between px-5 z-30">
        <button
          type="button"
          onClick={prev}
          className="text-sm py-2 px-6 text-gray-700 font-semibold hover:text-black underline transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="text-sm py-2 px-7 flex items-center gap-2 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
        >
          <span>Next</span>
          <MoveRight color="white" size={18} />
        </button>
      </div>
    </form>
  );
};

export const PriceCalculator: FC<{
  form: CreateInspectionForm;
  setForm: Dispatch<SetStateAction<CreateInspectionForm>>;
  formValidation: CreateInspectionFormValidationType;
  setFormValidation: Dispatch<
    SetStateAction<CreateInspectionFormValidationType>
  >;
  next: () => void;
  prev: (e: MouseEvent<HTMLButtonElement>) => void;
}> = ({ form, setForm, formValidation, setFormValidation, next, prev }) => {
  const isTownHouse = form.typeOfProperty === "town-house";

  const [openCaution, setOpenCaution] = useState(form.cautionFee > 0);

  const handleNumberInput = (field: string, value: string) => {
    const num = +value.replace(/,/g, "");
    if (isNaN(num)) return;
    setForm((prev) => ({ ...prev, [field]: num }));
    if (field === "price" || field === "monthlyPrice") {
      setFormValidation((prev) => ({ ...prev, price: false }));
    }
  };

  const displayPrice = isTownHouse ? form.monthlyPrice : form.price;
  const guestServiceFee = (10 / 100) * displayPrice;
  // Host keeps 100% of room price
  const youEarn = displayPrice;

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        if (isTownHouse) {
          if (!form.monthlyPrice || form.monthlyPrice <= 0) {
            setFormValidation((prev) => ({ ...prev, price: true }));
            return;
          }
        } else {
          const values = validatePrice(form);
          if (Object.keys(values).length) {
            setFormValidation((prev) => ({ ...prev, ...values }));
            return;
          }
        }
        next();
      }}
      className="w-full relative h-full overflow-y-auto"
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-28">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            Set your pricing
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-md mx-auto">
            {isTownHouse
              ? "Town House properties are billed monthly. Set your monthly rate and stay duration."
              : "Set the nightly rate guests will pay for your property."}
          </p>
          {formValidation.price && (
            <p className="mt-3 text-sm font-semibold text-primary">
              Please enter a valid price
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {isTownHouse ? "Monthly price" : "Price per night"}
            </label>
            <div className="flex items-center gap-1">
              <span className="text-3xl sm:text-4xl font-bold text-gray-900">₦</span>
              <input
                className="flex-1 text-3xl sm:text-4xl font-bold border-0 outline-none bg-transparent"
                placeholder={isTownHouse ? "250000" : "35000"}
                onChange={(e) =>
                  handleNumberInput(
                    isTownHouse ? "monthlyPrice" : "price",
                    e.target.value
                  )
                }
                value={
                  (isTownHouse ? form.monthlyPrice : form.price) > 0
                    ? (isTownHouse ? form.monthlyPrice : form.price).toLocaleString()
                    : ""
                }
              />
              <span className="text-sm font-semibold text-gray-400">
                /{isTownHouse ? "month" : "night"}
              </span>
            </div>
          </div>

        {/* Town House: stay duration range */}
        {isTownHouse && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-5">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-gray-900">
                Stay duration range
              </h3>
              <span className="group relative">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 rounded-lg bg-gray-900 text-white text-xs p-2.5 leading-relaxed opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                  Guests can only book within this range. Minimum 3 months, maximum 6 months.
                </span>
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Set the minimum and maximum months a guest can book (3–6 months).
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Minimum (months)
                </label>
                <select
                  value={form.minStayMonths}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      minStayMonths: +e.target.value,
                      maxStayMonths: Math.max(+e.target.value, prev.maxStayMonths),
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-semibold focus:border-gray-400 focus:outline-none"
                >
                  {[3, 4, 5, 6].map((m) => (
                    <option key={m} value={m}>
                      {m} months
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Maximum (months)
                </label>
                <select
                  value={form.maxStayMonths}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      maxStayMonths: +e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-semibold focus:border-gray-400 focus:outline-none"
                >
                  {[3, 4, 5, 6]
                    .filter((m) => m >= form.minStayMonths)
                    .map((m) => (
                      <option key={m} value={m}>
                        {m} months
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Caution fee — shown for all types */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-5">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-gray-900">
              Caution fee
            </h3>
            <span className="group relative">
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-60 rounded-lg bg-gray-900 text-white text-xs p-2.5 leading-relaxed opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                A refundable deposit charged to guests to protect against potential damages during their stay.
              </span>
            </span>
            <div className="ml-auto">
              <Switch
                id="caution-fee"
                checked={openCaution}
                onCheckedChange={(checked) => {
                  setOpenCaution(checked);
                  if (!checked)
                    setForm((prev) => ({ ...prev, cautionFee: 0 }));
                }}
                className="isolate"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            This refundable fee protects your property against damages. It is returned to the guest after checkout.
          </p>
          {openCaution && (
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-gray-900">₦</span>
              <input
                type="text"
                value={form.cautionFee > 0 ? form.cautionFee.toLocaleString() : ""}
                onChange={(e) => {
                  const num = +e.target.value.replace(/,/g, "");
                  if (isNaN(num)) return;
                  setForm((prev) => ({ ...prev, cautionFee: num }));
                }}
                placeholder="10000"
                className="flex-1 text-2xl font-bold border-0 outline-none bg-transparent"
              />
              <span className="text-xs font-semibold text-gray-400">refundable</span>
            </div>
          )}
        </div>

        {/* Long-stay discount (non-town-house) */}
        {!isTownHouse && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-5">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-gray-900">
                Long-stay discount
              </h3>
              <span className="group relative">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 rounded-lg bg-gray-900 text-white text-xs p-2.5 leading-relaxed opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                  Attract long-term guests by offering a discount on stays of 7 days or more. This is applied automatically.
                </span>
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Guests who book for 7 or more days automatically receive this discount.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                max={50}
                value={form.longStayDiscountPercent}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    longStayDiscountPercent: Math.min(50, Math.max(0, +e.target.value)),
                  }))
                }
                className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-center text-lg font-bold focus:border-gray-400 focus:outline-none"
              />
              <span className="text-sm font-semibold text-gray-500">% off</span>
              <span className="text-xs text-gray-400 ml-auto">for stays of 7+ days</span>
            </div>
          </div>
        )}

        {/* Price breakdown card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-base font-bold text-gray-900">Price breakdown</h3>
            <span className="group relative">
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 rounded-lg bg-gray-900 text-white text-xs p-2.5 leading-relaxed opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                This shows what guests pay and what you earn after platform fees.
              </span>
            </span>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-gray-600">
                {isTownHouse
                  ? "Base monthly price"
                  : "Base nightly price"}
              </span>
              <span className="font-semibold">
                ₦{displayPrice.toLocaleString()}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-gray-600">Service fee (10%)</span>
              <span className="font-semibold">
                ₦{Math.round(guestServiceFee).toLocaleString()}
              </span>
            </li>
            {form.cautionFee > 0 && (
              <li className="flex items-center justify-between">
                <span className="text-gray-600">Caution fee (refundable)</span>
                <span className="font-semibold">
                  ₦{form.cautionFee.toLocaleString()}
                </span>
              </li>
            )}
            {!isTownHouse && form.longStayDiscountPercent > 0 && (
              <li className="flex items-center justify-between text-emerald-600">
                <span>Long-stay discount ({form.longStayDiscountPercent}%)</span>
                <span className="font-semibold">Applied on 7+ day bookings</span>
              </li>
            )}
            <li className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="font-bold text-gray-900">Guest pays</span>
              <span className="font-bold text-gray-900">
                ₦{(displayPrice + Math.round(guestServiceFee) + form.cautionFee).toLocaleString()}
                <span className="text-xs font-normal text-gray-400 ml-1">
                  /{isTownHouse ? "month" : "night"}
                </span>
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="font-bold text-gray-900">You earn</span>
              <span className="font-bold text-emerald-600">
                ₦{Math.round(youEarn).toLocaleString()}
                <span className="text-xs font-normal text-gray-400 ml-1">
                  /{isTownHouse ? "month" : "night"}
                </span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bg-white w-full h-[60px] bottom-0 border-t border-t-gray-200 flex items-center justify-between px-5 z-30">
        <button
          onClick={prev}
          className="border-0 outline-none text-sm py-2 px-7 bg-white text-black font-semibold underline"
        >
          Back
        </button>
        <button className="border-0 outline-none text-sm py-2.5 px-8 flex items-center space-x-2 rounded-full bg-gray-900 text-white font-semibold ease duration-300 hover:bg-gray-800 shadow-md">
          <span>Next</span>
          <MoveRight color="white" size={18} />
        </button>
      </div>
    </form>
  );
};

export function PropertyCreatedMessage() {
  return (
    <div className="w-5/6 min-h-[200px] shadow-lg py-10 flex items-center justify-center flex flex-col max-w-[600px]">
      <CheckCircle color="#34A853" size={100} />
      <p className="text-center font-semibold my-2 md:text-left text-[20px] font-bold">
        Inspection request has been submitted successfully.
      </p>
    </div>
  );
}
