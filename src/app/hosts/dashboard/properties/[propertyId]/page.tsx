"use client";

import CheckinBeforeAndAfter from "@/components/forms/checkin-before-and-after";
import ContactInfo from "@/components/forms/contact-info";
import EditLivingInfo from "@/components/forms/edit-living-info";
import EditTitleAndPhotos from "@/components/forms/edit-title-and-photos";
import HouseRules from "@/components/forms/house-rules";
import PriceEditor from "@/components/forms/price-editor";
import PropertyAddress from "@/components/forms/property-address";
import WhatIsNearAndAmenities from "@/components/forms/what-is-near-and-amenities";
import Rating from "@/components/property/rating";
import LocationIcon from "@/components/svgs/LocationIcon";
import PersonsIcon from "@/components/svgs/PersonsIcon";
import PhoneIcon from "@/components/svgs/PhoneIcon";
import Spinner from "@/components/svgs/Spinner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ImageViewer from "@/components/ui/image-viewer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getPropertyById } from "@/http/api";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bed,
  CheckCircle,
  Clock,
  Edit,
  Mail,
  ShieldBan,
  View,
  XCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
const Map = dynamic(() => import("@/components/property/map"), { ssr: false });
const VirtualTourViewer = dynamic(
  () => import("@/components/property/virtual-tour-viewer"),
  { ssr: false }
);

export default ({
  params: { propertyId },
}: {
  params: { propertyId: string };
}) => {
  const [editPropertyFormState, setPropertyFormState] = useState<{
    titleAndPhotos: boolean;
    descriptionGuestsAndRooms: boolean;
    nearAndAmenities: boolean;
    houseRules: boolean;
    propertyAddress: boolean;
    contactInformation: boolean;
    editPrice: boolean;
    checkInBeforeAndOutAfter: boolean;
  }>({
    titleAndPhotos: false,
    descriptionGuestsAndRooms: false,
    nearAndAmenities: false,
    houseRules: false,
    checkInBeforeAndOutAfter: false,
    propertyAddress: false,
    contactInformation: false,
    editPrice: false,
  });

  const [showVirtualTour, setShowVirtualTour] = useState(false);

  const { data, error, isLoading } = useQuery({
    queryKey: ["single-property-host"],
    queryFn: () => {
      return getPropertyById(propertyId);
    },
  });

  const hostId = useSelector((state: RootState) => state.user.me?.host?.id);

  const images = data
    ? data.photos.map((photo: string, idx: number) => {
        return photo;
      })
    : [];

  if (isLoading)
    return (
      <div className="w-full flex flex-col items-center min-h-[88vh] py-10 bg-white px-5 md:px-5 lg:px-20">
        <div className="mt-10">
          <Spinner color="red" size={20} />
        </div>
      </div>
    );

  return (
    <div className="w-full flex flex-col min-h-[88vh] py-10 bg-white px-5 md:px-5 lg:px-20">
      <div className="w-full flex items-center ">
        <Link
          href="/hosts/dashboard/properties?tabState=properties"
          className="block group"
        >
          <div className="flex items-centet space-x-2 p-3 rounded-md  ease duration-300 group-hover:bg-gray-100">
            <ArrowLeft />
            <span className="ease duration-300 group-hover:font-semibold">
              Back to properties
            </span>
          </div>
        </Link>
      </div>
      <div className="w-full h-full flex flex-col">
        <div className="w-full flex items-center justify-end">
          {editPropertyFormState.titleAndPhotos ? (
            <span
              onClick={() => {
                setPropertyFormState((prevState) => ({
                  ...prevState,
                  titleAndPhotos: false,
                }));
              }}
              className="cursor-pointer ease duration-300 hover:translate-x-1"
            >
              <XCircle color="black" size={18} />
            </span>
          ) : (
            <button className="outline-none border-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    onClick={(e) => {
                      setPropertyFormState((prevState) => ({
                        ...prevState,
                        titleAndPhotos: !prevState?.titleAndPhotos,
                      }));
                    }}
                  >
                    <Edit className="block" size={20} />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black">
                    <p className="text-xs text-white">Edit Title and Photos</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </button>
          )}
        </div>
        {editPropertyFormState?.titleAndPhotos ? (
          <EditTitleAndPhotos
            isInspection={false}
            hostId={hostId}
            id={propertyId}
            title={data.title}
            images={data.photos}
            photos={images}
            existingPanoramas={data.panoramas ?? []}
          />
        ) : (
          <>
            <div className="w-full flex items-center">
              <div className="w-full flex items-center space-x-2">
                <h3 className="text-[20px] font-semibold">{data.title}</h3>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold">{data.numberOfRooms}</span>
                  <Bed size={20} color="gray" />
                </div>
              </div>
            </div>
            <div className="w-full flex items-center mt-2">
              <Rating />
              <p className="text-xs font-semibold capitalize truncate">
                {data.houseNumber}. {data.street} {data.zip} {data.city},
                {data.country}
              </p>
            </div>
            <Carousel className="w-full block mb-24 mt-5 sm:hidden">
              <CarouselContent>
                {data.photos.map((photo: string, idx: number) => {
                  return (
                    <CarouselItem key={idx}>
                      <ImageViewer images={images} url={photo}>
                        <div
                          className={`w-full overflow-hidden group h-[300px] md:h-[200px] relative rounded-xl cursor-pointer ease duration-300 after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-black after:opacity-5 after:z-2 after:rounded-xl after:hidden hover:after:block`}
                        >
                          <Image
                            src={photo}
                            alt="property image"
                            fill
                            className="rounded-xl ease duration-300 group-hover:scale-[1.05]"
                          />
                        </div>
                      </ImageViewer>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious
                color="#000"
                className="absolute top-[100%] mt-7 left-0 "
              />
              <CarouselNext
                color="#000"
                className="absolute top-[100%] mt-7 right-0 "
              />
            </Carousel>
            <div className="w-full min-h-[300px] mb-10 md:mb-0 hidden sm:grid grid-cols-1 grid-rows-1 sm:grid-auto-rows sm:grid-cols-2 md:grid-cols-4 md:grid-cols-4 gap-4 mt-[20px]">
              {data.photos.map((photo: string, idx: number) => {
                return (
                  <ImageViewer images={images} url={photo}>
                    <div
                      key={idx}
                      className={`w-full overflow-hidden group h-[300px] md:h-[200px] relative rounded-xl cursor-pointer ease duration-300 after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-black after:opacity-5 after:z-2 after:rounded-xl after:hidden hover:after:block`}
                    >
                      <Image
                        src={photo}
                        alt="property listing"
                        fill
                        className="rounded-xl ease duration-300 group-hover:scale-[1.05]"
                      />
                    </div>
                  </ImageViewer>
                );
              })}
            </div>
            {data?.panoramas?.length > 0 && (
              <div className="w-full mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowVirtualTour(true)}
                  className="px-4 py-2.5 rounded-full bg-black text-white text-sm font-semibold flex items-center gap-2 hover:bg-red-700 transition-colors"
                >
                  <View size={16} />
                  Preview 360° Tour
                </button>
                <span className="text-sm text-black/50">
                  {data.panoramas.length} room{data.panoramas.length > 1 ? "s" : ""} uploaded
                </span>
              </div>
            )}
          </>
        )}

        {showVirtualTour && data?.panoramas?.length > 0 && (
          <VirtualTourViewer
            panoramas={data.panoramas}
            onClose={() => setShowVirtualTour(false)}
            isFullscreen
          />
        )}
        <div className="w-full flex items-center justify-end">
          {editPropertyFormState.editPrice ? (
            <span
              onClick={() => {
                setPropertyFormState((prevState) => ({
                  ...prevState,
                  editPrice: false,
                }));
              }}
              className="cursor-pointer ease duration-300 hover:translate-x-1"
            >
              <XCircle color="black" size={18} />
            </span>
          ) : (
            <button className="outline-none border-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    onClick={(e) => {
                      setPropertyFormState((prevState) => ({
                        ...prevState,
                        editPrice: !prevState?.editPrice,
                      }));
                    }}
                  >
                    <Edit className="block" size={20} />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black">
                    <p className="text-xs text-white">Edit Price information</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </button>
          )}
        </div>
        {editPropertyFormState.editPrice ? (
          <PriceEditor
            id={propertyId}
            hostId={hostId}
            isInspection={false}
            price={data.price}
            cautionFee={data.cautionFee}
          />
        ) : (
          <>
            <h4 className="text-xl font-semibold underline">Price</h4>
            <div className="w-full flex items-center">
              <span className="font-semibold">₦</span>
              <span className="font-semibold text-lg">
                {(data.price as number).toLocaleString()}
                <span className="text-xs">/night</span>
              </span>
            </div>
          </>
        )}
        <div className="w-full flex items-center justify-end">
          {editPropertyFormState.contactInformation ? (
            <span
              onClick={() => {
                setPropertyFormState((prevState) => ({
                  ...prevState,
                  contactInformation: false,
                }));
              }}
              className="cursor-pointer ease duration-300 hover:translate-x-1"
            >
              <XCircle color="black" size={18} />
            </span>
          ) : (
            <button className="outline-none border-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    onClick={(e) => {
                      setPropertyFormState((prevState) => ({
                        ...prevState,
                        contactInformation: !prevState?.contactInformation,
                      }));
                    }}
                  >
                    <Edit className="block" size={20} />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black">
                    <p className="text-xs text-white">
                      Edit Contact information
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </button>
          )}
        </div>
        {editPropertyFormState.contactInformation ? (
          <ContactInfo
            isInspection={false}
            hostId={hostId}
            id={propertyId}
            contactEmail={data.contactEmail}
            contactName={data.contactName}
            contactPhoneNumber={data.contactPhoneNumber}
          />
        ) : (
          <div className="w-full flex flex-col space-y-2">
            <h4 className="text-xl font-semibold underline">
              Contact Information
            </h4>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">
                <PersonsIcon size={15} />
              </span>
              <span className="font-semibold">{data.contactName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">
                <Mail size={15} />
              </span>
              <span className="font-semibold">{data.contactEmail}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">
                <PhoneIcon size={15} />
              </span>
              <span className="font-semibold">{data.contactPhoneNumber}</span>
            </div>
          </div>
        )}
        <div className="w-full flex items-center justify-end">
          {editPropertyFormState.checkInBeforeAndOutAfter ? (
            <span
              onClick={() => {
                setPropertyFormState((prevState) => ({
                  ...prevState,
                  checkInBeforeAndOutAfter: false,
                }));
              }}
              className="cursor-pointer ease duration-300 hover:translate-x-1"
            >
              <XCircle color="black" size={18} />
            </span>
          ) : (
            <button className="outline-none border-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    onClick={(e) => {
                      setPropertyFormState((prevState) => ({
                        ...prevState,
                        checkInBeforeAndOutAfter:
                          !prevState?.checkInBeforeAndOutAfter,
                      }));
                    }}
                  >
                    <Edit className="block" size={20} />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black">
                    <p className="text-xs text-white">
                      Edit Checkin and Checkout information
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </button>
          )}
        </div>
        {editPropertyFormState.checkInBeforeAndOutAfter ? (
          <CheckinBeforeAndAfter
            id={propertyId}
            hostId={hostId}
            isInspection={false}
            checkInAfter={data.checkInAfter}
            checkOutBefore={data.checkOutBefore}
          />
        ) : (
          <div className="w-full flex flex-col">
            <h4 className="text-lg underline font-semibold mb-4">
              Check In And Out Information
            </h4>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Clock size={17} />
                <span className="font-inter font-semibold">
                  {data.checkInAfter}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={17} />
                <span className="font-inter font-semibold">
                  {data.checkOutBefore}
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="w-full flex items-center justify-end">
          {editPropertyFormState.descriptionGuestsAndRooms ? (
            <span
              onClick={() => {
                setPropertyFormState((prevState) => ({
                  ...prevState,
                  descriptionGuestsAndRooms: false,
                }));
              }}
              className="cursor-pointer ease duration-300 hover:translate-x-1"
            >
              <XCircle color="black" size={18} />
            </span>
          ) : (
            <button className="outline-none border-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    onClick={(e) => {
                      setPropertyFormState((prevState) => ({
                        ...prevState,
                        descriptionGuestsAndRooms:
                          !prevState?.descriptionGuestsAndRooms,
                      }));
                    }}
                  >
                    <Edit className="block" size={20} />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black">
                    <p className="text-xs text-white">
                      Edit description and living info
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </button>
          )}
        </div>
        {editPropertyFormState.descriptionGuestsAndRooms ? (
          <EditLivingInfo
            isInspection={false}
            hostId={hostId}
            id={propertyId}
            description={data.description}
            numberOfRooms={data.numberOfRooms}
            maxNumberOfPeople={data.maxNumberOfPeople}
          />
        ) : (
          <div className="w-full flex min-h-[300px] flex flex-col space-y-5 pb-5 mb-5 border-b-2 border-b-secondary">
            <article className="w-full h-full">
              <h4 className="text-[20px] font-semibold">{data.title}</h4>
              <p className="text-sm w-full leading-7">
                {data.description}
{/*                 Private large bedroom with double bed & dedicated workspace.
                Shared bathroom & kitchen (Air fryer, kettle, toaster, microwave
                & fridge/freezer) The room and kitchen are accessed by entering
                the main door of the house. The guest has keys to their own
                bedroom. Bedding and towels are supplied and changed regularly.
                Walking distance to public transport and tube station to Rayners
                lane & South Harrow. 5 minutes walk to Tesco, restaurant, local
                groceries & take away fish & chips. */}
              </p>
            </article>
            <div className="w-full items-center space-x-2">
              <span className="font-semibold">Number of rooms</span>
              <span>{data.numberOfRooms}</span>
            </div>
            <div className="w-full items-center space-x-2">
              <span className="font-semibold">
                Max. number of people allowed in your house
              </span>
              <span>{data.maxNumberOfPeople}</span>
            </div>
          </div>
        )}
        <div className="w-full flex items-center justify-end">
          {editPropertyFormState.nearAndAmenities ? (
            <span
              onClick={() => {
                setPropertyFormState((prevState) => ({
                  ...prevState,
                  nearAndAmenities: false,
                }));
              }}
              className="cursor-pointer ease duration-300 hover:translate-x-1"
            >
              <XCircle color="black" size={18} />
            </span>
          ) : (
            <button className="outline-none border-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    onClick={(e) => {
                      setPropertyFormState((prevState) => ({
                        ...prevState,
                        nearAndAmenities: !prevState?.nearAndAmenities,
                      }));
                    }}
                  >
                    <Edit className="block" size={20} />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black">
                    <p className="text-xs text-white">
                      Edit nearby places and amenities
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </button>
          )}
        </div>
        {editPropertyFormState.nearAndAmenities ? (
          <WhatIsNearAndAmenities
            id={propertyId}
            nearbyPlaces={data.nearbyPlaces}
            amenities={data.ammenities}
            isInspection={false}
            hostId={hostId}
          />
        ) : (
          <>
            <div className="w-full min-h-[100px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-y-2 mt-10 lg:w-1/2">
              <div className="col-span-2 md:col-span-3">
                <h4 className="text-[20px] font-semibold">What is near</h4>
              </div>
              {data.nearbyPlaces.map((place: string, idx: number) => (
                <div key={idx} className="flex items-center space-x-2">
                  <CheckCircle size={14} />
                  <span className="capitalize font-[500]">{place}</span>
                </div>
              ))}
            </div>
            <div className="w-full my-10 pb-10 border-b-2 border-b-secondary">
              <div className="w-full min-h-[100px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-4 lg:gap-y-3 gap-3">
                <div className="col-span-2 md:col-span-3 lg:col-span-5 ">
                  <h4 className="text-[20px] font-semibold">
                    Available Amenities
                  </h4>
                </div>
                {data.ammenities.map((ammenity: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 py-1 px-4 rounded-md bg-white shadow-md"
                  >
                    <CheckCircle size={14} color="green" strokeWidth={3} />
                    <span className="capitalize font-[500]">{ammenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        <div className="w-full flex items-center justify-end">
          {editPropertyFormState.houseRules ? (
            <span
              onClick={() => {
                setPropertyFormState((prevState) => ({
                  ...prevState,
                  houseRules: false,
                }));
              }}
              className="cursor-pointer ease duration-300 hover:translate-x-1"
            >
              <XCircle color="black" size={18} />
            </span>
          ) : (
            <button className="outline-none border-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    onClick={(e) => {
                      setPropertyFormState((prevState) => ({
                        ...prevState,
                        houseRules: !prevState?.houseRules,
                      }));
                    }}
                  >
                    <Edit className="block" size={20} />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black">
                    <p className="text-xs text-white">Edit house rules</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </button>
          )}
        </div>
        {editPropertyFormState.houseRules ? (
          <HouseRules
            id={propertyId}
            houseRules={data.houseRules}
            isInspection={false}
            hostId={hostId}
          />
        ) : (
          <div className="w-full  pb-10 border-b-2 border-b-secondary mb-5">
            <div className="w-full min-h-[100px] grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <div className="col-span-2 md:col-span-3 lg:col-span-4 space-y-5 text-[14px[">
                <h4 className="text-[20px] font-semibold">House Rules</h4>
                <p className="text-xs md:text-sm truncate w-full">
                  You'll be staying in someone's home, so please treat it with
                  care and respect.
                </p>
              </div>
              {data.houseRules.map((rule: string, idx: number) => (
                <div key={idx} className="flex items-center space-x-2">
                  <ShieldBan size={14} />
                  <span className="capitalize text-[14px] ">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="w-full flex items-center justify-end">
          {editPropertyFormState.propertyAddress ? (
            <span
              onClick={() => {
                setPropertyFormState((prevState) => ({
                  ...prevState,
                  propertyAddress: false,
                }));
              }}
              className="cursor-pointer ease duration-300 hover:translate-x-1"
            >
              <XCircle color="black" size={18} />
            </span>
          ) : (
            <button className="outline-none border-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    onClick={(e) => {
                      setPropertyFormState((prevState) => ({
                        ...prevState,
                        propertyAddress: !prevState?.propertyAddress,
                      }));
                    }}
                  >
                    <Edit className="block" size={20} />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black">
                    <p className="text-xs text-white">Edit property address</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </button>
          )}
        </div>
        <div className="w-full flex flex-col py-4 mt-2 space-y-2 border-b-2 border-b-secondary">
          {editPropertyFormState.propertyAddress ? (
            <PropertyAddress
              houseNumber={data.houseNumber}
              city={data.city}
              street={data.street}
              zip={data.zip}
              id={propertyId}
              isInspection={false}
              hostId={hostId}
              lat={data.lat}
              lng={data.lng}
            />
          ) : (
            <>
              <div className="flex items-center space-x-1">
                <LocationIcon size={15} />
                <p className="text-sm font-semibold capitalize">
                  {data.houseNumber}. {data.street} {data.zip} {data.city},
                  {data.country}
                </p>
              </div>
              <div className="w-full h-full md:h-[450px]">
                <Map positions={[Number(data.lat), Number(data.lng)]} />
              </div>
            </>
          )}
        </div>
        <div className="w-full flex flex-col py-4 mt-2 space-y-2 border-b-2 border-b-secondary">
          <h4 className="text-[20px] font-semibold">Cancellation Policy</h4>
          <p>Free cancellations up until 48hrs before booking date</p>
          <p>
            Reviews the Host's full{" "}
            <Link
              href="/terms-of-use#refund-policy"
              className="font-bold underline"
            >
              Cancellation Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
