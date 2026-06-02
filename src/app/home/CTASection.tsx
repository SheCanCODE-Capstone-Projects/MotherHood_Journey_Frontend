"use client";

import { useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { useVisible } from "./hooks";

const DISPLAY = "'Playfair Display', Georgia, serif";

const TRUST_POINTS = [
  "Free forever for mothers",
  "No credit card required",
  "Works offline on mobile",
  "MoH Rwanda approved",
];

export default function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const visible = useVisible(ref);


  return (
    <section
      id="contact"
      ref={ref}
      className="relative overflow-hidden py-28"
      style={{
        background:
          "linear-gradient(150deg, #071e18 0%, #0B3D2E 45%, #163F42 80%, #1a4e50 100%)",
      }}
    >
      {/* Background radial glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(93,202,165,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 10%, rgba(232,160,58,0.07) 0%, transparent 40%)",
        }}
      />
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Large decorative circle */}
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, #5DCAA5, transparent 70%)",
          animation: "floatSlow 15s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, #E8A03A, transparent 70%)",
          animation: "float 12s ease-in-out infinite 2s",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="grid grid-rows-1 gap-14 lg:grid--12 lg:items-start"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          {/* LEFT: Hero content */}
          <div className="lg:row-span-6">
            <span
              className="inline-flex items-center rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5DCAA5]"
              style={{
                background: "rgba(93,202,165,0.12)",
                border: "1px solid rgba(93,202,165,0.22)",
              }}
            >
              Join Today It&apos;s Free
            </span>

            <h2
              className="mt-6 text-4xl font-black text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: DISPLAY, lineHeight: 1.05 }}
            >
              Start Your <span style={{ color: "#5DCAA5" }}>Journey</span> Today
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-white/65">
              Join over <strong className="text-white">10,000 mothers</strong>{" "}
              already using Motherhood Journey to track, manage and improve
              maternal and child health across Rwanda.
            </p>

            {/* TRUST (moved under hero for better hierarchy) */}
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
              {TRUST_POINTS.map((pt) => (
                <div key={pt} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#5DCAA5]" />
                  <span className="text-[13px] font-medium text-white/80">
                    {pt}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Conversion panel */}
          
        </div>
      </div>
    </section>
  );
}
