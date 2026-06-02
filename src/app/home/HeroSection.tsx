"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Play, ChevronDown } from "lucide-react";

const DISPLAY = "'Playfair Display', Georgia, serif";

const SLIDES = [
  {
    src: "/images/hero-1.png",
    caption: "Supporting mothers every step of the way",
  },
  {
    src: "/images/doctors.jpg",
    caption: "Expert healthcare professionals at your side",
  },
  {
    src: "/images/hero-3.png",
    caption: "Tracking child health milestones with ease",
  },
  {
    src: "/images/pregnantPic.png",
    caption: "Safe pregnancies, healthy futures",
  },
  { src: "/images/hero-5.png", caption: "Community-driven maternal care" },
  { src: "/images/hero-7.png", caption: "Modern tools for modern mothers" },
];

const CYCLING_WORDS = [
  "Pregnancy",
  "Postpartum",
  "Child's Growth",
  "ANC Journey",
];

const BULLETS = [
  "Free to register · immediate access",
  "Works fully offline on any mobile",
  "Ministry of Health Rwanda approved",
  "Available in Kinyarwanda & English",
];

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

export default function HeroSection() {
  const [slide, setSlide] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  // defer mounting state to avoid synchronous setState during render
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setInterval(
      () => setSlide((s) => (s + 1) % SLIDES.length),
      5000,
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % CYCLING_WORDS.length);
        setWordVisible(true);
      }, 320);
    }, 2900);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative flex items-center w-full">
      {/* ── Background slideshow ── */}
      <div className="absolute inset-0">
        {/* Layered overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(110deg, rgba(8,48,38,0.97) 0%, rgba(11,61,46,0.92) 38%, rgba(11,61,46,0.70) 58%, rgba(22,63,66,0.45) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, transparent 40%, rgba(8,48,38,0.65) 100%)",
          }}
        />
      </div>

      {/* ── Main content grid ── */}
      <div className="relative z-10 mx-auto w-full max-w-12xl px-4 pb-16 pt-28 sm:px-6 md:px-8 lg:px-8 lg:pt-28">
        <div className="grid grid-cols-1 gap-12 md:p-24 lg:grid-cols-2 lg:items-center xl:gap-20">
          {/* ────── LEFT: Headline + copy ────── */}
          <div
            className="flex flex-col gap-7"
            style={{ animation: mounted ? "fadeSlideUp 1s ease both" : "none" }}
          >
            {/* Live badge */}
            <div
              className="inline-flex w-fit items-center gap-2.5 rounded-full px-4 py-2"
              style={{
                background: "rgba(93,202,165,0.14)",
                border: "1.5px solid rgba(93,202,165,0.32)",
                animation: mounted ? "fadeSlideUp 0.8s ease both" : "none",
              }}
            >
              <span className="relative flex h-2.5 w-2.5">
                {/* <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5DCAA5] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#5DCAA5]" /> */}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5DCAA5]">
                Rwanda Maternal &amp; Child Health Platform
              </span>
            </div>

            {/* BIG headline with cycling word */}
            <div
              style={{
                lineHeight: 1.06,
                letterSpacing: "-0.025em",
                perspective: "600px",
              }}
            >
              <h1
                className="block text-5xl font-black text-white sm:text-6xl lg:text-[60px] xl:text-[72px]"
                style={{ fontFamily: DISPLAY }}
              >
                Your Complete
              </h1>

              {/* Cycling word */}
              <h1
                className="block text-5xl font-black sm:text-6xl lg:text-[60px] xl:text-[72px]"
                style={{
                  fontFamily: DISPLAY,
                  color: "#5DCAA5",
                  minHeight: "1.14em",
                  opacity: wordVisible ? 1 : 0,
                  transform: wordVisible
                    ? "translateY(0) rotateX(0deg)"
                    : "translateY(-14px) rotateX(15deg)",
                  transition: "opacity 0.32s ease, transform 0.38s ease",
                  display: "block",
                  textShadow: "0 0 48px rgba(93,202,165,0.35)",
                }}
              >
                {CYCLING_WORDS[wordIdx]}
              </h1>

              <h1
                className="block text-5xl font-black text-white sm:text-6xl lg:text-[60px] xl:text-[72px]"
                style={{ fontFamily: DISPLAY }}
              >
                Health Journey
              </h1>
            </div>

            {/* Slide caption */}
            <div
              key={slide}
              className="flex items-center gap-3"
              style={{ animation: "fadeSlideUp 0.55s ease both" }}
            >
              {/* <span className="h-px w-10 shrink-0 bg-[#5DCAA5]" /> */}
              <p className="text-md font-semibold italic text-[#5DCAA5]/90">
                {SLIDES[slide].caption}
              </p>
            </div>

            <p className="max-w-lg text-lg font-normal leading-relaxed text-white/78 sm:text-[19px]">
              A unified digital health platform connecting mothers, healthcare
              workers and community centers for better maternal &amp; child
              outcomes across Rwanda.
            </p>

            {/* Bullets */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {BULLETS.map((b, i) => (
                <div
                  key={b}
                  className="flex items-start gap-2.5"
                  style={{
                    animation: mounted
                      ? `fadeSlideUp 0.75s ease ${300 + i * 100}ms both`
                      : "none",
                  }}
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#5DCAA5]" />
                  <span className="text-[14px] font-semibold text-white/82">
                    {b}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/login"
                className="group relative flex items-center gap-2.5 overflow-hidden rounded-2xl px-7 py-4 text-[15px] font-bold text-white transition-all active:scale-95 hover:brightness-110"
                style={{
                  background: "linear-gradient(135deg, #226D68, #2D8A84)",
                  boxShadow: "0 8px 32px rgba(34,109,104,0.45)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free{" "}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              <a
                href="#how-it-works"
                className="flex items-center gap-2.5 rounded-2xl border-2 border-white/25 px-7 py-4 text-[15px] font-bold text-white/90 transition-all hover:border-white/40 hover:bg-white/10"
              >
                <Play className="h-4 w-4 fill-white/80" /> How It Works
              </a>
            </div>
          </div>

          {/* ────── RIGHT: Image collage ────── */}
          <div
            className="relative hidden lg:block"
            style={{
              animation: mounted ? "fadeSlideLeft 1.1s ease 0.2s both" : "none",
            }}
          >
            {/* Main large image */}
            <div
              className="relative overflow-hidden rounded-3xl"
              style={{
                height: 420,
                border: "2px solid rgba(255,255,255,0.12)",
                boxShadow:
                  "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06) inset",
              }}
            >
              <Image
                src="/images/hero-1-updated.png"
                alt="Maternal care in Rwanda"
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width:1280px) 50vw, 600px"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 45%, rgba(8,48,38,0.88) 100%)",
                }}
              />
            </div>

            {/* Two smaller images below */}
            <div
              className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
              style={{
                boxShadow:
                  "0 20px 50px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                {/* Search Input */}
                <div className="relative flex-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                    />
                  </svg>

                  <input
                    type="text"
                    placeholder="Search mothers, health workers, appointments..."
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-14 pr-4 text-sm text-white placeholder:text-white/40 focus:border-[#5DCAA5]/50 focus:outline-none focus:ring-4 focus:ring-[#5DCAA5]/10"
                  />
                </div>

                {/* Filter */}
                <select className="h-14 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm text-white focus:border-[#5DCAA5]/50 focus:outline-none focus:ring-4 focus:ring-[#5DCAA5]/10">
                  <option className="text-black">All Status</option>
                  <option className="text-black">Active</option>
                  <option className="text-black">Pending</option>
                  <option className="text-black">Completed</option>
                </select>

                {/* Search Button */}
                <button
                  className="group flex h-14 items-center justify-center gap-2 rounded-2xl px-7 font-semibold text-white transition-all hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, #226D68, #2D8A84)",
                    boxShadow: "0 10px 30px rgba(34,109,104,0.35)",
                  }}
                >
                  Search
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* Quick Filters */}
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Pregnant Mothers",
                  "Appointments",
                  "Health Workers",
                  "Vaccinations",
                  "ANC Visits",
                ].map((item) => (
                  <button
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 transition hover:border-[#5DCAA5]/40 hover:bg-[#5DCAA5]/10 hover:text-[#5DCAA5]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Gold badge — floats on right edge */}
          </div>
        </div>
      </div>
    </section>
  );
}
