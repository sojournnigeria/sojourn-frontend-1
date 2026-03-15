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
import { Eye, EyeOff } from "lucide-react";

type LoginFormFields = z.infer<typeof LoginSchema>;
type SignupFormFields = z.infer<typeof SignupSchema>;

export default function LoginSignupModal() {
  const client = useQueryClient();

  /** Login modal state */
  const [loginOpen, setLoginOpen] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  /** Signup modal state */
  const [signupOpen, setSignupOpen] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [user, setUser] = useState({ access_token: "" });
  const [profile, setProfile] = useState({
    email: "",
    family_name: "",
    given_name: "",
    verified_email: false,
  });

  const { params } = useQueryString();
  const refererId = params.get("ref") ?? "";

  /** Google login/signup */
  const loginGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => setUser(tokenResponse),
    onError: () =>
      toast("Login Message", {
        description: "Could not login at this time. Please try again.",
      }),
  });

  const signupGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => setUser(tokenResponse),
    onError: () =>
      toast("Signup Message", {
        description: "Could not signup at this time. Please try again.",
      }),
  });

  /** Login form */
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: loginSubmitting },
  } = useForm<LoginFormFields>({ resolver: zodResolver(LoginSchema) });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      if (data?.path === "host") location.href = "/hosts/dashboard/properties";
      else {
        await client.invalidateQueries({ queryKey: ["me"] });
        setLoginOpen(false);
      }
    },
  });

  const loginPending = loginMutation.isPending || loginSubmitting;
  const loginFails = !loginMutation.isSuccess || loginMutation.isError;

  async function onLogin(data: LoginFormFields) {
    loginMutation.mutate(data);
  }

  /** Signup form */
  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors, isSubmitting: signupSubmitting },
    getValues,
  } = useForm<SignupFormFields & { isEmailVerified?: boolean; isGoogle?: boolean }>({
    resolver: zodResolver(SignupSchema),
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: () =>
      (location.href = `/account-created?email=${profile.email || getValues("email")}`),
  });

  const signupPending = signupMutation.isPending || signupSubmitting;
  const signupFails = !signupMutation.isSuccess || signupMutation.isError;

  function onSignup(data: SignupFormFields & { isEmailVerified?: boolean; isGoogle?: boolean }) {
    if (!data.firstName || !data.lastName || (!data.password && !data.isGoogle)) return;
    signupMutation.mutate({ ...data, ...(refererId && { refererId }) });
  }

  /** Fetch Google user */
  useEffect(() => {
    if (!user.access_token) return;
    const fetchGoogleUser = async () => {
      const data = await getGoogleUser(user.access_token);
      setProfile(data);
    };
    fetchGoogleUser();
  }, [user]);

  useEffect(() => {
    if (profile.email) {
      onSignup({
        email: profile.email,
        firstName: profile.given_name,
        lastName: profile.family_name,
        password: "",
        isEmailVerified: profile.verified_email,
        isGoogle: true,
      });
    }
  }, [profile]);

  return (
    <div className="flex gap-4">
      {/* Login */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogTrigger>
          <button className="py-2 px-4 font-bold text-white rounded-full hover:bg-white/10 transition">
            Login
          </button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              Welcome to <span className="text-primary">Sojourn</span>
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4 px-4 pb-4">
            <input
              {...registerLogin("email")}
              type="email"
              placeholder="Email"
              className="w-full border-b border-b-secondary px-2 py-3 outline-none text-[16px]"
            />
            <div className="relative">
              <input
                {...registerLogin("password")}
                type={showLoginPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border-b border-b-secondary px-2 py-3 outline-none text-[16px] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="my-3 px-2 text-[14px]">
              Forgot your password?
              <Link
                onClick={() => setLoginOpen(false)}
                className="text-primary font-semibold ml-1"
                href="/reset-password"
              >
                Reset
              </Link>
            </p>
            <button className="w-full p-3 bg-primary text-white rounded-full font-bold hover:bg-red-800 transition">
              {loginPending ? <Spinner /> : loginFails ? "Login" : <Spinner />}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                loginGoogle()
              }}
              className="relative w-full p-3 bg-white text-black rounded-full font-bold hover:bg-red-50 transition"
            >
              <Image
                src="/assets/icons/google.svg"
                alt="google icon"
                width={18}
                height={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
              />
              <span>Continue with Google</span>
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Signup */}
      <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
        <DialogTrigger>
          <button className="py-2 px-4 font-bold text-white rounded-full hover:bg-white/10 transition">
            Signup
          </button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              Join <span className="text-primary">Sojourn</span>
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSignupSubmit(onSignup)} className="space-y-4 px-4 pb-4">
            <input
              {...registerSignup("email")}
              placeholder="Email"
              className="w-full border-b border-b-secondary px-2 py-3 outline-none text-[16px]"
            />
            <input
              {...registerSignup("firstName")}
              placeholder="First Name"
              className="w-full border-b border-b-secondary px-2 py-3 outline-none text-[16px]"
            />
            <input
              {...registerSignup("lastName")}
              placeholder="Last Name"
              className="w-full border-b border-b-secondary px-2 py-3 outline-none text-[16px]"
            />
            <div className="relative">
              <input
                {...registerSignup("password")}
                type={showSignupPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border-b border-b-secondary px-2 py-3 outline-none text-[16px] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowSignupPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button className="w-full p-3 bg-primary text-white rounded-full font-bold hover:bg-red-800 transition">
              {signupPending ? <Spinner /> : signupFails ? "Signup" : <Spinner />}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                signupGoogle()
              }}
              className="relative w-full p-3 bg-white text-black rounded-full font-bold hover:bg-red-50 transition"
            >
              <Image
                src="/assets/icons/google.svg"
                alt="google icon"
                width={18}
                height={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
              />
              <span>Continue with Google</span>
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}