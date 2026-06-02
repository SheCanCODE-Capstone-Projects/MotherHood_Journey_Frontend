"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn, getSession } from "next-auth/react";
import {
  Eye, EyeOff, Phone, Lock, AlertCircle, Heart,
  ShieldCheck, Users, Activity, ArrowRight, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/shared/components/ui/card";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";

/* ── Role → dashboard route ───────────────────────────────────── */
const ROLE_ROUTE: Record<string, string> = {
  HEALTH_WORKER:      "/hw-dashboard",
  FACILITY_ADMIN:     "/facility-dashboard",
  DISTRICT_OFFICER:   "/district-dashboard",
  GOVERNMENT_ANALYST: "/national-dashboard",
  MOH_ADMIN:          "/national-dashboard",
  PATIENT:            "/dashboard",
  health_worker:      "/hw-dashboard",
  facility_admin:     "/facility-dashboard",
  district_officer:   "/district-dashboard",
  government:         "/national-dashboard",
  patient:            "/dashboard",
};

/* ── Zod schema ───────────────────────────────────────────────── */
const schema = z.object({
  phoneNumber: z
    .string()
    .min(9, "Enter a valid phone number")
    .regex(/^[+\d][\d\s\-()]{7,}$/, "Enter a valid phone number"),
  password: z.string().min(4, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

/* ── Brand panel features ─────────────────────────────────────── */
const FEATURES = [
  { icon: Heart,       text: "Track maternal and child health outcomes" },
  { icon: ShieldCheck, text: "Secure, role-based access to patient data" },
  { icon: Users,       text: "Coordinated care across facilities" },
  { icon: Activity,    text: "Real-time health monitoring & analytics" },
];

/* ── Brand / left panel (static, no router hooks) ─────────────── */
function BrandPanel() {
  return (
    <div
      className="relative hidden lg:flex lg:w-[55%] flex-col justify-between overflow-hidden px-16 py-12"
      style={{ background: "linear-gradient(145deg, #094544 0%, #0B5554 45%, #113638 100%)" }}
    >
      {/* Decorative rings with subtle animation */}
      <div className="pointer-events-none absolute -top-32 -left-32 size-[500px] rounded-full border border-white/5 animate-pulseRing" />
      <div className="pointer-events-none absolute -top-12 -left-12 size-[280px] rounded-full border border-white/[0.08] animate-rotate-slow" />
      <div className="pointer-events-none absolute bottom-[-10%] -right-[15%] size-[600px] rounded-full border border-white/[0.04]" />
      <div className="pointer-events-none absolute -bottom-20 right-20 size-[300px] rounded-full border border-white/[0.06] animate-rotate-slow" style={{ animationDirection: "reverse" }} />
      <div className="pointer-events-none absolute top-1/4 right-1/4 size-[200px] rounded-full bg-white/[0.03] blur-3xl" />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-[10px] bg-white/20 backdrop-blur-sm text-sm font-bold text-white ring-1 ring-white/30">
          MS
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
            Maternal
          </p>
          <p className="text-base font-bold text-white leading-none">Sanctuary</p>
        </div>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col gap-10">
        {/* Illustration */}
        <div className="flex justify-center">
          <div className="relative size-64 xl:size-80">
            <Image
              src="/images/hero-illustration.svg"
              alt="Maternal health illustration"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        <div className="animate-fadeSlideUp" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
          <h1 className="font-heading text-4xl xl:text-5xl font-bold text-white leading-[1.15] tracking-tight">
            Empowering maternal<br />health through care
          </h1>
          <p className="mt-4 text-[17px] text-white/80 leading-relaxed max-w-md font-light">
            A unified platform connecting health workers, facilities, and district
            officers to deliver better outcomes for mothers and children.
          </p>

          <ul className="mt-10 space-y-4">
            {FEATURES.map(({ icon: Icon, text }, i) => (
              <li key={text} className="flex items-center gap-4 animate-fadeSlideUp" style={{ animationDelay: `${200 + i * 100}ms`, animationFillMode: "both" }}>
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/10 backdrop-blur-md border border-white/5 shadow-inner">
                  <Icon className="size-4.5 text-white/90" />
                </span>
                <span className="text-[15px] text-white/90 font-medium tracking-wide">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <p className="relative z-10 text-xs text-white/35">
        Ministry of Health — Rwanda &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
}

/* ── The actual form — uses useSearchParams, must be in Suspense ─ */
function LoginForm() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl");

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { phoneNumber: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setAuthError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        phoneNumber: values.phoneNumber.replace(/\s/g, ""),
        password: values.password,
        redirect: false,
      });

      if (!result?.ok || result.error) {
        setAuthError("Invalid phone number or password. Please try again.");
        toast.error("Sign in failed", {
          description: "Check your credentials and try again.",
        });
        return;
      }

      toast.success("Signed in successfully");

      if (callbackUrl) {
        window.location.replace(callbackUrl);
        return;
      }

      // Retry once — session cookie can take a moment to propagate on Railway
      let session = await getSession();
      if (!session?.user?.role) {
        await new Promise((r) => setTimeout(r, 600));
        session = await getSession();
      }
      const role = session?.user?.role as string | undefined;
      const destination = (role && ROLE_ROUTE[role]) ?? "/patient/dashboard";
      window.location.replace(destination);
    } catch {
      setAuthError("Something went wrong. Please try again.");
      toast.error("Network error", { description: "Could not reach the server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full lg:w-[45%] items-center justify-center bg-[#F4F8F7] px-6 py-12">
      <div className="w-full max-w-sm">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="grid size-9 place-items-center rounded-[8px] bg-[#0B5554] text-sm font-bold text-white">
            MS
          </div>
          <p className="text-base font-bold text-[#163F42]">Motherhood Journey</p>
        </div>

        <Card className="border border-[#E4EFED] shadow-[0_20px_60px_-15px_rgba(11,85,84,0.1)] bg-white/90 backdrop-blur-xl rounded-3xl">
          <CardHeader className="pb-4 pt-8 px-8">
            <div className="mb-2">
              <Badge
                className="rounded-full px-3 py-1 text-xs font-semibold border-0 tracking-wide uppercase"
                style={{ backgroundColor: "#EAF4F2", color: "#0B5554" }}
              >
                Secure portal
              </Badge>
            </div>
            <CardTitle className="text-3xl font-bold text-[#163F42] tracking-tight">
              Welcome back
            </CardTitle>
            <CardDescription className="text-[15px] text-[#6D8587] mt-1.5">
              Sign in to your Motherhood Journey account
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {authError && (
                <Alert className="border-red-200 bg-red-50 text-red-700 py-3">
                  <AlertCircle className="size-4 shrink-0" />
                  <AlertDescription className="text-xs leading-snug">
                    {authError}
                  </AlertDescription>
                </Alert>
              )}

              {/* Phone number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-[#163F42] font-semibold text-[15px]">
                  Phone number
                </Label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#8AA2A4] group-focus-within:text-[#0B5554] transition-colors" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+250 7XX XXX XXX"
                    autoComplete="tel"
                    className={cn(
                      "h-14 pl-12 text-[15px] rounded-xl border-[#D0E8E4] bg-[#F8FBFA] hover:bg-white focus-visible:bg-white focus-visible:border-[#0B5554] focus-visible:ring-4 focus-visible:ring-[#0B5554]/10 transition-all",
                      errors.phoneNumber &&
                        "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20",
                    )}
                    {...register("phoneNumber")}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#163F42] font-semibold text-[15px]">
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#8AA2A4] group-focus-within:text-[#0B5554] transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={cn(
                      "h-14 pl-12 pr-12 text-[15px] rounded-xl border-[#D0E8E4] bg-[#F8FBFA] hover:bg-white focus-visible:bg-white focus-visible:border-[#0B5554] focus-visible:ring-4 focus-visible:ring-[#0B5554]/10 transition-all",
                      errors.password &&
                        "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20",
                    )}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8AA2A4] hover:text-[#0B5554] transition-colors"
                  >
                    {showPassword
                      ? <EyeOff className="size-5" />
                      : <Eye className="size-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Submit */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-14 w-full rounded-xl text-base font-bold text-white shadow-lg shadow-[#0B5554]/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: "#0B5554" }}
                >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 size-5" />
                  </>
                )}
                </Button>
              </div>
            </form>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#E4EFED]" />
              <span className="text-[11px] text-[#8AA2A4]">secured by</span>
              <div className="h-px flex-1 bg-[#E4EFED]" />
            </div>
            <p className="mt-3 text-center text-[11px] text-[#9BAEB0] leading-relaxed">
              Ministry of Health Rwanda · All data encrypted in transit
            </p>
          </CardContent>
        </Card>

        <p className="mt-5 text-center text-xs text-[#8AA2A4]">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-[#0B5554] font-medium hover:underline">
            Create one
          </a>
        </p>
        <p className="mt-2 text-center text-xs text-[#8AA2A4]">
          Having trouble?{" "}
          <span className="text-[#0B5554] font-medium cursor-pointer hover:underline">
            Contact your facility admin
          </span>
        </p>
      </div>
    </div>
  );
}

/* ── Page export — wraps the form in Suspense (Next.js requirement) */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <BrandPanel />
      <Suspense
        fallback={
          <div className="flex w-full lg:w-[45%] items-center justify-center bg-[#F4F8F7]">
            <Loader2 className="size-8 animate-spin text-[#0B5554]" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
