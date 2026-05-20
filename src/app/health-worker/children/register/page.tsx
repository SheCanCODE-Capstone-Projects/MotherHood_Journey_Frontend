"use client";

import { useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Search,
  Check,
  ArrowRight,
  RotateCcw,
  ChevronDown,
  CalendarDays,
} from "lucide-react";
import { childSchema, type ChildFormData } from "@/lib/schemas/childSchema";
import { registerChild, searchMothers } from "@/lib/api/children";
import type {
  ChildRegistrationResponse,
  MotherSearchResult,
} from "@/features/child/types";

type FormStatus = "form" | "success";

export default function RegisterChildPage() {
  const router = useRouter();
  const [status, setStatus] = useState<FormStatus>("form");
  const [registrationResult, setRegistrationResult] =
    useState<ChildRegistrationResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MotherSearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMother, setSelectedMother] =
    useState<MotherSearchResult | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ChildFormData>({
    resolver: zodResolver(childSchema),
    defaultValues: {
      mother_health_id: "",
      first_name: "",
      gender: undefined,
      date_of_birth: "",
      birth_weight: undefined,
      delivery_type: undefined,
      birth_certificate_number: "",
    },
  });

  const mutation = useMutation({
    mutationFn: registerChild,
    onSuccess: (data) => {
      setRegistrationResult(data);
      setStatus("success");
    },
  });

  const handleMotherSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (
        selectedMother &&
        query !== `${selectedMother.health_id} - ${selectedMother.name}`
      ) {
        setSelectedMother(null);
        setValue("mother_health_id", "", {
          shouldValidate: false,
          shouldDirty: true,
          shouldTouch: true,
        });
      }

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      if (query.length < 2) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      debounceTimer.current = setTimeout(async () => {
        setIsSearching(true);
        try {
          const results = await searchMothers(query);
          setSearchResults(results);
          setShowDropdown(results.length > 0);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    },
    [selectedMother, setValue]
  );

  const selectMother = (mother: MotherSearchResult) => {
    setValue("mother_health_id", mother.health_id, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setSearchQuery(`${mother.health_id} - ${mother.name}`);
    setSelectedMother(mother);
    setShowDropdown(false);
  };

  const onSubmit = (data: ChildFormData) => {
    mutation.mutate(data);
  };

  const resetForm = () => {
    reset();
    setStatus("form");
    setRegistrationResult(null);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedMother(null);
  };

  const today = new Date().toISOString().split("T")[0];

  // ── Success screen ──────────────────────────────────────────────────────────
  if (status === "success" && registrationResult) {
    const { child, vaccination_schedule } = registrationResult;
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        {/* Success banner */}
        <div className="flex items-center gap-3 border border-emerald-200 bg-emerald-50 p-5 rounded-lg">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500">
            <Check className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-emerald-800">
              Newborn registered successfully
            </p>
            <p className="text-sm text-emerald-700">
              The newborn has been added to the system
            </p>
          </div>
        </div>

        {/* Child record */}
        <div className="border border-gray-200 bg-white p-6 rounded-lg">
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            Child record
          </h2>
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {[
              { label: "Record ID", value: child.id },
              { label: "First name", value: child.first_name },
              { label: "Gender", value: child.gender },
              {
                label: "Date of birth",
                value: new Date(
                  child.date_of_birth + "T00:00:00"
                ).toLocaleDateString("en-RW", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
              },
              { label: "Birth weight", value: `${child.birth_weight} kg` },
              { label: "Delivery type", value: child.delivery_type },
              { label: "Mother's health ID", value: child.mother_id },
              ...(child.birth_certificate_number
                ? [
                    {
                      label: "Birth certificate",
                      value: child.birth_certificate_number,
                    },
                  ]
                : []),
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="mt-0.5 text-sm font-semibold text-gray-900">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Vaccination schedule */}
        <div className="border border-gray-200 bg-white p-6 rounded-lg">
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            Vaccination schedule
          </h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs font-semibold text-gray-500">
                  Vaccine
                </th>
                <th className="pb-2 text-right text-xs font-semibold text-gray-500">
                  Due date
                </th>
              </tr>
            </thead>
            <tbody>
              {vaccination_schedule.map((vaccine, index) => (
                <tr
                  key={vaccine.id}
                  className={
                    index < vaccination_schedule.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }
                >
                  <td className="py-2.5 text-sm font-medium text-gray-900">
                    {vaccine.vaccine_name}
                  </td>
                  <td className="py-2.5 text-right text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(
                        vaccine.due_date + "T00:00:00"
                      ).toLocaleDateString("en-RW", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={resetForm}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <RotateCcw className="h-4 w-4" />
            Register another
          </button>
          <button
            onClick={() =>
              router.push(`/children/${registrationResult.child.id}`)
            }
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#2C6F73] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D5052]"
          >
            View child record
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── Registration form ───────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-2xl">
      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Register newborn
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Register a newborn and link to the mother&apos;s health record
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Single flat white container with divider */}
        <div className="border border-gray-200 bg-white rounded-lg">
          {/* Mother search */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="mb-4 text-base font-semibold text-gray-900">
              Mother's health record
            </h2>

            {/* Hidden field that React Hook Form actually reads */}
            <input type="hidden" {...register("mother_health_id")} />

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by health ID or mother's name..."
                value={searchQuery}
                onChange={(e) => handleMotherSearch(e.target.value)}
                onFocus={() =>
                  searchResults.length > 0 && setShowDropdown(true)
                }
                onBlur={() =>
                  setTimeout(() => setShowDropdown(false), 200)
                }
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#2C6F73] focus:ring-2 focus:ring-[#2C6F73]/20"
              />
              {isSearching && (
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#2C6F73] border-t-transparent" />
                </div>
              )}

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
                  {searchResults.map((mother) => (
                    <button
                      key={mother.health_id}
                      type="button"
                      onMouseDown={() => selectMother(mother)}
                      className="w-full px-4 py-3 text-left transition-colors hover:bg-gray-50"
                    >
                      <p className="text-sm font-semibold text-gray-900">
                        {mother.health_id} — {mother.name}
                      </p>
                      <p className="text-xs text-gray-500">{mother.phone}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected mother badge */}
            {selectedMother && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2">
                <Check className="h-4 w-4 text-[#2C6F73]" />
                <span className="text-sm font-semibold text-gray-900">
                  {selectedMother.name}
                </span>
                <span className="text-xs text-gray-500">
                  ({selectedMother.health_id})
                </span>
              </div>
            )}

            {errors.mother_health_id && (
              <p className="mt-2 text-sm text-red-500">
                {errors.mother_health_id.message}
              </p>
            )}
          </div>

          {/* Child information */}
          <div className="p-6">
            <h2 className="mb-4 text-base font-semibold text-gray-900">
              Child information
            </h2>

            <div className="space-y-4">
              {/* First name */}
              <div>
                <label className="mb-1.5 block text-sm text-gray-700">
                  First name
                </label>
                <input
                  {...register("first_name")}
                  type="text"
                  placeholder="Enter child's first name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#2C6F73] focus:ring-2 focus:ring-[#2C6F73]/20"
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              {/* Gender + DOB */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm text-gray-700">
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      {...register("gender")}
                      defaultValue=""
                      className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#2C6F73] focus:ring-2 focus:ring-[#2C6F73]/20"
                    >
                      <option value="" disabled>
                        Select gender
                      </option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-gray-700">
                    Date of birth
                  </label>
                  <input
                    {...register("date_of_birth")}
                    type="date"
                    max={today}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#2C6F73] focus:ring-2 focus:ring-[#2C6F73]/20"
                  />
                  {errors.date_of_birth && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.date_of_birth.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Birth weight + Delivery type */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm text-gray-700">
                    Birth weight (kg)
                  </label>
                  <input
                    {...register("birth_weight", { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="8"
                    placeholder="e.g. 3.2"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#2C6F73] focus:ring-2 focus:ring-[#2C6F73]/20"
                  />
                  {errors.birth_weight && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.birth_weight.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-gray-700">
                    Delivery type
                  </label>
                  <div className="relative">
                    <select
                      {...register("delivery_type")}
                      defaultValue=""
                      className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#2C6F73] focus:ring-2 focus:ring-[#2C6F73]/20"
                    >
                      <option value="" disabled>
                        Select delivery type
                      </option>
                      <option value="NORMAL">Normal</option>
                      <option value="CAESAREAN">Caesarean</option>
                      <option value="ASSISTED">Assisted</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.delivery_type && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.delivery_type.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Birth certificate */}
              <div>
                <label className="mb-1.5 block text-sm text-gray-700">
                  Birth certificate number{" "}
                  <span className="text-xs text-gray-400">(optional)</span>
                </label>
                <input
                  {...register("birth_certificate_number")}
                  type="text"
                  placeholder="Enter birth certificate number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#2C6F73] focus:ring-2 focus:ring-[#2C6F73]/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form error */}
        {mutation.isError && (
          <p className="text-center text-sm text-red-500">
            Failed to register child. Please try again.
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#2C6F73] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D5052] disabled:opacity-50"
          >
            {mutation.isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Registering...
              </>
            ) : (
              "Register newborn"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
