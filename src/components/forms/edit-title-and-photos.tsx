"use client";

import { updateInspection, updateProperty } from "@/http/api";
import { useMutation } from "@tanstack/react-query";
import { Check, Trash2 } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useRef, useState, MouseEvent, FormEvent } from "react";
import Spinner from "../svgs/Spinner";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import PanoramaUpload, {
  PanoramaFile,
} from "@/components/property/panorama-upload";

export default ({
  photos,
  images,
  title,
  id,
  isInspection = false,
  hostId,
  existingPanoramas = [],
}: {
  id: string;
  title: string;
  images: string[];
  hostId: string;
  photos: string[];
  isInspection?: boolean;
  existingPanoramas?: { id: string; label: string; imageUrl: string }[];
}) => {
  const client = useQueryClient();

  const mutation = useMutation({
    mutationFn: isInspection ? updateInspection : updateProperty,
    onSuccess: async (data) => {
      if (isInspection) {
        await client.invalidateQueries({
          queryKey: ["single-inspection-host"],
        });
      } else {
        await client.invalidateQueries({
          queryKey: ["single-property-host"],
        });
      }
    },
    onError(Error) {
      toast("Update Property Error", {
        description: "Error occurred when updating title and photos",
        action: {
          label: "Ok",
          onClick: () => console.log("Ok"),
        },
      });
    },
  });

  const ref = useRef({} as any);
  const [state, setState] = useState<{
    title: string;
    files: File[];
    images: string[];
    photos: string[];
  }>(() => ({
    title,
    files: [],
    images,
    photos,
  }));

  const [panoramas, setPanoramas] = useState<PanoramaFile[]>(
    existingPanoramas.map((p) => ({
      id: p.id,
      label: p.label,
      previewUrl: p.imageUrl,
    }))
  );

  const morePhotos = state.files.map((file) => URL.createObjectURL(file));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleMorePhotos = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const list = files as FileList;
    const blobs: File[] = [];
    if (state.photos.length + list.length > 10) {
      toast("you cannot upload more than 10 images", {
        closeButton: true,
      });
      return;
    }
    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      blobs.push(file);
    }
    setState((prevState) => ({ ...prevState, files: blobs }));
  };

  const removeDBPhoto = (index: number) => (e: MouseEvent<HTMLSpanElement>) => {
    const filteredImages = state.images.filter((_, idx) => idx !== index);
    const filteredPhotos = state.photos.filter((_, idx) => idx !== index);
    setState((prevState) => ({
      ...prevState,
      images: filteredImages,
      photos: filteredPhotos,
    }));
  };

  const removeJustAddedPhoto =
    (index: number) => (e: MouseEvent<HTMLSpanElement>) => {
      const files = state.files.filter((_, idx) => idx !== index);

      setState((prevState) => ({
        ...prevState,
        files,
      }));
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", state.title);
    formData.append("id", id);
    formData.append("hostId", hostId);
    for (let i = 0; i < state.files.length; i++) {
      const element = state.files[i];
      formData.append("files", element);
    }
    formData.append("photos", JSON.stringify(state.photos));
    for (let i = 0; i < panoramas.length; i++) {
      const pano = panoramas[i];
      if (pano.file) {
        formData.append("panoramaFiles", pano.file);
        formData.append("panoramaLabels", pano.label);
      }
    }
    const existingPanoUrls = panoramas
      .filter((p) => !p.file)
      .map((p) => ({ id: p.id, label: p.label, imageUrl: p.previewUrl }));
    formData.append("existingPanoramas", JSON.stringify(existingPanoUrls));
    mutation.mutate(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full min-h-[100px] bg-white rounded-xl mb-10 px-3 space-y-4 pb-5 border-b-2 border-b-secondary mb-10"
    >
      <div className="w-full flex flex-col">
        <label htmlFor="title">Title</label>
        <input
          value={state.title}
          onChange={handleChange}
          type="text"
          id="title"
          name="title"
          className="w-full p-2 rounded-md border-2 border-black text-[16px]"
        />
      </div>
      <div className="w-full min-h-[100px]  grid grid-cols-2 grid-rows-1 sm:grid-rows-none  md:grid-cols-6 md:grid-cols-6 gap-4 mt-[20px]">
        {state.photos.map((photo: string, idx: number) => (
          <div
            key={idx}
            className={`w-full overflow-hidden group h-[100px] relative rounded-xl cursor-pointer ease duration-300 after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-black after:opacity-5 after:z-2 after:rounded-xl after:hidden hover:after:block`}
          >
            <span
              onClick={removeDBPhoto(idx)}
              className="absolute block top-2 right-2 z-[10] bg-black opacity-50 rounded-full p-2 hover:opacity-30"
            >
              <Trash2 size={17} color="white" className="z-[50]" />
            </span>
            <Image
              src={photo}
              alt="property listing"
              fill
              className="rounded-xl ease duration-300 group-hover:scale-[1.05]"
            />
          </div>
        ))}

        {morePhotos.map((photo: string, idx: number) => (
          <div
            key={idx}
            className={`w-full overflow-hidden group h-[100px] relative rounded-xl cursor-pointer ease duration-300 after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-black after:opacity-5 after:z-2 after:rounded-xl after:hidden hover:after:block`}
          >
            <span
              onClick={removeJustAddedPhoto(idx)}
              className="absolute block top-2 right-2 z-[10] bg-black opacity-50 rounded-full p-2 hover:opacity-30"
            >
              <Trash2 size={17} color="white" className="z-[50]" />
            </span>
            <Image
              src={photo}
              alt="property listing"
              fill
              className="rounded-xl ease duration-300 group-hover:scale-[1.05]"
            />
          </div>
        ))}
      </div>
      <div className="w-full flex items-center">
        <input
          onChange={handleMorePhotos}
          ref={ref}
          type="file"
          multiple
          className="hidden"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            ref.current.click();
          }}
          className="outline-none border-0 text-xs bg-secondary rounded-md text-black p-2 font-semibold"
        >
          add photos
        </button>
      </div>
      {/* 360° Virtual Tour Photos */}
      <div className="w-full mt-6 pt-6 border-t border-t-gray-200">
        <PanoramaUpload panoramas={panoramas} onChange={setPanoramas} />
      </div>

      <div className="w-full flex items-center justify-end mt-6">
        <button className="flex items-center justify-center font-semibold outline-none border-0 bg-black text-white py-2 px-4 rounded-md ease duration-300 hover:bg-slate-700">
          {mutation.isPending ? (
            <Spinner size={17} color="white" />
          ) : mutation.isSuccess ? (
            <Check size={17} color="white" />
          ) : (
            <span>Update</span>
          )}
        </button>
      </div>
    </form>
  );
};
