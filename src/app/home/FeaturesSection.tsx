"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  Heart, Baby, Shield, Activity, Bell, Smartphone, FileText, Users,
  ArrowRight,
} from "lucide-react";
import { useVisible } from "./hooks";

const DISPLAY = "'Playfair Display', Georgia, serif";

const HERO_FEATURE = {
  title: "Complete Pregnancy Tracking",
  desc: "From your very first ANC visit to postpartum recovery every milestone, every measurement, every appointment in one beautifully organised timeline. Share instantly with your health worker.",
  image: "/images/hero-8-updated.png",
  tags: ["ANC Visits", "Fetal Growth", "Vital Signs", "Lab Results"],
};

const FEATURES = [
  {
    icon: Baby,
    title: "Child Health Records",
    desc: "Immunisation history, growth charts and developmental milestones — one secure shareable place.",
    accent: "#226D68",
    bg: "rgba(34,109,104,0.1)",
    tag: "Popular",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    desc: "Enterprise-grade encryption with full consent controls. Your health data, your rules entirely.",
    accent: "#5DCAA5",
    bg: "rgba(93,202,165,0.1)",
    tag: null,
  },
  {
    icon: Activity,
    title: "Live Health Monitoring",
    desc: "Instant alerts and direct updates from your assigned healthcare team. Always in the loop.",
    accent: "#7B68EE",
    bg: "rgba(123,104,238,0.1)",
    tag: null,
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    desc: "Never miss a check-up. Automated reminders for every ANC visit and scheduled vaccination.",
    accent: "#E8A03A",
    bg: "rgba(232,160,58,0.1)",
    tag: null,
  },
  {
    icon: Smartphone,
    title: "Works Fully Offline",
    desc: "Complete functionality without internet. Syncs automatically the moment you reconnect.",
    accent: "#226D68",
    bg: "rgba(34,109,104,0.1)",
    tag: "Key Feature",
  },
  {
    icon: FileText,
    title: "Digital Health Records",
    desc: "All medical history, reports and documents accessible anywhere, anytime forever.",
    accent: "#5DCAA5",
    bg: "rgba(93,202,165,0.1)",
    tag: null,
  },
  {
    icon: Users,
    title: "Multi-Role Access",
    desc: "Seamlessly connects mothers, health workers, facility admins and government officials.",
    accent: "#7B68EE",
    bg: "rgba(123,104,238,0.1)",
    tag: null,
  },
  {
    icon: Heart,
    title: "Personalised Health Insights",
    desc: "Actionable tips and insights tailored to your unique pregnancy journey.",
    accent: "#E8A03A",
    bg: "rgba(232,160,58,0.1)",
    tag: "New",
  },  
];

export default function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const visible = useVisible(ref);

  return (
    <section id="features" ref={ref} className="bg-white py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div
          className="mb-14 flex flex-col items-center gap-5 text-center"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.75s ease, transform 0.75s ease" }}
        >
          <span
            className="inline-block rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#226D68]"
            style={{ background: "rgba(34,109,104,0.09)", border: "1px solid rgba(34,109,104,0.18)" }}
          >
            Platform Features
          </span>
          <h2
            className="text-4xl font-black tracking-tight text-[#163F42] sm:text-5xl lg:text-6xl"
            style={{ fontFamily: DISPLAY }}
          >
            Everything You Need
          </h2>
          <p className="max-w-2xl text-lg font-normal text-[#648386]">
            Purpose-built tools for mothers, health workers and community health centres across Rwanda.
            Designed for real-world conditions.
          </p>
        </div>

        {/* Hero feature card — full width */}
        <div
          className="group mb-6 overflow-hidden rounded-3xl"
          style={{
            border: "2px solid rgba(34,109,104,0.15)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.7s ease 100ms, transform 0.7s ease 100ms",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image half */}
            <div className="relative overflow-hidden" style={{ minHeight: 320 }}>
              <Image
                src={HERO_FEATURE.image}
                alt={HERO_FEATURE.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(135deg, rgba(34,109,104,0.65) 0%, rgba(22,63,66,0.3) 100%)" }}
              />
              {/* Heart icon overlay */}
              
            </div>

            {/* Text half */}
            <div className="flex flex-col justify-center gap-5 bg-[#F4F8F7] p-9 lg:p-12">
              <div className="flex items-center gap-2">
                <span
                  className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#226D68]"
                  style={{ background: "rgba(34,109,104,0.12)" }}
                >
                  Core Feature
                </span>
              </div>
              <h3
                className="text-2xl font-black text-[#163F42] sm:text-3xl"
                style={{ fontFamily: DISPLAY }}
              >
                {HERO_FEATURE.title}
              </h3>
              <p className="text-[15px] font-normal leading-relaxed text-[#648386]">{HERO_FEATURE.desc}</p>
              <div className="flex flex-wrap gap-2">
                {HERO_FEATURE.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-3 py-1 text-[12px] font-semibold text-[#226D68]"
                    style={{ background: "rgba(34,109,104,0.1)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href="/login"
                className="inline-flex w-fit items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
                style={{ background: "linear-gradient(135deg, #226D68, #2D8A84)" }}
              >
                Explore Feature <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc, accent, bg, tag }, idx) => (
            <div
              key={title}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-white p-6 transition-all duration-350 hover:-translate-y-1 hover:shadow-xl"
              style={{
                border: "1.5px solid #EEF5F4",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
                transition: `opacity 0.65s ease ${200 + idx * 65}ms, transform 0.65s ease ${200 + idx * 65}ms, box-shadow 0.3s ease`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = `${accent}40`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${accent}18`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#EEF5F4";
                (e.currentTarget as HTMLElement).style.boxShadow = "";
              }}
            >
              {tag && (
                <span
                  className="absolute right-4 top-4 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest"
                  style={{ background: `${accent}18`, color: accent }}
                >
                  {tag}
                </span>
              )}
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: bg }}
              >
                <Icon className="h-5 w-5" style={{ color: accent }} />
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#163F42]">{title}</p>
                <p className="mt-1.5 text-[13px] font-normal leading-relaxed text-[#648386]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
