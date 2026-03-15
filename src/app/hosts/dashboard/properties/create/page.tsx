"use client";
import {
  useEffect,
  MouseEvent,
  useCallback,
  useState,
  FC,
  SetStateAction,
  Dispatch,
  ReactNode,
} from "react";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { me } from "@/http/api";
import { FormStates } from "@/store/features/inspection-request-slice";
import {
  Ammenities,
  ContactInformation,
  FormDescription,
  PropertyLocation,
  HouseRules,
  InpsectionDateAndComments,
  PriceCalculator,
  TitleAndPropertyDescription,
  TypeOfProperty,
  UploadPropertyImages,
  WhatIsNear,
  PropertyCreatedMessage,
} from "@/components/pages/hosts/properties/inspection-request-form-states";
import { X } from "lucide-react";
import {
  CreateInspectionForm,
  CreateInspectionFormValidationType,
  defaultValidationValues,
  defaultValues,
  getInspectionProgress,
} from "@/lib/utils";
import dynamic from "next/dynamic";
import Link from "next/link";

const LocationOnMap: any = dynamic(
  async () => {
    const comp = await import("@/components/maps/interactive-map");
    return comp;
  },
  {
    ssr: false,
  }
);

export default () => {
  const formOpen = useSelector((state: RootState) => state.inspection?.formOpen);
  const hostIdFromStore = useSelector(
    (state: RootState) => state.user?.me?.host?.id as string | undefined
  );
  const isAuthenticatedFromStore = useSelector(
    (state: RootState) => !!state.user?.me?.id
  );

  // When the nav is hidden (create page), HamburgerButton never fires, so
  // Redux is empty. Fall back to a direct API call to determine host status.
  const { data: meData } = useQuery({
    queryKey: ["me-create-page"],
    queryFn: () => me("hosts"),
    enabled: !hostIdFromStore && !isAuthenticatedFromStore,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const hostId = hostIdFromStore || meData?.host?.id || undefined;
  const isAuthenticated = isAuthenticatedFromStore || !!(meData?.host?.id || meData?.user?.id);

  const [currentFormState, setFormState] = useState<FormStates>("section-1");

  const [form, setForm] = useState<CreateInspectionForm>(defaultValues);

  const [formValidation, setFormValidation] =
    useState<CreateInspectionFormValidationType>(defaultValidationValues);

  let CurrentFormState: FC<{
    form: CreateInspectionForm;
    setForm: Dispatch<SetStateAction<CreateInspectionForm>>;
    formValidation: CreateInspectionFormValidationType;
    setFormValidation: Dispatch<
      SetStateAction<CreateInspectionFormValidationType>
    >;
    next: () => void;
    prev: (e: MouseEvent<HTMLButtonElement>) => void;
    setFormState: Dispatch<SetStateAction<FormStates>>;
    children?: ReactNode;
    currentFormState: FormStates;
  }> = FormDescription;
  switch (currentFormState) {
    case "section-1":
      CurrentFormState = FormDescription;
      break;
    case "section-2":
      CurrentFormState = TypeOfProperty;
      break;
    case "section-3":
      CurrentFormState = TitleAndPropertyDescription;
      break;
    case "section-4":
      CurrentFormState = UploadPropertyImages;
      break;
    case "section-5":
      CurrentFormState = PropertyLocation;
      break;
    case "section-6":
      CurrentFormState = LocationOnMap;
      break;
    case "section-7":
      CurrentFormState = WhatIsNear;
      break;
    case "section-8":
      CurrentFormState = Ammenities;
      break;
    case "section-9":
      CurrentFormState = HouseRules;
      break;
    case "section-10":
      CurrentFormState = PriceCalculator;
      break;
    case "section-11":
      CurrentFormState = ContactInformation;
      break;
    case "section-12":
      CurrentFormState = InpsectionDateAndComments;
      break;
    case "section-13":
      CurrentFormState = PropertyCreatedMessage;
      break;
    default:
      break;
  }

  useEffect(() => {
    if (formOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "hidden auto";
    };
  }, [formOpen]);

  const prevSection = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      switch (currentFormState) {
        case "section-2":
          setFormState("section-1");
          break;
        case "section-3":
          setFormState("section-2");
          break;
        case "section-4":
          setFormState("section-3");
          break;
        case "section-5":
          setFormState("section-4");
          break;
        case "section-6":
          setFormState("section-5");
          break;
        case "section-7":
          setFormState("section-6");
          break;
        case "section-8":
          setFormState("section-7");
          break;
        case "section-9":
          setFormState("section-8");
          break;
        case "section-10":
          setFormState("section-9");
          break;
        case "section-11":
          setFormState("section-10");
          break;
        case "section-12":
          setFormState("section-11");
          break;
        default:
          break;
      }
    },
    [currentFormState]
  );

  const nextSection = useCallback(() => {
    switch (currentFormState) {
      case "section-1":
        setFormState("section-2");
        break;
      case "section-2":
        setFormState("section-3");
        break;
      case "section-3":
        setFormState("section-4");
        break;
      case "section-4":
        setFormState("section-5");
        break;
      case "section-5":
        setFormState("section-6");
        break;
      case "section-6":
        setFormState("section-7");
        break;
      case "section-7":
        setFormState("section-8");
        break;
      case "section-8":
        setFormState("section-9");
        break;
      case "section-9":
        setFormState("section-10");
        break;
      case "section-10":
        setFormState("section-11");
        break;
      case "section-11":
        setFormState("section-12");
        break;
      default:
        break;
    }
  }, [currentFormState]);

  const { step, total, label } = getInspectionProgress(currentFormState);
  const isSuccess = currentFormState === "section-13";
  // Only show guard when we're certain: user is logged in but has no host profile
  const showGuard = isAuthenticated && !hostId;

  if (showGuard) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <p className="text-gray-600 mb-4">
            You need to complete your host profile before creating a listing.
          </p>
          <Link
            href="/hosts/dashboard/properties"
            className="text-primary font-semibold hover:underline"
          >
            Back to properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white text-black z-[9999999999] relative">
      {/* Cancel button — floating top-right */}
      <Link
        href="/hosts/dashboard/properties"
        className="fixed top-4 right-5 z-50 border-0 outline-none text-sm py-2 px-6 flex items-center space-x-1.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 font-semibold shadow-lg hover:bg-white transition-all duration-200"
      >
        <span>Cancel</span>
        <X size={16} />
      </Link>

      {/* Progress indicator — hidden on success */}
      {!isSuccess && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">
                Step {step} of {total}
              </span>
              <span className="text-gray-500 truncate max-w-[60%]">
                {label}
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
                style={{ width: `${(step / total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div
        className={`w-full flex flex-col items-center overflow-y-auto overflow-x-hidden ${
          !isSuccess ? "pt-16" : ""
        }`}
        style={{ minHeight: "100vh" }}
      >
        <CurrentFormState
          prev={prevSection}
          currentFormState={currentFormState}
          form={form}
          formValidation={formValidation}
          setForm={setForm}
          setFormValidation={setFormValidation}
          next={nextSection}
          setFormState={setFormState}
        />
      </div>
    </div>
  );
};
