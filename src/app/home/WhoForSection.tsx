"use client";

import { useRef } from "react";
import { useVisible } from "./hooks";

const DISPLAY = "'Playfair Display', Georgia, serif";

const PERSONAS = [
  {
    label: "Expectant Mothers",
    headline: "Your pregnancy, beautifully tracked",
    desc: "From first ANC visit to delivery and beyond your entire health journey in one safe, private place that's always with you.",
    image: "/images/hero-4.png",
    benefits: [
      "ANC visit scheduling & reminders",
      "Pregnancy milestone tracker",
      "Vaccination schedule for baby",
      "Nutritional tips & health guides",
      "Direct line to your health worker",
    ],
    cta: "Register as a Mother",
    href: "/login",
    gradient: "linear-gradient(135deg, #226D68 0%, #2D8A84 100%)",
    accentBg: "rgba(93,202,165,0.12)",
    accentText: "#5DCAA5",
    stat: "8,400+ mothers",
  },
  {
    label: "Health Workers",
    headline: "Manage hundreds of patients with ease",
    desc: "Streamlined workflows so you spend less time on paperwork and more time delivering quality care to every mother you serve.",
    image: "/images/doctors.jpg",
    benefits: [
      "Full patient list with health status",
      "Quick-log ANC visits & diagnoses",
      "Push notifications to mothers",
      "Offline sync for remote areas",
      "Vaccination schedule management",
    ],
    cta: "Health Worker Login",
    href: "/login",
    gradient: "linear-gradient(135deg, #163F42 0%, #226D68 100%)",
    accentBg: "rgba(34,109,104,0.12)",
    accentText: "#5DCAA5",
    featured: true,
    stat: "500+ health workers",
  },
  {
    label: "Facility Admins",
    headline: "Run your facility with full visibility",
    desc: "Data-driven insights and operational tools to keep your health centre performing at its very best every day.",
    image: "/images/hero-6.png",
    benefits: [
      "Real-time facility KPI dashboard",
      "Staff management & scheduling",
      "Service request workflows",
      "District-level reporting",
      "Government data sync",
    ],
    cta: "Admin Portal",
    href: "/login",
    gradient: "linear-gradient(135deg, #E8A03A 0%, #C8821A 100%)",
    accentBg: "rgba(232,160,58,0.12)",
    accentText: "#E8A03A",
    stat: "50+ facilities",
  },
];

export default function WhoForSection() {
  const ref = useRef<HTMLElement>(null);
  const visible = useVisible(ref);

  return (
    <section
      id="who-for"
      ref={ref}
      className="relative overflow-hidden py-28"
      style={{ background: "linear-gradient(160deg, #071e18 0%, #0B3D2E 50%, #163F42 100%)" }}
    >
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "26px 26px" }}
      />
      {/* Radial glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(93,202,165,0.08) 0%, transparent 55%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          className="mb-16 text-center"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.75s ease, transform 0.75s ease" }}
        >
          <span
            className="inline-block rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5DCAA5]"
            style={{ background: "rgba(93,202,165,0.12)", border: "1px solid rgba(93,202,165,0.22)" }}
          >
            Who Is It For
          </span>
          <h2
            className="mt-5 text-4xl font-black text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: DISPLAY }}
          >
            Built For{" "}
            <span style={{ color: "#5DCAA5" }}>Everyone</span>
            {" "}In The Journey
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg font-normal text-white/58">
            Whether you&apos;re an expecting mother, a caring health worker, or a facility administrator we built this for you.
          </p>
        </div>

        {/* Persona cards */}
        <div className="grid grid-cols-1 gap-20 md:grid-cols-3">
  {PERSONAS.map(
    (
      {
        label,
        headline,
        desc,
        benefits,
        cta,
        href,
        accentBg,
        accentText,
        stat,
      },
      idx
    ) => {
      const alignment =
        idx === 0
          ? "md:text-left md:justify-self-start"
          : idx === 1
          ? "md:text-center md:justify-self-center"
          : "md:text-right md:justify-self-end";

      return (
        <div key={label} className={`w-full max-w-md ${alignment}`}>
          {/* Featured label */}
          
          {/* Label */}
          <div
            className="text-md font-bold uppercase tracking-[0.14em]"
            style={{ color: accentText }}
          >
            {label}
          </div>

          {/* Headline */}
          <h3 className="mt-8 text-2xl font-bold leading-snug text-white">
            {headline}
          </h3>

          {/* Description */}
          <p className="mt-3 text-md leading-relaxed text-white/70">
            {desc}
          </p>

          {/* Stat */}
          <div
            className="mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-semibold"
            style={{ background: accentBg, color: accentText }}
          >
            {stat} on the platform
          </div>

          {/* Benefits */}
          <ul className="mt-5 space-y-2">
            {benefits.map((b) => (
              <li
                key={b}
                className="text-sm text-white/80"
                style={{
                  textAlign:
                    idx === 0 ? "left" : idx === 1 ? "center" : "right",
                }}
              >
                • {b}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="mt-6">
            <a
              href={href}
              className="text-sm font-semibold underline underline-offset-4 transition hover:opacity-80"
              style={{ color: accentText }}
            >
              {cta}
            </a>
          </div>
        </div>
      );
    }
  )}
</div>
      </div>
    </section>
  );
}
