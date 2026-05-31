"use client";

import { useState, useEffect } from "react";

import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";
import { ROLE_LABELS } from "@/shared/config/rbac";
import type { UserRole } from "@/shared/types/auth";

const USER_ROLES: UserRole[] = [
  "patient",
  "health_worker",
  "facility_admin",
  "district_officer",
  "government",
];

const previewHighlights: Record<UserRole, string[]> = {
  patient: [
    "Track pregnancy progress",
    "Review upcoming appointments",
    "Check child follow-up records",
  ],
  health_worker: [
    "Manage registered mothers",
    "Record visit outcomes",
    "Review diagnosis queue",
  ],
  facility_admin: [
    "Monitor staff activity",
    "Review facility reports",
    "Track service coverage",
  ],
  district_officer: [
    "Inspect district analytics",
    "Compare facility performance",
    "Monitor key trends",
  ],
  government: [
    "Review national reports",
    "Monitor sync status",
    "Check ministry-wide summaries",
  ],
};

export default function HomePage() {
  const [previewRole, setPreviewRole] = useState<UserRole>("patient");

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__portalPreviewRole = previewRole;
      window.dispatchEvent(new CustomEvent("portal:preview-role", { detail: previewRole }));
    }
  }, [previewRole]);

  return (
    <div className="space-y-6">
        <PageHeader
          title="Shared Layout Preview"
          subtitle="This screen previews the Sidebar, TopBar, MobileNav, and PageHeader with role-aware navigation."
          action={
            <Button
              type="button"
              variant="outline"
              className="border-[#B9D8D5] bg-white text-[#24585B]"
              onClick={() => window.location.assign("/login")}
            >
              Open Login
            </Button>
          }
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D3234]/75 via-[#0D3234]/35 to-transparent" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <div className="max-w-lg">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white mb-3">
            <MapPin className="size-3" />
            Supporting Mothers Across Rwanda
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            Empowering Every{" "}
            <span className="text-[#7ECFD4]">Mother&apos;s Journey</span>{" "}
            in Rwanda
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/80 max-w-md">
            Comprehensive maternal health support, tracking, and resources
            for a healthier future. We bridge the gap between families and
            healthcare excellence.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[#1D5052] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#194D56] transition-colors shadow-lg">
              Join the Journey
              <ArrowRight className="size-4" />
            </Link>
            <a href="#portals" className="inline-flex items-center gap-2 rounded-full border border-white/60 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const PORTALS = [
  {
    icon: Baby,
    title: "For Mothers",
    description: "Track your pregnancy milestones, set appointment reminders, and access personalized health guidance in Kinyarwanda and English.",
    cta: "Start Journey ->",
    image: "/images/pregnantPic.png",
  },
  {
    icon: HeartPulse,
    title: "Health Workers",
    description: "Manage patient records, update vaccination and ANC visit data, and flag urgent health alerts from your community.",
    cta: "Manage Patients ->",
    image: "/images/doctors.jpg",
  },
  {
    icon: BarChart3,
    title: "District Officers",
    description: "Monitor district-level maternal health stats, track sector performance, and manage reports through advanced analytics.",
    cta: "View Reports ->",
    image: "/images/appointment-header.svg",
  },
];

function PortalsSection() {
  return (
    <section id="portals" className="py-10 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5B8784]">
            Our Platform
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[#1D5052]">
            Tailored Portals for the Community
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {PORTALS.map((portal) => {
            const Icon = portal.icon;
            return (
              <div key={portal.title} className="overflow-hidden rounded-2xl border border-[#D5E9E6] bg-[#F8FCFB] hover:-translate-y-1 hover:shadow-xl transition-all">
                <div className="relative h-32">
                  <Image
                    src={portal.image}
                    alt={portal.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D3234]/65 via-[#0D3234]/10 to-transparent" />
                  <div className="absolute bottom-3 left-4 w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center shadow-sm">
                    <Icon className="size-5 text-[#1D5052]" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[#1D5052] text-base mb-2">{portal.title}</h3>
                  <p className="text-xs leading-relaxed text-[#54797C] mb-3">{portal.description}</p>
                  <Link href="/login" className="text-xs font-semibold text-[#1F7280] hover:underline">
                    {portal.cta}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: CheckCircle2,
    title: "Local Integration",
    description: "Our system connects to all registered healthcare facilities, supporting all 30 districts.",
  },
  {
    icon: Activity,
    title: "Real-Time Coordination",
    description: "Direct communication lines between mothers and their nearest health facility.",
  },
];

function FeatureSection() {
  return (
    <section className="py-10 bg-[#F2F8F7]">
      <div className="max-w-6xl mx-auto px-6 grid gap-4 lg:grid-cols-2 items-center">
        <div className="relative w-full h-[420px] rounded-3xl overflow-hidden shadow-xl">
          <Image
            src="/images/doctors.jpg"
            alt="Healthcare Professional"
            fill
            loading="eager"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>

        {/* Text */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5B8784] mb-2">
            Our Mission
          </p>
          <h2 className="text-2xl font-bold text-[#1D5052] mb-3 leading-snug">
            Data-Driven, Human-Centered Health Support
          </h2>
          <p className="text-sm leading-relaxed text-[#54797C] mb-6">
            MotherHood Journey is more than a platform - it&apos;s a digital
            companion designed to ensure no Rwandan mother is left behind.
            By integrating Community Health Workers (CHWs) with advanced
            machine learning, we create a safety net that follows every
            mother throughout pregnancy and post-natal care.
          </p>
          <div className="space-y-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <Button
                  key={role}
                  type="button"
                  variant={isActive ? "default" : "outline"}
                  className={
                    isActive
                      ? "bg-[#2C6F73] text-white hover:bg-[#245C60]"
                      : "border-[#B9D8D5] bg-white text-[#24585B]"
                  }
                  onClick={() => {
                    if (role === "patient") {
                      window.location.assign(roleRoute);
                    } else {
                      setPreviewRole(role);
                    }
                  }}
                >
                  {ROLE_LABELS[role]}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactSection() {
  return (
    <section id="impact" className="py-10 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5B8784]">
              Care Network
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#1D5052]">
              Our Growing Impact in Rwanda
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#54797C]">
              Maternal care works best when families, community health workers,
              facilities, and district teams can see the same journey clearly.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="relative h-36 overflow-hidden rounded-2xl">
                <Image
                  src="/images/pregnantPic.png"
                  alt="Pregnant mother receiving support"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative h-36 overflow-hidden rounded-2xl">
                <Image
                  src="/images/doctors.jpg"
                  alt="Healthcare team"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">

          <div className="rounded-2xl bg-[#1D5052] p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Users className="size-4 text-white" />
              </div>
              <span className="text-[10px] font-semibold text-white/60 bg-white/10 rounded-full px-2 py-0.5">
                Nationwide
              </span>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">10,000+</p>
              <p className="text-xs font-semibold text-white mt-1">Mothers Supported</p>
              <p className="text-[11px] text-white/60 mt-1 leading-relaxed">
                Empowering women across all provinces.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#E2F2F5] p-5 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mb-3">
              <Activity className="size-4 text-[#1D5052]" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1D5052]">500+</p>
              <p className="text-xs font-semibold text-[#1D5052] mt-1">Active Health Centers</p>
              <p className="text-[11px] text-[#54797C] mt-1 leading-relaxed">
                Facilities coordinating care at district level.
              </p>
              <h2 className="mt-3 text-lg font-semibold text-[#1D5052]">
                {item}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#54797C]">
                This is simple placeholder content so you can see the layout
                components working in the interface before wiring feature pages.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#E2F2F5] p-5 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-[#1D5052]">Community-Led Growth</p>
              <p className="text-[11px] text-[#54797C] mt-2 leading-relaxed">
                Our network of 2,000+ CHWs ensures every family is accounted for.
              </p>
            </div>
            <div className="mt-3 flex items-center">
              {["#2C6F73", "#3A8F85", "#1F7280", "#2A7F8A"].map((color, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold -ml-1 first:ml-0"
                  style={{ backgroundColor: color }}
                >
                  {["A", "B", "C", "D"][i]}
                </div>
              ))}
              <div className="w-7 h-7 rounded-full border-2 border-white bg-[#1D5052] flex items-center justify-center text-white text-[9px] font-bold -ml-1">
                +2k
              </div>
            </div>
          </div>

          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="contact" className="py-10 bg-[#1D5052]">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          Ready to Start Your Journey with Us?
        </h2>
        <p className="text-sm text-white/70 mb-8 max-w-lg mx-auto">
          Whether you are an expectant mother or a healthcare provider, join
          the platform that is making a difference across Rwanda.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#1D5052] hover:bg-[#F2F8F7] transition-colors">
            Create Account
          </Link>
          <a href="mailto:support@motherhoodjourney.rw" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
            Contact Specialist
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#1D5052] border-t border-white/10 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-white text-sm">MotherHood Journey</p>
          <p className="text-xs text-white/50 mt-0.5">Supporting Rwandan Mothers and Dependants</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-white/50">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Contact Resources</a>
          <a href="#" className="hover:text-white transition-colors">Contact Us</a>
        </div>
        <p className="text-xs text-white/40">(c) 2026 MotherHood Journey</p>
      </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <PortalsSection />
        <FeatureSection />
        <ImpactSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
