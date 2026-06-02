"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronRight, Clock, CheckCircle } from "lucide-react";
import { useVisible } from "./hooks";

const DISPLAY = "'Playfair Display', Georgia, serif";

const STEPS = [
  {
    n: "01",
    badge: "Free & instant",
    badgeIcon: Clock,
    title: "Register & Connect",
    desc: "Create your free profile and link instantly to your nearest health facility. Takes under 3 minutes no credit card, no paperwork required.",
    detail:
      "Supports Kinyarwanda, French and English. Works on any smartphone.",
    image: "/images/hero-2-updated.png",
    accentColor: "#226D68",
    bgColor: "rgba(34,109,104,0.08)",
    outcome: "Profile created in 3 min",
  },
  {
    n: "02",
    badge: "Step-by-step",
    badgeIcon: CheckCircle,
    title: "Track Your Journey",
    desc: "Log every ANC visit, vaccination record and health metric through guided workflows built for mobile even when you're offline.",
    detail: "Smart reminders ensure you never miss a critical appointment.",
    image: "/images/pregnantPic.png",
    accentColor: "#5DCAA5",
    bgColor: "rgba(93,202,165,0.08)",
    outcome: "100% visit compliance",
  },
  {
    n: "03",
    badge: "24/7 available",
    badgeIcon: Clock,
    title: "Get Expert Support",
    desc: "Receive personalized reminders, timely alerts and communicate directly with your assigned healthcare provider from anywhere in Rwanda.",
    detail: "Your health worker is just one message away always.",
    image: "/images/doctors.jpg",
    accentColor: "#E8A03A",
    bgColor: "rgba(232,160,58,0.08)",
    outcome: "Expert care on demand",
  },
];

export default function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null);
  const visible = useVisible(ref);

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative overflow-hidden py-28"
      style={{ background: "#FDF9F3" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          className="mb-16 text-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.75s ease, transform 0.75s ease",
          }}
        >
          <span
            className="inline-block rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#226D68]"
            style={{
              background: "rgba(34,109,104,0.09)",
              border: "1px solid rgba(34,109,104,0.18)",
            }}
          >
            How It Works
          </span>
          <h2
            className="mt-5 text-4xl font-black tracking-tight text-[#163F42] sm:text-5xl lg:text-6xl"
            style={{ fontFamily: DISPLAY }}
          >
            Three Simple Steps
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-normal text-[#648386]">
            Get started in minutes and access quality maternal and child
            healthcare across every district of Rwanda.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            {STEPS.slice(0, 2).map(
              (
                {
                  n,
                  badge,
                  title,
                  desc,
                  detail,
                  image,
                  accentColor,
                  bgColor,
                  outcome,
                },
                idx,
              ) => (
                <div
                  key={n}
                  className="group overflow-hidden rounded-[32px] bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  style={{
                    border: `1.5px solid ${accentColor}20`,
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(40px)",
                    transition: `all .8s ease ${idx * 150}ms`,
                  }}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div
                      className="relative md:w-[38%]"
                      style={{
                        minHeight: 260,
                        background: bgColor,
                      }}
                    >
                      <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, transparent 40%, rgba(0,0,0,.45) 100%)",
                        }}
                      />

                      <div
                        className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black text-white"
                        style={{
                          background: accentColor,
                        }}
                      >
                        {n}
                      </div>

                      <span
                        className="absolute right-5 top-5 rounded-full px-4 py-2 text-xs font-bold text-white"
                        style={{
                          background: "rgba(0,0,0,.35)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        {badge}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-8 lg:p-10">
                      <h3
                        className="text-3xl font-black text-[#163F42]"
                        style={{ fontFamily: DISPLAY }}
                      >
                        {title}
                      </h3>

                      <p className="mt-4 text-[15px] leading-relaxed text-[#648386]">
                        {desc}
                      </p>

                      <div
                        className="mt-5 rounded-2xl p-4"
                        style={{
                          background: bgColor,
                        }}
                      >
                        <p
                          className="text-sm font-semibold"
                          style={{ color: accentColor }}
                        >
                          {detail}
                        </p>
                      </div>

                      <div className="mt-auto pt-6">
                        <p
                          className="mb-4 text-sm font-bold"
                          style={{ color: accentColor }}
                        >
                          {outcome}
                        </p>

                        <Link
                          href="/login"
                          className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:gap-4"
                          style={{ color: accentColor }}
                        >
                          Get Started
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Right Vertical Card */}
          <div>
            {(() => {
              const step = STEPS[2];

              return (
                <div
                  className="group flex h-full flex-col overflow-hidden rounded-[32px] bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  style={{
                    border: `1.5px solid ${step.accentColor}20`,
                    minHeight: "100%",
                  }}
                >
                  {/* Image */}
                  <div
                    className="relative h-80"
                    style={{
                      background: step.bgColor,
                    }}
                  >
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent 30%, rgba(0,0,0,.55) 100%)",
                      }}
                    />

                    <div
                      className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black text-white"
                      style={{
                        background: step.accentColor,
                      }}
                    >
                      {step.n}
                    </div>

                    <span
                      className="absolute right-5 top-5 rounded-full px-4 py-2 text-xs font-bold text-white"
                      style={{
                        background: "rgba(0,0,0,.35)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      {step.badge}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-8">
                    <h3
                      className="text-3xl font-black text-[#163F42]"
                      style={{ fontFamily: DISPLAY }}
                    >
                      {step.title}
                    </h3>

                    <p className="mt-4 text-[15px] leading-relaxed text-[#648386]">
                      {step.desc}
                    </p>

                    <div
                      className="mt-5 rounded-2xl p-4"
                      style={{
                        background: step.bgColor,
                      }}
                    >
                      <p
                        className="text-sm font-semibold"
                        style={{
                          color: step.accentColor,
                        }}
                      >
                        {step.detail}
                      </p>
                    </div>

                    <div className="mt-auto pt-8">
                      <p
                        className="mb-4 text-sm font-bold"
                        style={{
                          color: step.accentColor,
                        }}
                      >
                        {step.outcome}
                      </p>

                      <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:gap-4"
                        style={{
                          color: step.accentColor,
                        }}
                      >
                        Get Started
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}
