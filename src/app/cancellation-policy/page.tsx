import Footer from "@/components/ui/footer";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | Sojourn",
  description:
    "Learn about Sojourn's cancellation and refund policies for guests and hosts. Understand our flexible, moderate, and strict cancellation options.",
};

const POLICY_TYPES = [
  {
    name: "Flexible",
    color: "bg-emerald-500",
    badge: "text-emerald-700 bg-emerald-50 border-emerald-200",
    rules: [
      { timing: "Up to 48 hours before check-in", refund: "Full refund" },
      { timing: "Within 48 hours of check-in", refund: "50% refund" },
      { timing: "After check-in", refund: "No refund" },
    ],
    note: "Service fees may be non-refundable.",
  },
  {
    name: "Moderate",
    color: "bg-amber-500",
    badge: "text-amber-700 bg-amber-50 border-amber-200",
    rules: [
      { timing: "Up to 7 days before check-in", refund: "Full refund" },
      { timing: "Within 7 days of check-in", refund: "50% refund" },
      { timing: "After check-in", refund: "No refund" },
    ],
    note: "Service fees may be non-refundable.",
  },
  {
    name: "Strict",
    color: "bg-red-500",
    badge: "text-red-700 bg-red-50 border-red-200",
    rules: [
      { timing: "Up to 14 days before check-in", refund: "50% refund" },
      { timing: "Within 14 days of check-in", refund: "No refund" },
    ],
    note: "Service fees are non-refundable.",
  },
];

export default function CancellationPolicyPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative w-full py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/imgs/discover-bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative z-10 max-w-[900px] mx-auto text-center">
          <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-white/60 mb-3">
            Policy
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
            Cancellation & Refund Policy
          </h1>
          <p className="text-white/80 mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
            A fair, transparent, and balanced system that protects both guests
            and hosts while reflecting local operational realities.
          </p>
          <p className="text-white/50 text-xs sm:text-sm mt-6">
            Last Updated: February 2026
          </p>
        </div>
      </section>

      {/* General Principles */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-start gap-4 mb-6">
            <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
              1
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                General Principles
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                By booking a stay through Sojourn, guests agree to the terms
                outlined below.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                Our policies are designed to:
              </h4>
              <ul className="space-y-2">
                {[
                  "Provide reasonable flexibility to guests",
                  "Protect hosts from financial loss",
                  "Ensure transparency in refund expectations",
                  "Maintain property and operational standards",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                Refund eligibility depends on:
              </h4>
              <ul className="space-y-2">
                {[
                  "The cancellation timing",
                  "The cancellation policy selected for the listing",
                  "Whether the stay has commenced",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 text-sm text-blue-900">
            Guests must review the specific cancellation policy displayed on the
            property page before confirming a booking.
          </div>
        </div>
      </section>

      {/* Cancellation Policy Types */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-start gap-4 mb-8">
            <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
              2
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Cancellation Policy Types
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Each property operates under one of the following cancellation
                structures.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            {POLICY_TYPES.map((policy) => (
              <div
                key={policy.name}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                  <span
                    className={`w-3 h-3 rounded-full ${policy.color}`}
                  />
                  <h3 className="font-bold text-gray-900 text-lg">
                    {policy.name} Policy
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {policy.rules.map((rule) => (
                      <div
                        key={rule.timing}
                        className="flex items-center justify-between gap-4 text-sm"
                      >
                        <span className="text-gray-600">{rule.timing}</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${policy.badge}`}
                        >
                          {rule.refund}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-4">{policy.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Same-Day & Early Departure */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-[900px] mx-auto space-y-10">
          {/* Same-Day */}
          <div>
            <div className="flex items-start gap-4 mb-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                3
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Same-Day & Last-Minute Bookings
                </h2>
              </div>
            </div>
            <div className="ml-0 sm:ml-14">
              <p className="text-gray-600 text-sm leading-relaxed">
                Bookings made within 24 hours of check-in are generally
                non-refundable unless otherwise stated on the listing page.
              </p>
            </div>
          </div>

          {/* Early Departure */}
          <div>
            <div className="flex items-start gap-4 mb-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                4
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Early Departure
                </h2>
              </div>
            </div>
            <div className="ml-0 sm:ml-14 space-y-4">
              <p className="text-gray-600 text-sm leading-relaxed">
                If you check out before your scheduled departure date, unused
                nights are generally non-refundable. Exceptions may apply in
                approved emergency situations.
              </p>

              <div className="bg-gray-950 rounded-2xl p-6 shadow-xl shadow-black/20">
                <h4 className="font-bold text-white text-sm mb-2">
                  Early Checkout Refund — Nigeria Utility Policy
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  In Nigeria, electricity and some utilities are prepaid based on
                  the length of your stay. Since hosts often purchase these
                  utilities in advance, they may not be refundable once
                  allocated.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                    <p className="text-3xl font-bold text-emerald-400">70%</p>
                    <p className="text-xs text-gray-400 mt-1">
                      of unused nights refunded
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                    <p className="text-3xl font-bold text-amber-400">30%</p>
                    <p className="text-xs text-gray-400 mt-1">
                      retained for prepaid utilities
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Applies only when the early checkout is voluntary and not due
                  to a property issue. Sojourn reviews each case to ensure
                  fairness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Extenuating Circumstances & Host Cancellations */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-[900px] mx-auto space-y-10">
          {/* Extenuating */}
          <div>
            <div className="flex items-start gap-4 mb-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                5
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Extenuating Circumstances
                </h2>
              </div>
            </div>
            <div className="ml-0 sm:ml-14">
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Sojourn may override standard cancellation policies in cases of:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Serious illness or medical emergencies",
                  "Government travel restrictions",
                  "Natural disasters",
                  "Property becoming uninhabitable",
                ].map((item) => (
                  <div
                    key={item}
                    className="bg-white rounded-xl p-4 border border-gray-100 text-sm text-gray-700 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Supporting documentation may be required. Refund decisions under
                extenuating circumstances are made at Sojourn&apos;s discretion.
              </p>
            </div>
          </div>

          {/* Host Cancellations */}
          <div>
            <div className="flex items-start gap-4 mb-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                6
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Host-Initiated Cancellations
                </h2>
              </div>
            </div>
            <div className="ml-0 sm:ml-14">
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                If a host cancels a confirmed booking:
              </p>
              <ul className="space-y-2 mb-3">
                {[
                  "Guests will receive a full refund",
                  "Service fees will be refunded",
                  "Sojourn may assist in securing alternative accommodation",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-400">
                Hosts who repeatedly cancel may face penalties, suspension, or
                removal from the platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Deposit */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-start gap-4 mb-6">
            <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
              7
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Security Deposit & Damage Protection
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Certain listings may require a refundable security deposit.
              </p>
            </div>
          </div>

          <div className="ml-0 sm:ml-14 space-y-6">
            {/* What it covers */}
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Property damage",
                "Missing items",
                "Policy violations",
                "Excessive cleaning needs",
              ].map((item) => (
                <div
                  key={item}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm text-gray-700"
                >
                  {item}
                </div>
              ))}
            </div>

            {/* How it works */}
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-3">
                How the Security Deposit Works
              </h4>
              <div className="flex flex-col sm:flex-row gap-3">
                {[
                  {
                    step: "1",
                    text: "Collected at booking or check-in",
                  },
                  {
                    step: "2",
                    text: "Held temporarily for protection",
                  },
                  {
                    step: "3",
                    text: "Fully refunded if no damage or violations",
                  },
                ].map((s) => (
                  <div
                    key={s.step}
                    className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100 text-center"
                  >
                    <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold inline-flex items-center justify-center mb-2">
                      {s.step}
                    </span>
                    <p className="text-sm text-gray-600">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Damage Reporting */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-4">
                Damage Reporting & Resolution
              </h4>
              <div className="space-y-4 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-800 mb-2">
                    If a host believes damage occurred:
                  </p>
                  <ul className="space-y-1.5 ml-1">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      Host must submit a formal report within 24 hours of guest
                      checkout
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      Include clear photographic or video evidence
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      Provide detailed description and estimated repair cost
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-gray-800 mb-2">
                    Investigation & Review:
                  </p>
                  <p className="leading-relaxed">
                    Sojourn acts as a neutral third party — reviewing all
                    evidence, contacting both parties if needed, and evaluating
                    whether damage occurred during the stay.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-white rounded-xl p-4 border border-emerald-100">
                    <p className="font-medium text-emerald-700 text-xs mb-1">
                      Claim validated
                    </p>
                    <p className="text-gray-600 text-xs">
                      A portion or full deposit may be retained. Remaining
                      balance refunded.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-blue-100">
                    <p className="font-medium text-blue-700 text-xs mb-1">
                      Claim not validated
                    </p>
                    <p className="text-gray-600 text-xs">
                      Full security deposit refunded to the guest.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Normal wear & Fraudulent */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-4">
                <h5 className="font-semibold text-emerald-800 text-sm mb-2">
                  Normal Wear & Tear
                </h5>
                <p className="text-emerald-700 text-xs leading-relaxed">
                  Security deposits will not be deducted for minor scuffs,
                  standard usage marks, or normal wear consistent with
                  residential use.
                </p>
              </div>
              <div className="bg-red-50/70 border border-red-100 rounded-xl p-4">
                <h5 className="font-semibold text-red-800 text-sm mb-2">
                  Fraudulent Claims
                </h5>
                <p className="text-red-700 text-xs leading-relaxed">
                  Submitting false or exaggerated damage claims may result in
                  host penalties, suspension, or permanent removal from Sojourn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Remaining Sections */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-[900px] mx-auto space-y-10">
          {/* Refund Processing */}
          <div>
            <div className="flex items-start gap-4 mb-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                8
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Refund Processing Time
              </h2>
            </div>
            <div className="ml-0 sm:ml-14">
              <div className="bg-white rounded-xl p-5 border border-gray-100 text-sm text-gray-600 leading-relaxed">
                Approved refunds are processed within{" "}
                <span className="font-semibold text-gray-900">
                  5–10 business days
                </span>
                , depending on the payment provider. Sojourn is not responsible
                for delays caused by third-party financial institutions.
              </div>
            </div>
          </div>

          {/* Non-Refundable Items */}
          <div>
            <div className="flex items-start gap-4 mb-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                9
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Non-Refundable Items
              </h2>
            </div>
            <div className="ml-0 sm:ml-14">
              <div className="bg-white rounded-xl p-5 border border-gray-100">
                <p className="text-sm text-gray-600 mb-3">
                  The following may be non-refundable depending on the listing:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Service fees",
                    "Cleaning fees (if stay commenced)",
                    "Payment processing charges",
                  ].map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Details are shown during checkout.
                </p>
              </div>
            </div>
          </div>

          {/* Booking Modifications */}
          <div>
            <div className="flex items-start gap-4 mb-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                10
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Booking Modifications
              </h2>
            </div>
            <div className="ml-0 sm:ml-14">
              <div className="bg-white rounded-xl p-5 border border-gray-100 text-sm text-gray-600 leading-relaxed space-y-2">
                <p>
                  Guests may request changes to booking dates or stay length.
                  Approval depends on host availability, updated pricing, and
                  the selected cancellation policy.
                </p>
                <p className="text-xs text-gray-400">
                  Changes may affect refund eligibility.
                </p>
              </div>
            </div>
          </div>

          {/* Dispute Resolution */}
          <div>
            <div className="flex items-start gap-4 mb-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                11
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Dispute Resolution
              </h2>
            </div>
            <div className="ml-0 sm:ml-14">
              <div className="bg-white rounded-xl p-5 border border-gray-100 text-sm text-gray-600 leading-relaxed space-y-2">
                <p>
                  If a dispute arises, guests and hosts should first communicate
                  via the Sojourn platform. Sojourn reserves the right to make a
                  final determination based on available evidence.
                </p>
                <p className="font-medium text-gray-700">
                  All decisions made by Sojourn after investigation are final.
                </p>
              </div>
            </div>
          </div>

          {/* Policy Updates */}
          <div>
            <div className="flex items-start gap-4 mb-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                12
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Policy Updates
              </h2>
            </div>
            <div className="ml-0 sm:ml-14">
              <p className="text-sm text-gray-600 leading-relaxed">
                Sojourn reserves the right to modify this policy at any time.
                Continued use of the platform constitutes acceptance of updated
                terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section
        className="relative w-full py-14 sm:py-20 px-4 sm:px-6 md:px-12 lg:px-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/imgs/discover-bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-[700px] mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
            Need Help?
          </h2>
          <p className="text-white/80 mt-3 text-sm sm:text-base leading-relaxed">
            For cancellation, refund, or damage-related inquiries, reach out to
            our support team.
          </p>
          <Link
            href="mailto:info@sojourn.ng"
            className="inline-block mt-6 px-8 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
          >
            info@sojourn.ng
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
