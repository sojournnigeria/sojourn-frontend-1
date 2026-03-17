"use client";

import { LoginSchema, SignupSchema } from "@/schema/users.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Image from "next/image";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getGoogleUser, login, loginWithGoogle, signup } from "@/http/api";
import Spinner from "../svgs/Spinner";
import { useEffect, useState } from "react";
import useQueryString from "@/hooks/useQueryString";
import Link from "next/link";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

type FormFields = z.infer<typeof LoginSchema>;
type SingupFormFields = z.infer<typeof SignupSchema>;
export default () => {
  const client = useQueryClient();

  const [user, setUser] = useState({ access_token: "" });
  const [profile, setProfile] = useState({
    email: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const loginGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setUser(tokenResponse);
    },
    onError: (error) => {
      toast("Login Message", {
        description: "Could not login at this time. Please try again.",
        action: {
          label: "close",
          onClick: () => null,
        },
      });
    },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      if (data && data.path === "host") {
        location.href = "/hosts/dashboard/properties";
      } else {
        await client.invalidateQueries({ queryKey: ["me"] });
        setOpen(false);
      }
    },
  });

  const googleMutation = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: async (data) => {
      await new Promise((res) => setTimeout(res, 4000));
      await client.invalidateQueries({ queryKey: ["me"] });
      setOpen(false);
    },
  });

  const [open, setOpen] = useState(false);

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<FormFields>({ resolver: zodResolver(LoginSchema) });

  const whenLoginIsPending = mutation.isPending || isSubmitting;

  const whenLoginFails = !mutation.isSuccess || mutation.isError;

  async function guestLogin(data: FormFields) {
    mutation.mutate(data);
  }

  useEffect(() => {
    const fetchGoogleUser = async () => {
      if (user.access_token) {
        const data = await getGoogleUser(user.access_token);
        setProfile(data);
      }
    };
    fetchGoogleUser();
  }, [user]);

  // useEffect(() => {
  //   const fetchGoogleUser = async () => {
  //     if (!user.access_token) return;

  //     try {
  //       const response = await axios.post(
  //         "https://sojourn-backend-api-xk5x.onrender.com/api/v1/google/userinfo",
  //         { access_token: user.access_token },
  //         {
  //           withCredentials: true,
  //           headers: { "Content-Type": "application/json" },
  //         }
  //       );

  //       // ✅ this must be response.data
  //       setProfile(response.data);
  //     } catch (err: any) {
  //       console.error("Proxy request failed:", err);
  //       toast("Could not fetch Google profile. Check console for details.");
  //     }
  //   };

  //   fetchGoogleUser();
  // }, [user.access_token]);

  useEffect(() => {
    const googleSignin = async () => {
      if (profile.email) {
        googleMutation.mutate(profile.email);
      }
    };
    googleSignin();
  }, [profile]);

  return (
    <div className="w-[150px] hidden justify-between lg:flex">
      <Dialog
        open={open}
        onOpenChange={(state: boolean) => {
          setOpen(state);
        }}
      >
        <DialogTrigger>
          <div
            role="button"
            className="py-3 px-4 font-[700] rounded-full text-white whitespace-nowrap transition duration-300 hover:bg-transparent"
          >
            Login 
          </div>
        </DialogTrigger>
        <DialogContent className="w-auto min-h-[50px]">
          {googleMutation.isPending ? (
            <div className="w-full flex items-center justify-center">
              <Spinner size={35} color="red" />
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-center">
                  Welcome to <span className="text-primary">Sojourn</span>
                </DialogTitle>
              </DialogHeader>
              <form
                autoComplete="off"
                className="w-full min-h-[250px] overflow-y-auto space-y-2 pb-10 px-5"
                onSubmit={handleSubmit(guestLogin)}
              >
                {mutation.isError && (
                  <span className="text-primary font-semibold">
                    {mutation.error.message}
                  </span>
                )}
                {errors.email && (
                  <span className="text-primary font-semibold">
                    {errors.email.message}
                  </span>
                )}
                <input
                  {...register("email")}
                  type="email"
                  className="w-full py-3 px-2 my-3 outline-none border-b border-b-secondary placeholder:text-gray-400 text-[16px]"
                  placeholder="Email address"
                />
                {/* <input
                  {...register("password")}
                  type="password"
                  className="w-full py-3 px-2 my-3 outline-none border-b border-b-secondary placeholder:text-gray-400 text-[16px]"
                  placeholder="Password"
                /> */}
                <div className="relative">
  <input
    {...register("password")}
    type={showPassword ? "text" : "password"}
    className="w-full py-3 px-2 my-3 outline-none border-b border-b-secondary placeholder:text-gray-400 text-[16px]"
    placeholder="Password"
  />
  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition active:scale-90"
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>
                <p className="my-3 px-2 text-[14px]">
                  Forgot your password?
                  <Link
                    onClick={() => {
                      setOpen(false);
                    }}
                    className="text-primary font-semibold ml-1"
                    href="/reset-password"
                  >
                    Reset
                  </Link>
                </p>
                <button className="border-0 outline-none rounded-full flex items-center justify-center w-full p-4 bg-primary text-white font-bold ease duration-300 hover:bg-red-800">
                  {whenLoginIsPending ? (
                    <Spinner />
                  ) : whenLoginFails ? (
                    <span>Login</span>
                  ) : (
                    <Spinner />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    loginGoogle();
                  }}
                  className="border relative border-black outline-none rounded-full w-full p-4 bg-white text-black font-bold ease duration-300 hover:bg-red-50"
                >
                  <Image
                    src="/assets/icons/google.svg"
                    alt="google icon"
                    width={17.64}
                    className="absolute left-5 top-50 -translate-1/2"
                    height={18}
                  />
                  <span>Continue with Google</span>
                </button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
      <SingupModal />
    </div>
  );
};

function SingupModal() {
  const { router } = useQueryString();

  const { params } = useQueryString();

  const [user, setUser] = useState({ access_token: "" });
  const [profile, setProfile] = useState({
    email: "",
    family_name: "",
    given_name: "",
    verified_email: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const signupGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setUser(tokenResponse);
    },
    onError: (error) => {
      toast("Signup Message", {
        description: "Could not signup at this time. Please try again.",
        closeButton: true,
      });
    },
  });

  const refererId = params.get("ref") ? params.get("ref") : "";

  const {
    register: registerSigup,
    formState: { errors: errorsSignup, isSubmitting: isSubmittingSignup },
    handleSubmit: handleSubmitSignup,
    getValues,
  } = useForm<
    SingupFormFields & { isEmailVerfied?: boolean; isGoogle?: boolean }
  >({ resolver: zodResolver(SignupSchema) });

  //mutations
  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      location.href = `/account-created?email=${
        profile.email || getValues("email")
      }`;
    },
  });

  const whenSignupIsPending = signupMutation.isPending || isSubmittingSignup;

  const whenSignupFails = !signupMutation.isSuccess || signupMutation.isError;

  function guestSignup(
    data: SingupFormFields & { isEmailVerfied?: boolean; isGoogle?: boolean }
  ) {
    if (!data.firstName || !data.lastName || (!data.password && !data.isGoogle))
      return;
    signupMutation.mutate({ ...data, ...(refererId && { refererId }) });
  }

  useEffect(() => {
    const fetchGoogleUser = async () => {
      if (user.access_token) {
        const data = await getGoogleUser(user.access_token);
        setProfile(data);
      }
    };
    fetchGoogleUser();
  }, [user]);

  // useEffect(() => {
  //   const fetchGoogleUser = async () => {
  //     if (!user.access_token) return;

  //     try {
  //       const response = await axios.post(
  //         "https://sojourn-backend-api-xk5x.onrender.com/api/v1/google/userinfo",
  //         { access_token: user.access_token },
  //         {
  //           withCredentials: true,
  //           headers: { "Content-Type": "application/json" },
  //         }
  //       );

  //       // ✅ this must be response.data
  //       setProfile(response.data);
  //     } catch (err: any) {
  //       console.error("Proxy request failed:", err);
  //       toast("Could not fetch Google profile. Check console for details.");
  //     }
  //   };

  //   fetchGoogleUser();
  // }, [user.access_token]);

  useEffect(() => {
    const gooleSingup = async () => {
      if (profile.email) {
        const fields = {
          email: profile.email,
          firstName: profile.given_name,
          lastName: profile.family_name,
          password: "",
          isEmailVerified: profile.verified_email,
          isGoogle: true,
        };
        guestSignup(fields);
      }
    };
    gooleSingup();
  }, [profile]);

  return (
    <Dialog>
      <DialogTrigger>
        <div
          role="button"
          className="py-3 px-4 font-[700] rounded-full whitespace-nowrap text-white transition duration-300 hover:bg-transparent"
        >
          Signup
        </div>
      </DialogTrigger>
      <DialogContent className="w-auto min-h-[50px]">
        {(signupMutation.isPending || signupMutation.isSuccess) &&
        !getValues("password") ? (
          <div className="w-full flex items-center justify-center">
            <Spinner size={35} color="red" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">
                Welcome to <span className="text-primary">Sojourn</span>
              </DialogTitle>
            </DialogHeader>
            <form
              autoComplete="off"
              onSubmit={handleSubmitSignup(guestSignup)}
              className="w-full min-h-[250px] overflow-y-auto space-y-2 pb-10 px-5"
            >
              {signupMutation.isError && (
                <span className="text-primary font-semibold">
                  {signupMutation.error.message}
                </span>
              )}
              {errorsSignup.email && (
                <span className="text-primary font-semibold">
                  {errorsSignup.email.message}
                </span>
              )}
              <input
                {...registerSigup("email")}
                className="w-full py-3 px-2 my-3 outline-none border-b border-b-secondary placeholder:text-gray-400 text-[16px]"
                placeholder="Email address"
              />
              {errorsSignup.firstName && (
                <span className="text-primary font-semibold">
                  {errorsSignup.firstName.message}
                </span>
              )}

              <input
                {...registerSigup("firstName", {
                  required: "First name is required",
                })}
                className="w-full py-3 px-2 my-3 outline-none border-b border-b-secondary placeholder:text-gray-400 text-[16px]"
                placeholder="First name"
              />
              {errorsSignup.lastName && (
                <span className="text-primary font-semibold">
                  {errorsSignup.lastName.message}
                </span>
              )}
              <input
                {...registerSigup("lastName", {
                  required: "Last name is required",
                })}
                className="w-full py-3 px-2 my-3 outline-none border-b border-b-secondary placeholder:text-gray-400 text-[16px]"
                placeholder="Last name"
              />
              {errorsSignup.password && (
                <span className="text-primary font-semibold">
                  {errorsSignup.password.message}
                </span>
              )}
             <div className="relative">
  <input
    {...registerSigup("password")}
    type={showPassword ? "text" : "password"}
    className="w-full py-3 px-2 my-3 outline-none border-b border-b-secondary placeholder:text-gray-400 text-[16px]"
    placeholder="Password"
  />
  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition active:scale-90"
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>
              <button className="border-0 outline-none rounded-full flex items-center justify-center w-full p-4 bg-primary text-white font-bold ease duration-300 hover:bg-red-800">
                {whenSignupIsPending ? (
                  <Spinner />
                ) : whenSignupFails ? (
                  <span>Signup</span>
                ) : (
                  <Spinner />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  signupGoogle();
                }}
                className="border relative border-black outline-none rounded-full w-full p-4 bg-white text-black font-bold ease duration-300 hover:bg-red-50"
              >
                <Image
                  src="/assets/icons/google.svg"
                  alt="google icon"
                  width={17.64}
                  className="absolute left-5 top-50 -translate-1/2"
                  height={18}
                />
                <span>Continue with Google</span>
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}


