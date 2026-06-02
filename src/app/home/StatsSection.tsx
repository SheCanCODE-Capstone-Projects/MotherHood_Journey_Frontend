"use client";

import { useRef } from "react";
import { useVisible, useCounter } from "./hooks";
import { TrendingUp, Users, Building2, Baby } from "lucide-react";

const DISPLAY = "'Playfair Display', Georgia, serif";

const STATS = [
  {
    icon: Users,
    value: 10000,
    suffix: "+",
    label: "Mothers Enrolled",
    sub: "Across all 30 districts of Rwanda",
    bar: 82,
    color: "#5DCAA5",
  },
  {
    icon: TrendingUp,
    value: 500,
    suffix: "+",
    label: "Health Workers",
    sub: "Certified practitioners nationwide",
    bar: 65,
    color: "#5DCAA5",
  },
  {
    icon: Baby,
    value: 98,
    suffix: "%",
    label: "ANC Compliance",
    sub: "National average industry-leading",
    bar: 98,
    color: "#5DCAA5",
  },
  {
    icon: Building2,
    value: 50,
    suffix: "+",
    label: "Partner Facilities",
    sub: "Community health centers enrolled",
    bar: 58,
    color: "#5DCAA5",
  },
];

function StatCard({ stat, started, delay }: { stat: typeof STATS[0]; started: boolean; delay: number }) {
  const n = useCounter(stat.value, started);

  return (
    <div
      className="flex flex-col gap-5 rounded-3xl p-8"
      style={{
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.06)",
        opacity: started ? 1 : 0,
        transform: started ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
      }}
    >
      
      <div>
        <p
          className="text-5xl font-black tracking-tight text-black sm:text-6xl"
          style={{ fontFamily: DISPLAY }}
        >
          {n.toLocaleString()}
          <span style={{ color: stat.color }}>{stat.suffix}</span>
        </p>
        <p className="mt-2 text-sm font-bold uppercase tracking-widest" style={{ color: stat.color }}>
          {stat.label}
        </p>
        <p className="mt-1 text-[13px] font-normal text-black/50">{stat.sub}</p>
      </div>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const visible = useVisible(ref);

  return (
    <section
      id="about"
      ref={ref}
      className="relative overflow-hidden py-24"
      // style={{ background: "linear-gradient(135deg, #071e18 0%, #0B3D2E 40%, #163F42 70%, #1A4E50 100%)" }}
    >
      {/* Background texture: radial glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 15% 55%, rgba(93,202,165,0.09) 0%, transparent 52%), radial-gradient(ellipse at 85% 20%, rgba(232,160,58,0.07) 0%, transparent 45%)",
        }}
      />
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div
          className="mb-16 text-center"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.75s ease, transform 0.75s ease" }}
        >
          <span
            className="inline-block rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-black/70"
            style={{ background: "rgba(93,202,165,0.12)", border: "1px solid rgba(93,202,165,0.22)" }}
          >
            Our Impact
          </span>
          <h2
            className="mt-5 text-4xl font-black text-black sm:text-5xl lg:text-6xl"
            style={{ fontFamily: DISPLAY }}
          >
            Trusted Numbers,{" "}
            <span style={{ color: "#5DCAA5" }}>Real Lives</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg font-normal text-black/55">
            Building healthier communities one family at a time across every district of Rwanda.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map((s, i) => (
            <StatCard key={s.label} stat={s} started={visible} delay={i * 110} />
          ))}
        </div>

        {/* Bottom tagline */}
        <p
          className="mt-14 text-center text-sm font-semibold text-black/30"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 1s ease 600ms" }}
        >
          Data updated in real time · Verified by Ministry of Health Rwanda
        </p>
      </div>
    </section>
  );
}
