"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  User, Phone, Lock, Heart, Stethoscope, Building2,
  ArrowRight, ArrowLeft, CheckCircle2, Loader2, Eye, EyeOff,
  MapPin, IdCard, AlertCircle, ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { registerUser } from "@/lib/api/auth";
import {
  getProvinces, getDistricts, getSectors, getCells,
  getVillages, resolveGeoLocation,
} from "@/lib/api/geo";

/* ── Roles ───────────────────────────────────────────────────── */
const ROLE_OPTIONS = [
  {
    value: "PATIENT",
    label: "Patient / Mother",
    description: "Track your pregnancy, children, and appointments",
    icon: Heart,
    color: "#E83E8C",
  },
  {
    value: "HEALTH_WORKER",
    label: "Health Worker",
    description: "Manage patient records, visits, and vaccinations",
    icon: Stethoscope,
    color: "#0B5554",
  },
  {
    value: "FACILITY_ADMIN",
    label: "Facility Admin",
    description: "Administer facility staff, reports, and service requests",
    icon: Building2,
    color: "#6C3FC5",
  },
] as const;

const ROLE_ROUTE: Record<string, string> = {
  PATIENT:        "/dashboard",
  HEALTH_WORKER:  "/hw-dashboard",
  FACILITY_ADMIN: "/facility-dashboard",
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/* ── Schemas ─────────────────────────────────────────────────── */
const step1Schema = z.object({ role: z.string().min(1, "Please select a role") });

const step2Schema = z
  .object({
    firstName:       z.string().min(2, "First name is required"),
    lastName:        z.string().min(2, "Last name is required"),
    nationalId:      z.string().min(10, "Enter your national ID (at least 10 digits)"),
    phoneNumber:     z
      .string().min(9, "Enter a valid phone number")
      .regex(/^[+\d][\d\s\-()]{7,}$/, "Enter a valid phone number"),
    password:        z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;

/* ── Geo select ──────────────────────────────────────────────── */
function GeoSelect({
  id, label, value, onChange, options, placeholder, disabled, error, optional,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder: string; disabled?: boolean; error?: string; optional?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[#163F42] font-medium text-sm">
        {label}{optional && <span className="ml-1 font-normal text-[#8AA2A4]">(optional)</span>}
      </Label>
      <div className="relative group">
        <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#8AA2A4] group-focus-within:text-[#0B5554] transition-colors" />
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            "h-14 w-full appearance-none rounded-xl border bg-[#F8FBFA] pl-12 pr-10 text-[15px] text-[#163F42]",
            "outline-none transition-all hover:bg-white focus:bg-white focus:border-[#0B5554] focus:ring-4 focus:ring-[#0B5554]/10",
            "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-[#8AA2A4]",
            error ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : "border-[#D0E8E4]",
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#8AA2A4]" />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ── Brand / progress panel ──────────────────────────────────── */
function BrandPanel({ step }: { step: number }) {
  return (
    <div
      className="relative hidden lg:flex lg:w-[42%] flex-col justify-between overflow-hidden px-16 py-12"
      style={{ background: "linear-gradient(145deg, #094544 0%, #0B5554 45%, #113638 100%)" }}
    >
      <div className="pointer-events-none absolute -top-32 -left-32 size-[500px] rounded-full border border-white/5 animate-pulseRing" />
      <div className="pointer-events-none absolute bottom-[-10%] -right-[15%] size-[600px] rounded-full border border-white/[0.04]" />
      <div className="pointer-events-none absolute top-1/4 right-1/4 size-[200px] rounded-full bg-white/[0.03] blur-3xl" />

      <div className="relative z-10 flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-[10px] bg-white/20 backdrop-blur-sm text-sm font-bold text-white ring-1 ring-white/30">
          MS
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">Maternal</p>
          <p className="text-base font-bold text-white leading-none">Sanctuary</p>
        </div>
      </div>

      <div className="relative z-10 animate-fadeSlideUp" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
        <h1 className="font-heading text-4xl xl:text-5xl font-bold text-white leading-[1.15] tracking-tight mb-4">
          Create your<br />account
        </h1>
        <p className="text-[17px] text-white/80 leading-relaxed font-light mb-12">
          Join thousands of health workers and patients on the platform.
        </p>
        <div className="space-y-5">
          {["Choose role", "Personal info", "Location"].map((label, i) => {
            const n = i + 1;
            const done = step > n;
            const active = step === n;
            return (
              <div key={label} className="flex items-center gap-4">
                <div className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold",
                  done   ? "bg-white text-[#0B5554]" : "",
                  active ? "bg-white/25 text-white ring-2 ring-white/50" : "",
                  !done && !active ? "bg-white/10 text-white/40" : "",
                )}>
                  {done ? <CheckCircle2 className="size-4" /> : n}
                </div>
                <p className={cn(
                  "text-sm font-medium",
                  active ? "text-white" : done ? "text-white/70" : "text-white/35",
                )}>{label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <p className="relative z-10 text-xs text-white/30">
        Ministry of Health — Rwanda &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function SignupPage() {
  const router = useRouter();
  const [step, setStep]             = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [roleData, setRoleData]         = useState<Step1Values | null>(null);
  const [personalData, setPersonalData] = useState<Step2Values | null>(null);

  // Cascading geo state
  const [province,   setProvince]   = useState("");
  const [district,   setDistrict]   = useState("");
  const [sector,     setSector]     = useState("");
  const [cell,       setCell]       = useState("");
  const [village,    setVillage]    = useState("");
  const [facilityId, setFacilityId] = useState("");
  const [geoErrors,  setGeoErrors]  = useState<Record<string, string>>({});
  const [resolvedGeoId, setResolvedGeoId] = useState<string | null>(null);
  const [resolvingGeo,  setResolvingGeo]  = useState(false);

  const [showPwd,  setShowPwd]  = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);

  const form1 = useForm<Step1Values>({ resolver: zodResolver(step1Schema), defaultValues: { role: "" } });
  const selectedRole = form1.watch("role");

  const form2 = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: { firstName: "", lastName: "", nationalId: "", phoneNumber: "", password: "", confirmPassword: "" },
  });

  /* Geo queries */
  const { data: provinces = [], isLoading: loadProv } = useQuery({
    queryKey: ["geo", "provinces"],
    queryFn: getProvinces,
    enabled: step === 3,
    staleTime: Infinity,
  });
  const { data: districts = [], isLoading: loadDist } = useQuery({
    queryKey: ["geo", "districts", province],
    queryFn: () => getDistricts(province),
    enabled: step === 3 && !!province,
    staleTime: Infinity,
  });
  const { data: sectors = [], isLoading: loadSect } = useQuery({
    queryKey: ["geo", "sectors", province, district],
    queryFn: () => getSectors(district, { province }),
    enabled: step === 3 && !!province && !!district,
    staleTime: Infinity,
  });
  const { data: cells = [], isLoading: loadCell } = useQuery({
    queryKey: ["geo", "cells", province, district, sector],
    queryFn: () => getCells(sector, { province, district }),
    enabled: step === 3 && !!province && !!district && !!sector,
    staleTime: Infinity,
  });
  const { data: villages = [], isLoading: loadVill } = useQuery({
    queryKey: ["geo", "villages", province, district, sector, cell],
    queryFn: () => getVillages(cell, { province, district, sector }),
    enabled: step === 3 && !!province && !!district && !!sector && !!cell,
    staleTime: Infinity,
  });

  /* Auto-resolve geoLocationId when all 5 levels are selected */
  useEffect(() => {
    if (!province || !district || !sector || !cell || !village) {
      setResolvedGeoId(null);
      return;
    }
    let cancelled = false;
    setResolvingGeo(true);
    resolveGeoLocation({ province, district, sector, cell, village })
      .then((res) => {
        if (!cancelled) {
          setResolvedGeoId(res.id);
          setResolvingGeo(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResolvedGeoId(null);
          setResolvingGeo(false);
        }
      });
    return () => { cancelled = true; };
  }, [province, district, sector, cell, village]);

  /* Handlers */
  const goNext1 = form1.handleSubmit((data) => { setRoleData(data); setStep(2); });
  const goNext2 = form2.handleSubmit((data) => { setPersonalData(data); setStep(3); });
  const goBack  = () => setStep((s) => s - 1);

  const submit = async () => {
    const errs: Record<string, string> = {};
    if (!province) errs.province = "Select a province";
    if (!district) errs.district = "Select a district";
    if (!sector)   errs.sector   = "Select a sector";
    if (!cell)     errs.cell     = "Select a cell";
    if (!village)  errs.village  = "Select a village";
    if (Object.keys(errs).length) { setGeoErrors(errs); return; }
    setGeoErrors({});

    if (facilityId && !UUID_REGEX.test(facilityId)) {
      setServerError(
        "Facility ID must be in UUID format (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx). Ask your facility administrator for the correct ID.",
      );
      return;
    }

    if (!roleData || !personalData || !resolvedGeoId) {
      if (!resolvedGeoId) setServerError("Could not resolve location. Please check your selection.");
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      await registerUser({
        phoneNumber:  personalData.phoneNumber.replace(/\s/g, ""),
        nationalId:   personalData.nationalId,
        password:     personalData.password,
        firstName:    personalData.firstName,
        lastName:     personalData.lastName,
        role:         roleData.role,
        geoLocationId: resolvedGeoId,
        facilityId:   facilityId || undefined,
      });

      toast.success("Account created!", { description: "Signing you in…" });

      const result = await signIn("credentials", {
        phoneNumber: personalData.phoneNumber.replace(/\s/g, ""),
        password:    personalData.password,
        redirect:    false,
      });

      if (!result?.ok || result.error) {
        toast.error("Account created — please sign in manually.");
        router.push("/login");
        return;
      }

      toast.success("Welcome to Motherhood Journey!");
      router.replace(ROLE_ROUTE[roleData.role] ?? "/patient/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setServerError(msg);
      toast.error("Registration failed", { description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div className="flex min-h-screen">
      <BrandPanel step={step} />

      <div className="flex w-full lg:w-[58%] items-start justify-center bg-[#F4F8F7] px-6 py-10 overflow-y-auto min-h-screen">
        <div className="w-full max-w-md py-2">

          {/* Mobile header */}
          <div className="mb-6 lg:hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="grid size-8 place-items-center rounded-[8px] bg-[#0B5554] text-xs font-bold text-white">MS</div>
                <p className="text-sm font-bold text-[#163F42]">Motherhood Journey</p>
              </div>
              <Badge className="border-0 text-[11px]" style={{ backgroundColor: "#EAF4F2", color: "#0B5554" }}>
                Step {step} of 3
              </Badge>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((s) => (
                <div key={s} className={cn("h-1 flex-1 rounded-full transition-all", s <= step ? "bg-[#0B5554]" : "bg-[#D0E8E4]")} />
              ))}
            </div>
          </div>

          <Card className="border border-[#E4EFED] shadow-[0_20px_60px_-15px_rgba(11,85,84,0.1)] bg-white/90 backdrop-blur-xl rounded-3xl">
            <CardContent className="p-8">
              {serverError && (
                <Alert className="mb-5 border-red-200 bg-red-50 text-red-700 py-3">
                  <AlertCircle className="size-4 shrink-0" />
                  <AlertDescription className="text-xs">{serverError}</AlertDescription>
                </Alert>
              )}

              {/* ── Step 1: Role ──────────────────────────────────── */}
              {step === 1 && (
                <form onSubmit={goNext1} className="space-y-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8AA2A4] mb-1">Step 1 of 3</p>
                    <h2 className="text-xl font-bold text-[#163F42]">Who are you?</h2>
                    <p className="text-sm text-[#6D8587] mt-1">Choose the account type that matches your role.</p>
                  </div>

                  <div className="space-y-3">
                    {ROLE_OPTIONS.map(({ value, label, description, icon: Icon, color }) => {
                      const checked = selectedRole === value;
                      return (
                        <label
                          key={value}
                          className={cn(
                            "flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all",
                            checked ? "border-[#0B5554] bg-[#EAF4F2]" : "border-[#E4EFED] bg-white hover:border-[#B0D4D1]",
                          )}
                        >
                          <input type="radio" className="sr-only" value={value} {...form1.register("role")} />
                          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: `${color}18` }}>
                            <Icon className="size-4.5" style={{ color }} />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#163F42]">{label}</p>
                            <p className="text-xs text-[#6D8587] mt-0.5 leading-relaxed">{description}</p>
                          </div>
                          <div className={cn(
                            "mt-1 size-4 shrink-0 rounded-full border-2 transition-all",
                            checked ? "border-[#0B5554] bg-[#0B5554]" : "border-[#C2D6D4]",
                          )} />
                        </label>
                      );
                    })}
                  </div>

                  {form1.formState.errors.role && <p className="text-xs text-red-500">{form1.formState.errors.role.message}</p>}

                  <Button type="submit" className="h-10 w-full text-sm font-semibold text-white" style={{ backgroundColor: "#0B5554" }}>
                    Continue <ArrowRight className="ml-2 size-4" />
                  </Button>
                  <p className="text-center text-xs text-[#8AA2A4]">
                    Already have an account?{" "}
                    <a href="/login" className="text-[#0B5554] font-medium hover:underline">Sign in</a>
                  </p>
                </form>
              )}

              {/* ── Step 2: Personal info ─────────────────────────── */}
              {step === 2 && (
                <form onSubmit={goNext2} className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8AA2A4] mb-1">Step 2 of 3</p>
                    <h2 className="text-xl font-bold text-[#163F42]">Personal information</h2>
                    <p className="text-sm text-[#6D8587] mt-1">Your details — we keep this secure.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {(["firstName", "lastName"] as const).map((f) => (
                      <div key={f} className="space-y-2">
                        <Label htmlFor={f} className="text-[#163F42] font-semibold text-[15px]">
                          {f === "firstName" ? "First name" : "Last name"}
                        </Label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#8AA2A4] group-focus-within:text-[#0B5554] transition-colors" />
                          <Input
                            id={f}
                            placeholder={f === "firstName" ? "John" : "Doe"}
                            className={cn(
                              "h-14 pl-12 text-[15px] rounded-xl border-[#D0E8E4] bg-[#F8FBFA] hover:bg-white focus-visible:bg-white focus-visible:border-[#0B5554] focus-visible:ring-4 focus-visible:ring-[#0B5554]/10 transition-all",
                              form2.formState.errors[f] && "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20"
                            )}
                            {...form2.register(f)}
                          />
                        </div>
                        {form2.formState.errors[f] && <p className="text-xs text-red-500">{form2.formState.errors[f]?.message}</p>}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationalId" className="text-[#163F42] font-semibold text-[15px]">National ID</Label>
                    <div className="relative group">
                      <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#8AA2A4] group-focus-within:text-[#0B5554] transition-colors" />
                      <Input
                        id="nationalId"
                        placeholder="16-digit national ID number"
                        className={cn(
                          "h-14 pl-12 text-[15px] rounded-xl border-[#D0E8E4] bg-[#F8FBFA] hover:bg-white focus-visible:bg-white focus-visible:border-[#0B5554] focus-visible:ring-4 focus-visible:ring-[#0B5554]/10 transition-all",
                          form2.formState.errors.nationalId && "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20"
                        )}
                        {...form2.register("nationalId")}
                      />
                    </div>
                    {form2.formState.errors.nationalId && <p className="text-xs text-red-500">{form2.formState.errors.nationalId.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-[#163F42] font-semibold text-[15px]">Phone number</Label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#8AA2A4] group-focus-within:text-[#0B5554] transition-colors" />
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="+250 7XX XXX XXX"
                        autoComplete="tel"
                        className={cn(
                          "h-14 pl-12 text-[15px] rounded-xl border-[#D0E8E4] bg-[#F8FBFA] hover:bg-white focus-visible:bg-white focus-visible:border-[#0B5554] focus-visible:ring-4 focus-visible:ring-[#0B5554]/10 transition-all",
                          form2.formState.errors.phoneNumber && "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20"
                        )}
                        {...form2.register("phoneNumber")}
                      />
                    </div>
                    {form2.formState.errors.phoneNumber && <p className="text-xs text-red-500">{form2.formState.errors.phoneNumber.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#163F42] font-semibold text-[15px]">Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#8AA2A4] group-focus-within:text-[#0B5554] transition-colors" />
                      <Input
                        id="password"
                        type={showPwd ? "text" : "password"}
                        placeholder="At least 8 characters"
                        autoComplete="new-password"
                        className={cn(
                          "h-14 pl-12 pr-12 text-[15px] rounded-xl border-[#D0E8E4] bg-[#F8FBFA] hover:bg-white focus-visible:bg-white focus-visible:border-[#0B5554] focus-visible:ring-4 focus-visible:ring-[#0B5554]/10 transition-all",
                          form2.formState.errors.password && "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20"
                        )}
                        {...form2.register("password")}
                      />
                      <button type="button" tabIndex={-1} onClick={() => setShowPwd((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8AA2A4] hover:text-[#0B5554] transition-colors">
                        {showPwd ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>
                    {form2.formState.errors.password && <p className="text-xs text-red-500">{form2.formState.errors.password.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-[#163F42] font-semibold text-[15px]">Confirm password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#8AA2A4] group-focus-within:text-[#0B5554] transition-colors" />
                      <Input
                        id="confirmPassword"
                        type={showCPwd ? "text" : "password"}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        className={cn(
                          "h-14 pl-12 pr-12 text-[15px] rounded-xl border-[#D0E8E4] bg-[#F8FBFA] hover:bg-white focus-visible:bg-white focus-visible:border-[#0B5554] focus-visible:ring-4 focus-visible:ring-[#0B5554]/10 transition-all",
                          form2.formState.errors.confirmPassword && "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20"
                        )}
                        {...form2.register("confirmPassword")}
                      />
                      <button type="button" tabIndex={-1} onClick={() => setShowCPwd((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8AA2A4] hover:text-[#0B5554] transition-colors">
                        {showCPwd ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>
                    {form2.formState.errors.confirmPassword && <p className="text-xs text-red-500">{form2.formState.errors.confirmPassword.message}</p>}
                  </div>

                  <div className="flex gap-4 pt-3">
                    <Button type="button" variant="outline" onClick={goBack} className="h-14 flex-1 rounded-xl border-[#D0E8E4] text-[#6D8587] text-base hover:bg-[#F8FBFA] transition-colors">
                      <ArrowLeft className="mr-2 size-5" /> Back
                    </Button>
                    <Button type="submit" className="h-14 flex-[2] rounded-xl text-base font-bold text-white shadow-lg shadow-[#0B5554]/20 transition-transform hover:scale-[1.02] active:scale-[0.98]" style={{ backgroundColor: "#0B5554" }}>
                      Continue <ArrowRight className="ml-2 size-5" />
                    </Button>
                  </div>
                </form>
              )}

              {/* ── Step 3: Location ──────────────────────────────── */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8AA2A4] mb-1">Step 3 of 3</p>
                    <h2 className="text-xl font-bold text-[#163F42]">Your location</h2>
                    <p className="text-sm text-[#6D8587] mt-1">
                      Select your full address to set up your account.
                    </p>
                  </div>

                  <GeoSelect
                    id="province" label="Province"
                    value={province}
                    onChange={(v) => { setProvince(v); setDistrict(""); setSector(""); setCell(""); setVillage(""); setResolvedGeoId(null); }}
                    options={provinces as unknown as string[]}
                    placeholder={loadProv ? "Loading…" : "Select province"}
                    disabled={loadProv}
                    error={geoErrors.province}
                  />
                  <GeoSelect
                    id="district" label="District"
                    value={district}
                    onChange={(v) => { setDistrict(v); setSector(""); setCell(""); setVillage(""); setResolvedGeoId(null); }}
                    options={districts as unknown as string[]}
                    placeholder={!province ? "Select province first" : loadDist ? "Loading…" : "Select district"}
                    disabled={!province || loadDist}
                    error={geoErrors.district}
                  />
                  <GeoSelect
                    id="sector" label="Sector"
                    value={sector}
                    onChange={(v) => { setSector(v); setCell(""); setVillage(""); setResolvedGeoId(null); }}
                    options={sectors as unknown as string[]}
                    placeholder={!district ? "Select district first" : loadSect ? "Loading…" : "Select sector"}
                    disabled={!district || loadSect}
                    error={geoErrors.sector}
                  />
                  <GeoSelect
                    id="cell" label="Cell"
                    value={cell}
                    onChange={(v) => { setCell(v); setVillage(""); setResolvedGeoId(null); }}
                    options={cells as unknown as string[]}
                    placeholder={!sector ? "Select sector first" : loadCell ? "Loading…" : "Select cell"}
                    disabled={!sector || loadCell}
                    error={geoErrors.cell}
                  />
                  <GeoSelect
                    id="village" label="Village"
                    value={village}
                    onChange={setVillage}
                    options={villages as unknown as string[]}
                    placeholder={!cell ? "Select cell first" : loadVill ? "Loading…" : "Select village"}
                    disabled={!cell || loadVill}
                    error={geoErrors.village}
                  />

                  {/* Geo resolve status */}
                  {village && (
                    <div className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium",
                      resolvingGeo ? "bg-amber-50 text-amber-700"
                        : resolvedGeoId ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700",
                    )}>
                      {resolvingGeo
                        ? <><Loader2 className="size-3.5 animate-spin" /> Verifying location…</>
                        : resolvedGeoId
                        ? <><CheckCircle2 className="size-3.5" /> Location verified</>
                        : <><AlertCircle className="size-3.5" /> Location not found — check your selection</>
                      }
                    </div>
                  )}

                  {/* Facility ID (for health workers / admins) */}
                  {(roleData?.role === "HEALTH_WORKER" || roleData?.role === "FACILITY_ADMIN") && (
                    <div className="space-y-1.5">
                      <Label htmlFor="facilityId" className="text-[#163F42] font-medium text-sm">
                        Facility ID{" "}
                        <span className="font-normal text-[#8AA2A4]">(optional)</span>
                      </Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#8AA2A4]" />
                        <Input
                          id="facilityId"
                          placeholder="Enter your facility ID"
                          value={facilityId}
                          onChange={(e) => setFacilityId(e.target.value)}
                          className="h-10 pl-9 text-sm border-[#D0E8E4]"
                        />
                      </div>
                      <p className="text-[11px] text-[#8AA2A4]">
                        Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx — ask your facility admin.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-3">
                    <Button type="button" variant="outline" onClick={goBack} disabled={submitting} className="h-14 flex-1 rounded-xl border-[#D0E8E4] text-[#6D8587] text-base hover:bg-[#F8FBFA] transition-colors">
                      <ArrowLeft className="mr-2 size-5" /> Back
                    </Button>
                    <Button
                      type="button"
                      className="h-14 flex-[2] rounded-xl text-base font-bold text-white shadow-lg shadow-[#0B5554]/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                      style={{ backgroundColor: "#0B5554" }}
                      disabled={submitting || resolvingGeo || !resolvedGeoId}
                      onClick={submit}
                    >
                      {submitting
                        ? <><Loader2 className="mr-2 size-5 animate-spin" /> Creating…</>
                        : <><CheckCircle2 className="mr-2 size-5" /> Create account</>
                      }
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <p className="mt-5 text-center text-xs text-[#8AA2A4]">
            Already have an account?{" "}
            <a href="/login" className="text-[#0B5554] font-medium hover:underline">Sign in instead</a>
          </p>
        </div>
      </div>
    </div>
  );
}
