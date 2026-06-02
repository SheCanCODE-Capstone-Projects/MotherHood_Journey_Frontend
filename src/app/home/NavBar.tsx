"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Features",    href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "For Mothers", href: "#who-for" },
  { label: "About",       href: "#about" },
];

export default function NavBar() {
  const [open,    setOpen]    = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className="pointer-events-auto w-full max-w-5xl rounded-2xl px-5 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(255,253,249,0.97)" : "rgba(255,255,255,0.75)",
          backdropFilter: "blur(24px) saturate(1.8)",
          border: `1.5px solid ${scrolled ? "rgba(34,109,104,0.22)" : "rgba(255,255,255,0.6)"}`,
          boxShadow: scrolled
            ? "0 8px 40px rgba(34,109,104,0.13), 0 1px 0 rgba(255,255,255,0.8) inset"
            : "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        {/* ── Main bar ── */}
        <div className="flex h-15.5 items-center justify-between">

          {/* Brand */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div>
              <p
                className="text-[14.5px] font-black leading-none tracking-tight text-[#163F42]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Motherhood Journey
              </p>
              <p className="mt-0.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[#5DCAA5]">
                Maternal &amp; Child Health · Rwanda
              </p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-6 lg:flex">
            {LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="group relative text-[13px] font-semibold text-[#648386] transition-colors hover:text-[#226D68]"
              >
                {label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 rounded-full bg-[#226D68] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/login"
              className="rounded-xl border-2 border-[#226D68]/35 px-4 py-2 text-[13px] font-bold text-[#226D68] transition-all hover:border-[#226D68]/70 hover:bg-[#226D68]/6 active:scale-95"
            >
              Log in
            </Link>
            <Link
              href="/login"
              className="rounded-xl px-5 py-2 text-[13px] font-bold text-white transition-all hover:brightness-110 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #226D68, #2D8A84)",
                boxShadow: "0 4px 14px rgba(34,109,104,0.35)",
              }}
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-xl p-2 text-[#163F42] transition hover:bg-[#EEF5F4] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        <div
          className="overflow-hidden transition-all duration-350 lg:hidden"
          style={{ maxHeight: open ? 380 : 0 }}
        >
          <div className="flex flex-col gap-2 border-t border-[#D5E7E4] py-4">
            {LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-[14px] font-semibold text-[#648386] transition hover:bg-[#EEF5F4] hover:text-[#226D68]"
              >
                {label}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <Link
                href="/login"
                className="flex-1 rounded-xl border-2 border-[#226D68] py-3 text-center text-sm font-bold text-[#226D68] transition hover:bg-[#226D68]/6"
              >
                Log in
              </Link>
              <Link
                href="/login"
                className="flex-1 rounded-xl py-3 text-center text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, #226D68, #2D8A84)" }}
              >
                Sign up free
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
