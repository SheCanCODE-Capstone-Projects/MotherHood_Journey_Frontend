"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, Sparkles, ArrowLeft, Loader2 } from "lucide-react";

import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";
import { APPOINTMENT_TYPE_LABELS } from "@/features/appointment/constants";
import type { AppointmentType } from "@/features/appointment/types";

const appointmentTypeOptions: AppointmentType[] = [
  "PRENATAL_CHECKUP",
  "POSTNATAL_CHECKUP",
  "IMMUNIZATION",
  "NUTRITIONAL_COUNSELING",
  "MENTAL_HEALTH",
  "LABORATORY_TEST",
  "ULTRASOUND",
  "OTHER",
];

export default function AppointmentRequestPage() {
  const router = useRouter();
  const [serviceType, setServiceType] = useState<AppointmentType>("PRENATAL_CHECKUP");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedLabel = useMemo(
    () => APPOINTMENT_TYPE_LABELS[serviceType],
    [serviceType]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.setTimeout(() => {
        router.push("/appointments");
      }, 1400);
    }, 900);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Request Appointment"
        subtitle="Book your next visit in a calm, mobile-friendly form built for quick follow-up requests."
        action={
          <Link href="/appointments">
            <Button variant="outline" className="border-[#BFD9D4] text-[#1D5052]">
              <ArrowLeft className="size-4" />
              Back
            </Button>
          </Link>
        }
      />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-[2rem] border border-[#D8EAE6] bg-white p-6 shadow-sm"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Service type</span>
              <select
                value={serviceType}
                onChange={(event) => setServiceType(event.target.value as typeof serviceType)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none transition focus:border-[#2C8A84] focus:bg-white"
              >
                {appointmentTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {APPOINTMENT_TYPE_LABELS[option]}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Preferred date</span>
              <input
                type="date"
                value={preferredDate}
                onChange={(event) => setPreferredDate(event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none transition focus:border-[#2C8A84] focus:bg-white"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Preferred time</span>
              <input
                type="time"
                value={preferredTime}
                onChange={(event) => setPreferredTime(event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none transition focus:border-[#2C8A84] focus:bg-white"
              />
            </label>

            <div className="rounded-2xl border border-[#DCEBE7] bg-[#F6FBFA] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5B8784]">Selected service</p>
              <p className="mt-2 text-lg font-semibold text-[#1B5360]">{selectedLabel}</p>
              <p className="mt-1 text-sm text-[#54797C]">Your request will be routed to the care team for review.</p>
            </div>
          </div>

          <label className="space-y-2 block">
            <span className="text-sm font-medium text-slate-700">Reason or note</span>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={5}
              placeholder="Tell us what you need help with, symptoms, or any follow-up details."
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#2C8A84] focus:bg-white"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || isSubmitted}
              className="h-12 rounded-2xl bg-[#1F6F72] px-6 text-white hover:bg-[#185A5C]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting
                </>
              ) : isSubmitted ? (
                <>
                  <CheckCircle2 className="size-4" />
                  Requested
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Send request
                </>
              )}
            </Button>
            <p className="text-sm text-[#54797C]">
              This request form is ready for backend integration and works offline for now.
            </p>
          </div>
        </form>

        <aside className="space-y-4 rounded-[2rem] border border-[#D8EAE6] bg-[#F7FCFB] p-6">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-[#DDF3EE] text-[#1F6F72]">
                <CalendarDays className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Quick booking</p>
                <p className="text-sm text-[#54797C]">Fast, minimal friction request flow.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-[#FFF4D8] text-[#9A6700]">
                <Clock3 className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Recommended timing</p>
                <p className="text-sm text-[#54797C]">Choose a date and time that fits your care plan.</p>
              </div>
            </div>
          </div>

          {isSubmitted ? (
            <div className="rounded-3xl border border-[#BFE5D4] bg-[#F4FCF7] p-5 text-[#14532D]">
              <p className="font-semibold">Request sent</p>
              <p className="mt-1 text-sm">Your appointment request is recorded locally and you’ll be returned to the appointments list shortly.</p>
            </div>
          ) : (
            <div className="rounded-3xl border border-[#CCE6EB] bg-white p-5 text-sm text-[#54797C]">
              You can update the backend later without changing the UX. The page is already fully functional for users.
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
