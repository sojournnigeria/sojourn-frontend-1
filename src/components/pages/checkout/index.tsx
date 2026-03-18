"use client";

import CheckoutCalculator from "@/components/property/checkout-calculator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getPropertyById,
  pay,
  login,
  loginWithGoogle,
  getGoogleUser,
} from "@/http/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Wallet,
  Shield,
  CalendarCheck,
  CreditCard,
  Search,
  Home,
  Check,
} from "lucide-react";
import Link from "next/link";
import { MouseEvent, useEffect, useRef, useState } from "react";
import PaystackPop from "@paystack/inline-js";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import useQueryString from "@/hooks/useQueryString";
import { toast } from "sonner";
import { PaymentDataType } from "@/types/payments";
import useCurrency from "@/hooks/useCurrency";
import CryptoCheckout from "@/components/pages/checkout/crypto-checkout";
import Spinner from "@/components/svgs/Spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schema/users.schema";
import { z } from "zod";
import Image from "next/image";
import { useGoogleLogin } from "@react-oauth/google";
import { isGoogleAuthEnabled } from "@/lib/google-auth";

function CheckoutGoogleButton({
  onToken,
}: {
  onToken: (token: { access_token: string }) => void;
}) {
  const gLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => onToken(tokenResponse),
    onError: () =>
      toast("Google Login Failed", {
        description: "Could not login with Google. Please try again.",
      }),
  });
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        gLogin();
      }}
      className="border relative border-gray-300 outline-none rounded-xl w-full p-3.5 bg-white text-black font-semibold ease duration-300 hover:bg-gray-50 hover:border-gray-400"
    >
      <Image
        src="/assets/icons/google.svg"
        alt="google icon"
        width={17.64}
        className="absolute left-5 top-1/2 -translate-y-1/2"
        height={18}
      />
      <span>Continue with Google</span>
    </button>
  );
}

export default ({ id }: { id: string }) => {
  const [paymentMethod, setPaymentMethod] = useState<
    "Paystack" | "Crypto (USDTRC20)"
  >("Paystack");

  const [open, setOpen] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [googleUser, setGoogleUser] = useState({ access_token: "" });
  const [googleProfile, setGoogleProfile] = useState({ email: "" });

  const pendingPayment = useRef(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["single-property-checkout"],
    queryFn: () => {
      return getPropertyById(id);
    },
  });

  const userId = useSelector((state: RootState) => state.user?.me?.id);
  const isLoggedIn = useSelector((state: RootState) => state?.user?.loggedIn);

  const { params } = useQueryString();

  const title = data ? data.title : "";
  const address = data ? `${data.zip}, ${data.city}` : "";

  const tomorrow = new Date(Date.now() + 86400000);
  const dayAfterTomorrow = new Date(Date.now() + 86400000 * 2);

  const adults = params.get("number-of-adults")
    ? Number(params.get("number-of-adults"))
    : 1;
  const children = params.get("number-of-children")
    ? Number(params.get("number-of-children"))
    : 0;
  const infants = params.get("number-of-infants")
    ? Number(params.get("number-of-infants"))
    : 0;

  const normalizeDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const checkInDate = params.get("check-in")
    ? normalizeDate(params.get("check-in") as string)
    : tomorrow;

  const checkOutDate = params.get("check-out")
    ? normalizeDate(params.get("check-out") as string)
    : dayAfterTomorrow;
  const credits = params.get("credits") ? Number(params.get("credits")) : 0;
  const discountCode = params.get("discount-code")
    ? params.get("discount-code")
    : "";
  function onPaymentSuccess(parameters: {
    id: number;
    reference: string;
    message: string;
  }) {
    router.push("/dashboard/bookings");
  }

  const mutation = useMutation({
    mutationKey: ["pay-listing-fee"],
    mutationFn: pay,
    onSuccess(data) {
      if (!window) {
        return;
      } else {
        const paystackPopup = new PaystackPop();
        paystackPopup.newTransaction({
          accessCode: data.paystackAccessCode,
          onSuccess: onPaymentSuccess,
        });
      }
    },
    onError(error: Error) {
      toast("Error completing payment.", {
        description: "Payment error.",
        action: {
          label: "Ok",
          onClick: () => undefined,
        },
      });
    },
  });

  const validCheckInDate = checkInDate ? new Date(checkInDate) : tomorrow;
  const validCheckOutDate = checkOutDate
    ? new Date(checkOutDate)
    : dayAfterTomorrow;

  type LoginFormFields = z.infer<typeof LoginSchema>;

  const {
    register: registerLogin,
    formState: { errors: loginErrors },
    handleSubmit: handleLoginSubmit,
  } = useForm<LoginFormFields>({ resolver: zodResolver(LoginSchema) });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data && data.path === "host") {
        window.location.href = "/hosts/dashboard/properties";
        return;
      }
      pendingPayment.current = true;
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setShowLoginModal(false);
      toast("Successfully logged in");
    },
    onError: (error) => {
      toast("Login Failed", {
        description: error.message || "Could not login. Please try again.",
      });
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: () => {
      pendingPayment.current = true;
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setShowLoginModal(false);
      toast("Successfully logged in");
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (googleUser.access_token) {
        const data = await getGoogleUser(googleUser.access_token);
        setGoogleProfile(data);
      }
    };
    fetchProfile();
  }, [googleUser]);

  useEffect(() => {
    if (googleProfile.email) {
      googleLoginMutation.mutate(googleProfile.email);
    }
  }, [googleProfile]);

  useEffect(() => {
    if (isLoggedIn && pendingPayment.current) {
      pendingPayment.current = false;
      window.location.reload();
    }
  }, [isLoggedIn]);

  function executePayment() {
    const payload: PaymentDataType = {
      propertyId: id,
      userId,
      checkInDate: validCheckInDate,
      checkOutDate: validCheckOutDate,
      numberOfAdults: adults,
      numberOfChildren: children,
      numberOfInfants: infants,
      ...(credits > 0 && { credits: credits }),
      ...(discountCode && { discountCode: discountCode }),
    };
    mutation.mutate(payload);
  }

  function makePayment(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    executePayment();
  }

  const { exchangeRate } = useCurrency();

  const currency = useSelector((state: RootState) => state.currency.currency);

  const symbol = currency === "NGN" ? "₦" : "$";

  const price = data ? data.price : 0;

  const photoUrl = data ? data.photos[0] : "";
  const firstImageUrl = photoUrl;

  const cautionFee = data
    ? symbol === "$" && data?.cautionFee
      ? +data?.cautionFee / exchangeRate
      : data?.cautionFee
    : 0;

  const me = useSelector((state: RootState) => state.user?.me);
  const profile = useSelector((state: RootState) => state.user?.me?.user);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors group"
            >
              <ChevronLeft
                size={20}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
              <span className="text-sm font-medium">Back to property</span>
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-xl">
              {[
                { label: "Search", icon: Search },
                { label: "Property", icon: Home },
                { label: "Review", icon: CalendarCheck },
                { label: "Payment", icon: CreditCard },
              ].map((step, idx, arr) => {
                const isLast = idx === arr.length - 1;
                const isCompleted = !isLast;
                return (
                  <div key={step.label} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                          isLast
                            ? "bg-primary text-white shadow-lg shadow-primary/30 ring-4 ring-primary/10"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {isCompleted ? (
                          <Check size={18} strokeWidth={3} />
                        ) : (
                          <step.icon size={18} />
                        )}
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs mt-1.5 font-medium ${
                          isLast ? "text-primary" : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {!isLast && (
                      <div className="flex-1 mx-2 sm:mx-3 mb-5">
                        <div className="h-[3px] rounded-full bg-primary/20 overflow-hidden">
                          <div className="h-full w-full bg-primary rounded-full" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Page heading */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Confirm and pay
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Review your booking details and complete payment
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left column — booking details */}
            <div className="lg:col-span-3 space-y-6">
              {/* Guest details card */}
              {isLoggedIn ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <CalendarCheck size={18} className="text-primary" />
                      Booking Details
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="min-w-0">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          First Name
                        </label>
                        <p className="mt-1 text-gray-900 font-medium truncate">
                          {me?.firstName || "—"}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Name
                        </label>
                        <p className="mt-1 text-gray-900 font-medium truncate">
                          {me?.lastName || "—"}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </label>
                        <p className="mt-1 text-gray-900 font-medium truncate">
                          {profile?.profile?.primaryPhoneNumber || "—"}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </label>
                        <p className="mt-1 text-gray-900 font-medium truncate">
                          {profile?.email || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="relative rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(220,38,38,0.25)] bg-cover bg-center"
                  style={{
                    backgroundImage: "url('/assets/imgs/discover-bg.png')",
                  }}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10 p-6 sm:p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Shield size={22} className="text-white drop-shadow-md" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                          Sign in to complete your booking
                        </h3>
                        <p className="text-white/80 text-sm mt-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] leading-relaxed">
                          Review the booking details below. You&apos;ll be
                          asked to sign in when you&apos;re ready to make
                          payment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment method card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard size={18} className="text-primary" />
                    Payment Method
                  </h3>
                </div>
                <div className="p-6">
                  <DropdownMenu
                    open={open}
                    onOpenChange={(state) => setOpen(state)}
                  >
                    <DropdownMenuTrigger className="w-full py-4 px-4 text-sm border border-gray-200 outline-none rounded-xl capitalize flex items-center justify-between hover:border-gray-300 transition-colors bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Wallet size={18} className="text-primary" />
                        </div>
                        <span className="font-medium text-gray-900">
                          {paymentMethod}
                        </span>
                      </div>
                      {open ? (
                        <ChevronUp size={18} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-400" />
                      )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full md:w-[500px]">
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="py-3.5 text-sm cursor-pointer"
                        onClick={() => setPaymentMethod("Paystack")}
                      >
                        Paystack
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="py-3.5 text-sm cursor-pointer"
                        onClick={() =>
                          setPaymentMethod("Crypto (USDTRC20)")
                        }
                      >
                        Crypto (USDTRC20)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Policies card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Shield size={18} className="text-primary" />
                    Policies & Terms
                  </h3>
                </div>
                <div className="p-6 space-y-5">
                  <div className="flex items-start gap-3 p-4 bg-blue-50/60 rounded-xl">
                    <CalendarCheck
                      size={18}
                      className="text-blue-600 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-sm text-blue-900">
                      Your reservation won&apos;t be confirmed until the Host
                      accepts your request (within 24 hours).
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      Cancellation Policy
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Free cancellations up until 48hrs before booking date.
                    </p>
                    <Link
                      href="/cancellation-policy"
                      className="text-sm font-medium text-primary hover:underline mt-1 inline-block"
                    >
                      View full Cancellation Policy
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 pt-5">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      By selecting the button below, I agree to the{" "}
                      <span className="font-semibold text-gray-900">
                        Host&apos;s House Rules
                      </span>
                      ,{" "}
                      <span className="font-semibold text-gray-900">
                        Ground rules for guests
                      </span>
                      , Sojourn Rebooking and{" "}
                      <Link
                        href="/cancellation-policy"
                        className="font-semibold text-primary hover:underline"
                      >
                        Refund Policy
                      </Link>
                      , and that Sojourn can charge my payment method if
                      I&apos;m responsible for damage. I agree to pay the total
                      amount shown if the Host accepts my booking request.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA button — desktop */}
              <div className="hidden md:block">
                {paymentMethod === "Paystack" ? (
                  <button
                    disabled={
                      !Boolean(paymentMethod) || paymentMethod !== "Paystack"
                    }
                    onClick={makePayment}
                    className="w-full sm:w-auto px-12 flex items-center justify-center text-center text-white bg-primary hover:bg-red-700 active:bg-red-800 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {mutation.isPending ? (
                      <Spinner color="white" size={20} />
                    ) : (
                      <span>Request to book</span>
                    )}
                  </button>
                ) : (
                  <CryptoCheckout
                    paymentMethod={paymentMethod}
                    data={{
                      propertyId: id,
                      userId,
                      checkInDate: validCheckInDate,
                      checkOutDate: validCheckOutDate,
                      numberOfAdults: adults,
                      numberOfChildren: children,
                      numberOfInfants: infants,
                      ...(credits > 0 && { credits: credits }),
                      ...(discountCode && { discountCode: discountCode }),
                    }}
                  />
                )}
              </div>
            </div>

            {/* Right column — price summary */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-6">
                <CheckoutCalculator
                  propertyId={id}
                  address={address}
                  title={title}
                  price={price}
                  children={children}
                  propertyImage={firstImageUrl}
                  infants={infants}
                  adults={adults}
                  checkInDate={checkInDate as Date}
                  checkOutDate={checkOutDate as Date}
                  cautionFee={cautionFee}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-3">
            {/* Mobile payment method */}
            <DropdownMenu
              open={openMobile}
              onOpenChange={(state) => setOpenMobile(state)}
            >
              <DropdownMenuTrigger className="w-full py-3 px-4 text-sm border border-gray-200 outline-none rounded-xl capitalize flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet size={16} className="text-primary" />
                  <span className="font-medium">{paymentMethod}</span>
                </div>
                {openMobile ? (
                  <ChevronUp size={16} className="text-gray-400" />
                ) : (
                  <ChevronDown size={16} className="text-gray-400" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[calc(100vw-2rem)] sm:w-[300px]">
                <DropdownMenuItem
                  className="py-3 text-sm cursor-pointer"
                  onClick={() => setPaymentMethod("Paystack")}
                >
                  Paystack
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="py-3 text-sm cursor-pointer"
                  onClick={() => setPaymentMethod("Crypto (USDTRC20)")}
                >
                  Crypto (USDTRC20)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {paymentMethod === "Paystack" ? (
              <button
                disabled={
                  !Boolean(paymentMethod) || paymentMethod !== "Paystack"
                }
                onClick={makePayment}
                className="w-full flex items-center justify-center text-center text-white bg-primary hover:bg-red-700 py-4 rounded-xl font-semibold transition-colors"
              >
                {mutation.isPending ? (
                  <Spinner color="white" size={20} />
                ) : (
                  <span>Request to book</span>
                )}
              </button>
            ) : (
              <CryptoCheckout
                paymentMethod={paymentMethod}
                data={{
                  propertyId: id,
                  userId,
                  checkInDate: validCheckInDate,
                  checkOutDate: validCheckOutDate,
                  numberOfAdults: adults,
                  numberOfChildren: children,
                  numberOfInfants: infants,
                  ...(credits > 0 && { credits: credits }),
                  ...(discountCode && { discountCode: discountCode }),
                }}
              />
            )}
          </div>
        </div>

        {/* Spacer for mobile sticky CTA */}
        <div className="h-36 md:hidden" />
      </div>

      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
          {googleLoginMutation.isPending ? (
            <div className="w-full flex items-center justify-center py-16">
              <Spinner size={35} color="red" />
            </div>
          ) : (
            <>
              <div className="px-6 pt-8 pb-4 text-center">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-gray-900">
                    Log in to{" "}
                    <span className="text-primary">complete payment</span>
                  </DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-500 mt-2">
                  Sign in to complete your booking
                </p>
              </div>
              <form
                autoComplete="off"
                className="px-6 pb-8 space-y-4"
                onSubmit={handleLoginSubmit((data) =>
                  loginMutation.mutate(data)
                )}
              >
                {loginMutation.isError && (
                  <div className="bg-red-50 text-primary text-sm font-medium px-4 py-3 rounded-xl">
                    {loginMutation.error.message}
                  </div>
                )}
                {loginErrors.email && (
                  <div className="bg-red-50 text-primary text-sm font-medium px-4 py-3 rounded-xl">
                    {loginErrors.email.message}
                  </div>
                )}
                <input
                  {...registerLogin("email")}
                  type="email"
                  className="w-full py-3.5 px-4 outline-none border border-gray-200 rounded-xl placeholder:text-gray-400 text-[15px] focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="Email address"
                />
                <input
                  {...registerLogin("password")}
                  type="password"
                  className="w-full py-3.5 px-4 outline-none border border-gray-200 rounded-xl placeholder:text-gray-400 text-[15px] focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="Password"
                />
                <button
                  disabled={loginMutation.isPending}
                  className="outline-none rounded-xl flex items-center justify-center w-full py-3.5 bg-primary text-white font-semibold ease duration-300 hover:bg-red-700 disabled:opacity-70"
                >
                  {loginMutation.isPending ? <Spinner /> : <span>Login</span>}
                </button>
                {isGoogleAuthEnabled && (
                  <CheckoutGoogleButton onToken={setGoogleUser} />
                )}
                <p className="text-center text-sm text-gray-500 pt-1">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-primary font-semibold hover:underline"
                    onClick={() => setShowLoginModal(false)}
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
