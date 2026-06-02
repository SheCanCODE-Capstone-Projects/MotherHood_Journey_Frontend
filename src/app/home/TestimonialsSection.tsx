"use client";

import { useRef, useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import { useVisible } from "./hooks";

const DISPLAY = "'Playfair Display', Georgia, serif";

const TESTIMONIALS = [
  {
    name: "Uwimana Félicité",
    role: "Mother of 2",
    location: "Kigali, Rwanda",
    initials: "UF",
    color: "#226D68",
    bg: "rgba(34,109,104,0.12)",
    stars: 5,
    quote:
      "Motherhood Journey has completely transformed how I manage my children's health. I never miss a vaccination appointment and my health worker knows exactly where I am in my journey. It's like having a doctor in my pocket.",
    tag: "Prenatal Care",
  },
  {
    name: "Amahoro Grace",
    role: "First-time Mother",
    location: "Musanze, Rwanda",
    initials: "AG",
    color: "#5DCAA5",
    bg: "rgba(93,202,165,0.12)",
    stars: 5,
    quote:
      "I live in a rural area with limited internet access, but this app works beautifully offline. My health worker registered me at the clinic and now I track everything from my phone. The reminders have been a lifesaver for my ANC visits.",
    tag: "Offline Access",
  },
  {
    name: "Uwitonze Josiane",
    role: "Mother & CHW",
    location: "Huye, Rwanda",
    initials: "UJ",
    color: "#E8A03A",
    bg: "rgba(232,160,58,0.12)",
    stars: 5,
    quote:
      "As both a mother and a community health worker, I see the impact every day. Mothers in my village are attending more ANC visits because of the reminders. The platform genuinely saves lives I've seen it firsthand.",
    tag: "Health Worker",
  },
  {
    name: "Nyiransabimana Claudine",
    role: "Mother of 3",
    location: "Rubavu, Rwanda",
    initials: "NC",
    color: "#7B68EE",
    bg: "rgba(123,104,238,0.12)",
    stars: 5,
    quote:
      "My third pregnancy felt so different because I had all my records in one place. The nutrition tips in Kinyarwanda are incredibly helpful and my husband can also track our baby's growth. We love this platform.",
    tag: "Family Health",
  },
  {
    name: "Ingabire Providence",
    role: "Nurse, Kigali CHC",
    location: "Kicukiro, Kigali",
    initials: "IP",
    color: "#226D68",
    bg: "rgba(34,109,104,0.12)",
    stars: 5,
    quote:
      "Managing 200+ patients used to mean mountains of paper. Now I see every patient's status at a glance, send reminders with one tap, and log visits in seconds. The time I've saved goes directly into patient care.",
    tag: "Health Professional",
  },
];

export default function TestimonialsSection() {
  const ref     = useRef<HTMLElement>(null);
  const visible = useVisible(ref);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(id);
  }, []);

  const featured = TESTIMONIALS[active];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-28"
      style={{ background: "#FDF9F3" }}
    >
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #226D68, transparent)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #E8A03A, transparent)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          className="mb-16 text-center"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.75s ease" }}
        >
          <span
            className="inline-block rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#226D68]"
            style={{ background: "rgba(34,109,104,0.09)", border: "1px solid rgba(34,109,104,0.18)" }}
          >
            Real Stories
          </span>
          <h2
            className="mt-5 text-4xl font-black tracking-tight text-[#163F42] sm:text-5xl lg:text-6xl"
            style={{ fontFamily: DISPLAY }}
          >
            What Mothers Are Saying
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg font-normal text-[#648386]">
            Real experiences from real families across Rwanda changing lives one check-up at a time.
          </p>
        </div>

        {/* Featured testimonial */}
        <div
          className="mb-10"
          style={{
            // background: "white",
            // border: "2px solid rgba(34,109,104,0.12)",
            // boxShadow: "0 16px 56px rgba(34,109,104,0.1)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.75s ease 100ms, transform 0.75s ease 100ms",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Avatar column */}
            <div
              className="flex flex-col items-center justify-center gap-4 p-10 lg:col-span-2"
              // style={{ background: `linear-gradient(135deg, ${featured.bg}, transparent)` }}
            >
              <div
                key={featured.name}
                className="flex h-24 w-24 items-center justify-center rounded-full text-3xl font-black text-white"
                style={{
                  background: `linear-gradient(135deg, ${featured.color}, ${featured.color}bb)`,
                  boxShadow: `0 8px 28px ${featured.color}40`,
                  animation: "scaleIn 0.45s ease both",
                }}
              >
                {featured.initials}
              </div>
              <div className="text-center">
                <p className="text-[15px] font-black text-[#163F42]" style={{ fontFamily: DISPLAY }}>
                  {featured.name}
                </p>
                <p className="mt-0.5 text-[12px] font-semibold text-[#648386]">{featured.role}</p>
                <p className="mt-0.5 text-[11px] font-normal text-[#648386]">{featured.location}</p>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: featured.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#E8A03A] text-[#E8A03A]" />
                ))}
              </div>
              <span
                className="rounded-full px-3 py-1 text-[11px] font-bold"
                style={{ background: `${featured.color}15`, color: featured.color }}
              >
                {featured.tag}
              </span>
            </div>

            {/* Quote column */}
            <div className="flex flex-col justify-center gap-6 p-10 lg:col-span-3">
              <Quote
                className="h-12 w-12 opacity-15"
                style={{ color: featured.color }}
              />
              <blockquote
                key={featured.name + "-quote"}
                className="text-xl font-normal leading-relaxed text-[#163F42] sm:text-2xl"
                style={{
                  fontFamily: DISPLAY,
                  fontStyle: "italic",
                  animation: "fadeSlideUp 0.5s ease both",
                }}
              >
                &ldquo;{featured.quote}&rdquo;
              </blockquote>
            </div>
            
          </div>
        </div>


        {/* Mini testimonial grid */}
        
      </div>
    </section>
  );
}
