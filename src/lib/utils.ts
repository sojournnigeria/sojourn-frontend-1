import { IndividualAccountDetails } from "@/components/pages/hosts/manage-profile";
import { PropertyTypes } from "@/components/pages/hosts/properties/inspection-request-form-states";
import { IndividualUserAccountDetails } from "@/components/pages/profile";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Human-readable labels for form fields */
const FIELD_LABELS: Record<string, string> = {
  typeOfProperty: "Property type",
  title: "Property title",
  numberOfRooms: "Number of rooms",
  maxNumberOfPeople: "Max guests",
  description: "Description",
  files: "Property photos (min. 3)",
  country: "Country",
  city: "City",
  street: "Street",
  houseNumber: "House number",
  zip: "ZIP/Postal code",
  lat: "Map location",
  lng: "Map location",
  nearbyPlaces: "What's nearby",
  ammenities: "Amenities",
  houseRules: "House rules",
  checkInAfter: "Check-in time",
  checkOutBefore: "Check-out time",
  price: "Nightly price",
  contactName: "Contact name",
  contactEmail: "Contact email",
  contactPhoneNumber: "Contact phone",
  inspectionDate: "Inspection date",
  inspectionTime: "Inspection time",
  rooms: "Room details",
};

/** Section IDs and names for navigation */
export const INSPECTION_SECTIONS: Record<string, { id: string; name: string }> =
  {
    "section-1": { id: "section-1", name: "Get started" },
    "section-2": { id: "section-2", name: "Property type" },
    "section-3": { id: "section-3", name: "Describe your place" },
    "section-4": { id: "section-4", name: "Add photos" },
    "section-5": { id: "section-5", name: "Property address" },
    "section-6": { id: "section-6", name: "Set location on map" },
    "section-7": { id: "section-7", name: "What's nearby" },
    "section-8": { id: "section-8", name: "Amenities" },
    "section-9": { id: "section-9", name: "House rules" },
    "section-10": { id: "section-10", name: "Set your price" },
    "section-11": { id: "section-11", name: "Contact information" },
    "section-12": { id: "section-12", name: "Schedule inspection" },
    "section-13": { id: "section-13", name: "Success" },
  };

/** Ordered section IDs for progress (steps 1–12, excluding success) */
export const INSPECTION_SECTION_ORDER = [
  "section-1",
  "section-2",
  "section-3",
  "section-4",
  "section-5",
  "section-6",
  "section-7",
  "section-8",
  "section-9",
  "section-10",
  "section-11",
  "section-12",
] as const;

export function getInspectionProgress(currentFormState: string): {
  step: number;
  total: number;
  label: string;
} {
  const idx = INSPECTION_SECTION_ORDER.indexOf(
    currentFormState as (typeof INSPECTION_SECTION_ORDER)[number]
  );
  const step = idx >= 0 ? idx + 1 : 1;
  const total = INSPECTION_SECTION_ORDER.length;
  const label = INSPECTION_SECTIONS[currentFormState]?.name ?? "Create listing";
  return { step, total, label };
}

/** Maps form fields to their section */
const FIELD_TO_SECTION: Record<string, string> = {
  typeOfProperty: "section-2",
  title: "section-3",
  numberOfRooms: "section-3",
  maxNumberOfPeople: "section-3",
  description: "section-3",
  files: "section-4",
  country: "section-5",
  city: "section-5",
  street: "section-5",
  houseNumber: "section-5",
  zip: "section-5",
  lat: "section-6",
  lng: "section-6",
  nearbyPlaces: "section-7",
  ammenities: "section-8",
  houseRules: "section-9",
  checkInAfter: "section-9",
  checkOutBefore: "section-9",
  price: "section-10",
  contactName: "section-11",
  contactEmail: "section-11",
  contactPhoneNumber: "section-11",
  inspectionDate: "section-12",
  inspectionTime: "section-12",
  rooms: "section-4",
};

export interface ValidationResult {
  isValid: boolean;
  missingBySection: { sectionId: string; sectionName: string; fields: string[] }[];
  message: string;
}

/** Runs all section validators and returns which sections/fields are missing */
export function getInspectionValidationResult(
  form: Partial<CreateInspectionForm>
): ValidationResult {
  const allErrors: { [key: string]: boolean } = {};
  Object.assign(
    allErrors,
    validateTypeOfProperty(form),
    validateBasicPropertyDetailsSection(form),
    validateNumberOfPictures(form),
    validatePropertyLocationDetails(form),
    validateWhatIsNear(form),
    validateAmmenities(form),
    validateHouseRules(form),
    validatePrice(form),
    validateContactInfo(form),
    validateInspectionDateAndTime(form)
  );

  // Lat/lng from map
  if (!form.lat?.trim()) allErrors["lat"] = true;
  if (!form.lng?.trim()) allErrors["lng"] = true;

  const missingKeys = Object.keys(allErrors).filter((k) => allErrors[k]);
  if (missingKeys.length === 0) {
    return { isValid: true, missingBySection: [], message: "" };
  }

  // Group by section
  const sectionMap = new Map<
    string,
    { sectionName: string; fields: string[] }
  >();
  for (const key of missingKeys) {
    const sectionId = FIELD_TO_SECTION[key] || "section-3";
    const sectionInfo = INSPECTION_SECTIONS[sectionId];
    const label = FIELD_LABELS[key] || key;
    if (!sectionMap.has(sectionId)) {
      sectionMap.set(sectionId, {
        sectionName: sectionInfo?.name ?? sectionId,
        fields: [],
      });
    }
    const entry = sectionMap.get(sectionId)!;
    if (!entry.fields.includes(label)) {
      entry.fields.push(label);
    }
  }

  const missingBySection = Array.from(sectionMap.entries()).map(
    ([sectionId, { sectionName, fields }]) => ({
      sectionId,
      sectionName,
      fields,
    })
  );

  const sectionList = missingBySection
    .map((s) => `"${s.sectionName}" (${s.fields.join(", ")})`)
    .join("; ");
  const message = `Complete the following sections: ${sectionList}. Use "Back" to fix them.`;

  return {
    isValid: false,
    missingBySection,
    message,
  };
}

export function validateInspection(data: any): string[] {
  const result = getInspectionValidationResult(data as CreateInspectionForm);
  if (result.isValid) return [];
  return result.missingBySection.flatMap((s) =>
    s.fields.map((f) => `${s.sectionName}: ${f}`)
  );
}

export function numberOfNights(from: Date, to: Date) {
  const timeDiff = to.getTime() - from.getTime();
  const numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return numberOfNights;
}

export function isDate(value: any) {
  const timestamp = Date.parse(value);
  return !isNaN(timestamp);
}

export function formatProfileData(
  formData: FormData,
  data: Partial<IndividualAccountDetails>,
  key = "host"
) {
  formData.append(key, JSON.stringify(data.host));
  formData.append("profile", JSON.stringify(data.profile));
  return formData;
}

export function formatUserProfileData(
  formData: FormData,
  data: Partial<IndividualUserAccountDetails>,
  key = "host"
) {
  formData.append(key, JSON.stringify(data.user));
  formData.append("profile", JSON.stringify(data.profile));
  return formData;
}

export function formatDate(date: string) {
  const [month, day, year] = date.split("/");
  let m = month,
    d = day;
  if (+day < 10) {
    d = `0${day}`;
  }

  if (+month < 10) {
    m = `0${month}`;
  }
  const newDateFormat = `${year}-${m}-${d}`;
  return newDateFormat;
}

export function getNonFalsyKeys(values: { [key: string]: boolean }) {
  const keys = Object.keys(values);
  const results: string[] = [];
  keys.forEach((k) => {
    if (values[k]) {
      results.push(k);
    }
  });
  return results;
}

export const validateBasicPropertyDetailsSection = (
  values: Partial<CreateInspectionForm>
) => {
  const keys: { [key: string]: boolean } = {};
  if (!values.title) {
    keys["title"] = true;
  }
  if (!values.maxNumberOfPeople) {
    keys["maxNumberOfPeople"] = true;
  }
  if (!values.numberOfRooms) {
    keys["numberOfRooms"] = true;
  }
  if (!values.description) {
    keys["description"] = true;
  }
  return keys;
};

export const validateNumberOfPictures = (
  values: Partial<CreateInspectionForm>
) => {
  const keys: { [key: string]: boolean } = {};
  const files = (values.files as File[] | undefined) ?? [];
  if (files.length < 3) {
    keys["files"] = true;
  }
  return keys;
};

export const validateTypeOfProperty = (
  values: Partial<CreateInspectionForm>
) => {
  const keys: { [key: string]: boolean } = {};
  if (!values.typeOfProperty) {
    keys["typeOfProperty"] = true;
  }

  return keys;
};

export const validatePropertyLocationDetails = (
  values: Partial<CreateInspectionForm>
) => {
  const keys: { [key: string]: boolean } = {};
  if (!values.country) {
    keys["country"] = true;
  }
  if (!values.city) {
    keys["city"] = true;
  }
  if (!values.street) {
    keys["street"] = true;
  }

  if (!values.houseNumber) {
    keys["houseNumber"] = true;
  }

  if (!values.zip) {
    keys["zip"] = true;
  }

  return keys;
};

export const validateWhatIsNear = (values: Partial<CreateInspectionForm>) => {
  const keys: { [key: string]: boolean } = {};
  if (!values.nearbyPlaces?.length) {
    keys["nearbyPlaces"] = true;
  }

  return keys;
};

export const validateAmmenities = (values: Partial<CreateInspectionForm>) => {
  const keys: { [key: string]: boolean } = {};
  if (!values.ammenities?.length) {
    keys["ammenities"] = true;
  }

  return keys;
};

export const validateHouseRules = (values: Partial<CreateInspectionForm>) => {
  const keys: { [key: string]: boolean } = {};
  if (!values.houseRules?.length) {
    keys["houseRules"] = true;
  }
  if (!values.checkInAfter) {
    keys["checkInAfter"] = true;
  }

  if (!values.checkOutBefore) {
    keys["checkOutBefore"] = true;
  }

  return keys;
};

export const validatePrice = (values: Partial<CreateInspectionForm>) => {
  const keys: { [key: string]: boolean } = {};
  if (!values.price) {
    keys["price"] = true;
  }

  return keys;
};

export const validateContactInfo = (values: Partial<CreateInspectionForm>) => {
  const keys: { [key: string]: boolean } = {};
  if (!values.contactName) {
    keys["contactName"] = true;
  }
  if (!values.contactEmail) {
    keys["contactEmail"] = true;
  }
  if (!values.contactPhoneNumber) {
    keys["contactPhoneNumber"] = true;
  }

  return keys;
};

export const validateInspectionDateAndTime = (
  values: Partial<CreateInspectionForm>
) => {
  const keys: { [key: string]: boolean } = {};
  if (!values.inspectionDate) {
    keys["inspectionDate"] = true;
  }
  if (!values.inspectionTime) {
    keys["inspectionTime"] = true;
  }

  return keys;
};

export interface PanoramaFileEntry {
  id: string;
  label: string;
  file?: File;
  previewUrl: string;
}

export interface RoomFormEntry {
  id: string;
  name: string;
  photos: File[];
  bathroomType: "ensuite" | "shared";
  capacity: number;
  price: number;
}

export interface CreateInspectionForm {
  title: string;
  numberOfRooms: number;
  maxNumberOfPeople: number;
  description: string;
  files: File[];
  panoramaFiles: PanoramaFileEntry[];
  typeOfProperty: PropertyTypes;
  country: string;
  city: string;
  street: string;
  houseNumber: number;
  zip: string;
  nearbyPlaces: string[];
  ammenities: string[];
  houseRules: string[];
  checkInAfter: string;
  checkOutBefore: string;
  price: number;
  lat: string;
  lng: string;
  contactName: string;
  contactPhoneNumber: string;
  contactEmail: string;
  inspectionDate: Date | null;
  inspectionTime: string;
  cautionFee: number;
  rooms: RoomFormEntry[];
  sharedSpaceFiles: File[];
  monthlyPrice: number;
  minStayMonths: number;
  maxStayMonths: number;
  longStayDiscountPercent: number;
}

export interface CreateInspectionFormValidationType {
  title: boolean;
  numberOfRooms: boolean;
  maxNumberOfPeople: boolean;
  description: boolean;
  files: boolean;
  panoramaFiles: boolean;
  typeOfProperty: boolean;
  country: boolean;
  city: boolean;
  street: boolean;
  houseNumber: boolean;
  zip: boolean;
  nearbyPlaces: boolean;
  ammenities: boolean;
  houseRules: boolean;
  checkInAfter: boolean;
  checkOutBefore: boolean;
  price: boolean;
  lat: boolean;
  lng: boolean;
  contactName: boolean;
  contactPhoneNumber: boolean;
  contactEmail: boolean;
  inspectionDate: boolean;
  inspectionTime: boolean;
  cautionFee: boolean;
  rooms: boolean;
  sharedSpaceFiles: boolean;
}

export const defaultValues = {
  title: "",
  numberOfRooms: 0,
  maxNumberOfPeople: 0,
  description: "",
  files: [],
  panoramaFiles: [] as PanoramaFileEntry[],
  typeOfProperty: "" as PropertyTypes,
  lat: "",
  lng: "",
  country: "nigeria",
  city: "",
  street: "",
  houseNumber: 0,
  zip: "",
  nearbyPlaces: [],
  ammenities: [],
  houseRules: [],
  checkInAfter: "",
  checkOutBefore: "",
  price: 0,
  contactName: "",
  contactPhoneNumber: "",
  contactEmail: "",
  inspectionDate: null,
  inspectionTime: "",
  cautionFee: 0,
  rooms: [] as RoomFormEntry[],
  sharedSpaceFiles: [] as File[],
  monthlyPrice: 0,
  minStayMonths: 3,
  maxStayMonths: 6,
  longStayDiscountPercent: 5,
};

export const defaultValidationValues = {
  title: false,
  numberOfRooms: false,
  maxNumberOfPeople: false,
  description: false,
  files: false,
  panoramaFiles: false,
  typeOfProperty: false,
  lat: false,
  lng: false,
  country: false,
  city: false,
  street: false,
  houseNumber: false,
  zip: false,
  nearbyPlaces: false,
  ammenities: false,
  houseRules: false,
  checkInAfter: false,
  checkOutBefore: false,
  price: false,
  contactName: false,
  contactPhoneNumber: false,
  contactEmail: false,
  inspectionDate: false,
  inspectionTime: false,
  cautionFee: false,
  rooms: false,
  sharedSpaceFiles: false,
};
