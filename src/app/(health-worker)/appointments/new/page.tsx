"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  User,
  Calendar,
  Clock,
  Building2,
  FileText,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Stethoscope,
  Baby,
  Heart,
  Activity,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import {
  searchPatient,
  getAvailableSlots,
  createAppointment,
} from "@/lib/api/appointments";
import type {
  PatientInfo,
  AppointmentType,
  TimeSlot,
  AppointmentResponse,
} from "@/lib/schemas/appointmentSchema";
import {
  formatAppointmentType,
  getAppointmentTypeColor,
} from "@/lib/schemas/appointmentSchema";

type FormStep = "search" | "form" | "confirmation";

type AppointmentTypeOption = {
  value: AppointmentType;
  label: string;
  icon: React.ReactNode;
  description: string;
};

const APPOINTMENT_TYPES: AppointmentTypeOption[] = [
  {
    value: "ANC",
    label: "Antenatal Care",
    icon: <Heart className="size-5" />,
    description: "Prenatal checkups during pregnancy",
  },
  {
    value: "PNC",
    label: "Postnatal Care",
    icon: <Heart className="size-5" />,
    description: "Post-delivery care for mother and baby",
  },
  {
    value: "VACCINATION",
    label: "Vaccination",
    icon: <Baby className="size-5" />,
    description: "Child immunization appointments",
  },
  {
    value: "GROWTH_CHECK",
    label: "Growth Check",
    icon: <Activity className="size-5" />,
    description: "Regular growth monitoring",
  },
  {
    value: "FOLLOW_UP",
    label: "Follow-up",
    icon: <Stethoscope className="size-5" />,
    description: "Follow-up consultation",
  },
];

// Mock health worker data (would come from JWT in real app)
const MOCK_HEALTH_WORKER = {
  facilityId: "FAC-001",
  facilityName: "Nyagatare Health Centre",
};

export default function NewAppointmentPage() {
  const router = useRouter();

  // Step state
  const [currentStep, setCurrentStep] = useState<FormStep>("search");

  // Search state
  const [healthId, setHealthId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [patient, setPatient] = useState<PatientInfo | null>(null);

  // Form state
  const [appointmentType, setAppointmentType] = useState<AppointmentType | "">("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [notes, setNotes] = useState("");
  const [sendSmsReminder, setSendSmsReminder] = useState(false);

  // Slots state
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Confirmation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointment, setAppointment] = useState<AppointmentResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Handle patient search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!healthId.trim()) {
      setSearchError("Please enter a health ID");
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const foundPatient = await searchPatient(healthId.trim());
      setPatient(foundPatient);
      setCurrentStep("form");
    } catch (error) {
      setSearchError(
        error instanceof Error ? error.message : "Patient not found. Please check the health ID."
      );
      setPatient(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Load available slots when date changes
  const loadSlots = useCallback(async (date: string) => {
    if (!date || !patient) return;

    setIsLoadingSlots(true);
    try {
      const response = await getAvailableSlots(date, patient.facilityId);
      setSlots(response.slots);
    } catch (error) {
      console.error("Failed to load slots:", error);
      setSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  }, [patient]);

  useEffect(() => {
    if (appointmentDate && patient) {
      loadSlots(appointmentDate);
    }
  }, [appointmentDate, patient, loadSlots]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patient || !appointmentType || !appointmentDate || !appointmentTime) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await createAppointment({
        patientHealthId: patient.healthId,
        appointmentType,
        appointmentDate,
        appointmentTime,
        facilityId: patient.facilityId,
        notes: notes.trim() || undefined,
        sendSmsReminder,
      });

      setAppointment(response);
      setCurrentStep("confirmation");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to create appointment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setHealthId("");
    setPatient(null);
    setAppointmentType("");
    setAppointmentDate("");
    setAppointmentTime("");
    setNotes("");
    setSendSmsReminder(false);
    setSlots([]);
    setAppointment(null);
    setSubmitError(null);
    setSearchError(null);
    setCurrentStep("search");
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateStr));
  };

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 pb-6 text-slate-950">
      <PageHeader
        title="Schedule Appointment"
        subtitle="Book an appointment for a mother or child patient"
      />

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
            currentStep === "search"
              ? "bg-[#1F6F72] text-white"
              : "bg-[#E8F5F2] text-[#1F6F72]"
          )}
        >
          1
        </div>
        <div
          className={cn(
            "h-0.5 w-16 transition-colors",
            currentStep !== "search" ? "bg-[#1F6F72]" : "bg-gray-200"
          )}
        />
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
            currentStep === "form"
              ? "bg-[#1F6F72] text-white"
              : currentStep === "confirmation"
              ? "bg-[#E8F5F2] text-[#1F6F72]"
              : "bg-gray-200 text-gray-400"
          )}
        >
          2
        </div>
        <div
          className={cn(
            "h-0.5 w-16 transition-colors",
            currentStep === "confirmation" ? "bg-[#1F6F72]" : "bg-gray-200"
          )}
        />
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
            currentStep === "confirmation"
              ? "bg-[#1F6F72] text-white"
              : "bg-gray-200 text-gray-400"
          )}
        >
          3
        </div>
      </div>

      {/* Step 1: Patient Search */}
      {currentStep === "search" && (
        <section className="overflow-hidden rounded-[2rem] border border-[#CFE6E2] bg-white shadow-[0_20px_55px_-35px_rgba(18,89,82,0.35)]">
          <div className="bg-[linear-gradient(135deg,#1F6F72_0%,#2C8A84_55%,#E8F5F2_100%)] px-6 py-8 text-white">
            <div className="flex items-center gap-3">
              <Search className="size-6" />
              <h2 className="text-2xl font-semibold">Find Patient</h2>
            </div>
            <p className="mt-2 text-white/90">
              Search by health ID to schedule an appointment
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label
                  htmlFor="healthId"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Patient Health ID
                </label>
                <div className="mt-2 relative">
                  <input
                    id="healthId"
                    type="text"
                    value={healthId}
                    onChange={(e) => setHealthId(e.target.value.toUpperCase())}
                    placeholder="e.g., MHD-2024-001"
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 pl-11 text-slate-950 placeholder:text-gray-400 focus:border-[#1F6F72] focus:outline-none focus:ring-2 focus:ring-[#1F6F72]/20",
                      searchError ? "border-[#F2A9A9]" : "border-gray-200"
                    )}
                  />
                  <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                </div>
                {searchError && (
                  <p className="mt-2 flex items-center gap-1 text-sm text-[#991B1B]">
                    <AlertCircle className="size-4" />
                    {searchError}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSearching}
                className="w-full rounded-2xl bg-[#1F6F72] px-6 py-3 text-white hover:bg-[#1F6F72]/90 disabled:opacity-50"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="size-4" />
                    <span>Search Patient</span>
                  </>
                )}
              </Button>
            </form>

            {/* Demo hint */}
            <div className="mt-6 rounded-2xl border border-[#BFD7EA] bg-[#F5FAFF] p-4">
              <p className="text-sm font-semibold text-[#1D4ED8]">
                Demo Health IDs:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-[#1D4ED8]/80">
                <li>
                  <strong>MHD-2024-001</strong> - Marie Uwimana (Mother)
                </li>
                <li>
                  <strong>MHD-2024-002</strong> - Amina Uwimana (Child)
                </li>
                <li>
                  <strong>MHD-2024-003</strong> - Jeanne Mukamana (Mother)
                </li>
                <li>
                  <strong>MHD-2024-004</strong> - Patrick Mukamana (Child)
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Step 2: Appointment Form */}
      {currentStep === "form" && patient && (
        <section className="overflow-hidden rounded-[2rem] border border-[#CFE6E2] bg-white shadow-[0_20px_55px_-35px_rgba(18,89,82,0.35)]">
          <div className="bg-[linear-gradient(135deg,#1F6F72_0%,#2C8A84_55%,#E8F5F2_100%)] px-6 py-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="size-6" />
                <div>
                  <h2 className="text-xl font-semibold">{patient.fullName}</h2>
                  <p className="text-sm text-white/80">
                    {patient.isMother ? "Mother" : "Child"} ·{" "}
                    {patient.isMother ? "" : `Mother: ${patient.motherName}`}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="rounded-full border-white/30 bg-white/10 px-3 text-white hover:bg-white/20"
              >
                <ArrowLeft className="size-4" />
                <span className="ml-1">Change</span>
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Patient Info Card */}
            <div className="grid gap-3 rounded-2xl border border-[#CFE6E2] bg-[#F6FBFA] p-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64807C]">
                  Health ID
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {patient.healthId}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64807C]">
                  Date of Birth
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {patient.dateOfBirth
                    ? new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }).format(new Date(patient.dateOfBirth))
                    : "Not recorded"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64807C]">
                  Facility
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {patient.facilityName}
                </p>
              </div>
            </div>

            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Appointment Type <span className="text-[#F2A9A9]">*</span>
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {APPOINTMENT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setAppointmentType(type.value)}
                    className={cn(
                      "relative flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all",
                      appointmentType === type.value
                        ? cn(
                            getAppointmentTypeColor(type.value),
                            "ring-2 ring-offset-2 ring-[#1F6F72]/30"
                          )
                        : "border-gray-200 hover:border-[#1F6F72]/30 hover:bg-gray-50"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-full p-2",
                        appointmentType === type.value
                          ? "bg-white/50"
                          : "bg-gray-100"
                      )}
                    >
                      {type.icon}
                    </div>
                    <div>
                      <p
                        className={cn(
                          "font-semibold",
                          appointmentType === type.value
                            ? ""
                            : "text-slate-950"
                        )}
                      >
                        {type.label}
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-sm",
                          appointmentType === type.value
                            ? "text-current/80"
                            : "text-gray-500"
                        )}
                      >
                        {type.description}
                      </p>
                    </div>
                    {appointmentType === type.value && (
                      <CheckCircle2
                        className="absolute right-3 top-3 size-5"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label
                htmlFor="appointmentDate"
                className="block text-sm font-semibold text-slate-700"
              >
                Appointment Date <span className="text-[#F2A9A9]">*</span>
              </label>
              <div className="mt-2 relative">
                <input
                  id="appointmentDate"
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => {
                    setAppointmentDate(e.target.value);
                    setAppointmentTime("");
                  }}
                  min={getMinDate()}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 pl-11 text-slate-950 focus:border-[#1F6F72] focus:outline-none focus:ring-2 focus:ring-[#1F6F72]/20"
                />
                <Calendar className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Time Slots */}
            {appointmentDate && (
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Available Time Slots{" "}
                  <span className="text-[#F2A9A9]">*</span>
                </label>
                <div className="mt-3">
                  {isLoadingSlots ? (
                    <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 py-8">
                      <Loader2 className="size-6 animate-spin text-[#1F6F72]" />
                    </div>
                  ) : slots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                      {slots.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() =>
                            slot.isAvailable && setAppointmentTime(slot.time)
                          }
                          disabled={!slot.isAvailable}
                          className={cn(
                            "rounded-xl border px-3 py-2 text-sm font-medium transition-all",
                            slot.isAvailable
                              ? appointmentTime === slot.time
                                ? "border-[#1F6F72] bg-[#1F6F72] text-white"
                                : "border-gray-200 hover:border-[#1F6F72] hover:bg-[#E8F5F2]"
                              : "cursor-not-allowed border-gray-100 bg-gray-100 text-gray-400 line-through"
                          )}
                        >
                          {formatTime(slot.time)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-[#F2A9A9] bg-[#FFF4F4] py-6 text-center text-sm text-[#991B1B]">
                      <AlertCircle className="mx-auto mb-2 size-5" />
                      No available slots for this date. Please select another
                      date.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Facility (Auto-filled) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Facility
              </label>
              <div className="mt-2 relative">
                <input
                  type="text"
                  value={patient.facilityName}
                  disabled
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 pl-11 text-slate-500"
                />
                <Building2 className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Auto-filled from your account
              </p>
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-semibold text-slate-700"
              >
                Notes (Optional)
              </label>
              <div className="mt-2 relative">
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Any additional information..."
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 pl-11 text-slate-950 placeholder:text-gray-400 focus:border-[#1F6F72] focus:outline-none focus:ring-2 focus:ring-[#1F6F72]/20"
                />
                <FileText className="absolute left-4 top-4 size-5 text-gray-400" />
              </div>
            </div>

            {/* SMS Reminder Toggle */}
            <div className="rounded-2xl border border-[#CFE6E2] bg-[#F6FBFA] p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <MessageSquare className="size-5 text-[#1F6F72]" />
                </div>
                <div className="flex-1">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={sendSmsReminder}
                        onChange={(e) => setSendSmsReminder(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div
                        className={cn(
                          "h-6 w-11 rounded-full border-2 border-gray-300 bg-gray-100 transition-colors peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1F6F72]/30",
                          sendSmsReminder && "border-[#1F6F72] bg-[#1F6F72]"
                        )}
                      />
                      <div
                        className={cn(
                          "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                          sendSmsReminder && "translate-x-5"
                        )}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-950">
                      Send SMS reminder to patient
                    </span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    Patient will receive an SMS reminder before the appointment
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Error */}
            {submitError && (
              <div className="rounded-2xl border border-[#F2A9A9] bg-[#FFF4F4] p-4">
                <div className="flex items-center gap-2 text-[#991B1B]">
                  <AlertCircle className="size-5" />
                  <p className="text-sm font-medium">{submitError}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex-1 rounded-2xl border-[#BFD9D4] bg-white px-6 py-3 text-[#1D5052] hover:bg-[#F1F8F6]"
              >
                <ArrowLeft className="size-4" />
                <span>Back</span>
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !appointmentType ||
                  !appointmentDate ||
                  !appointmentTime
                }
                className="flex-1 rounded-2xl bg-[#1F6F72] px-6 py-3 text-white hover:bg-[#1F6F72]/90 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Scheduling...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" />
                    <span>Schedule Appointment</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </section>
      )}

      {/* Step 3: Confirmation */}
      {currentStep === "confirmation" && appointment && (
        <section className="overflow-hidden rounded-[2rem] border border-[#CFE6E2] bg-white shadow-[0_20px_55px_-35px_rgba(18,89,82,0.35)]">
          <div className="bg-[linear-gradient(135deg,#1F6F72_0%,#2C8A84_55%,#E8F5F2_100%)] px-6 py-8 text-white text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <CheckCircle2 className="size-8" />
            </div>
            <h2 className="text-2xl font-semibold">Appointment Scheduled!</h2>
            <p className="mt-2 text-white/90">
              The appointment has been successfully created
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Reference Number */}
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#64807C]">
                Reference Number
              </p>
              <p className="mt-2 text-3xl font-semibold text-[#1F6F72]">
                {appointment.referenceNumber}
              </p>
            </div>

            {/* Appointment Details */}
            <div className="grid gap-4 rounded-2xl border border-[#CFE6E2] bg-[#F6FBFA] p-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64807C]">
                  Patient
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {appointment.patientName}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64807C]">
                  Type
                </p>
                <div className="mt-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold",
                      getAppointmentTypeColor(appointment.appointmentType)
                    )}
                  >
                    {formatAppointmentType(appointment.appointmentType)}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64807C]">
                  Date
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {formatDate(appointment.appointmentDate)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64807C]">
                  Time
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {formatTime(appointment.appointmentTime)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64807C]">
                  Facility
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {appointment.facilityName}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64807C]">
                  SMS Reminder
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {appointment.sendSmsReminder ? (
                    <span className="text-[#1F6F72]">Enabled</span>
                  ) : (
                    <span className="text-gray-400">Not set</span>
                  )}
                </p>
              </div>
            </div>

            {/* Notes */}
            {appointment.notes && (
              <div className="rounded-2xl border border-[#CFE6E2] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64807C]">
                  Notes
                </p>
                <p className="mt-2 text-slate-700">{appointment.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/appointments")}
                className="flex-1 rounded-2xl border-[#BFD9D4] bg-white px-6 py-3 text-[#1D5052] hover:bg-[#F1F8F6]"
              >
                <RotateCcw className="size-4" />
                <span>Back to Appointments</span>
              </Button>
              <Button
                type="button"
                onClick={handleReset}
                className="flex-1 rounded-2xl bg-[#1F6F72] px-6 py-3 text-white hover:bg-[#1F6F72]/90"
              >
                <Search className="size-4" />
                <span>Schedule Another</span>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}