import Link from "next/link";
import { Heart, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const DISPLAY = "'Playfair Display', Georgia, serif";

type NavLink = { label: string; href: string; external?: boolean };

const NAV: Record<string, NavLink[]> = {
  Platform: [
    { label: "Prenatal Tracking", href: "#features" },
    { label: "Child Health Records", href: "#features" },
    { label: "Vaccination Schedule", href: "#features" },
    { label: "Smart Reminders", href: "#features" },
    { label: "Offline Mode", href: "#features" },
  ],
  "For You": [
    { label: "For Mothers", href: "#who-for" },
    { label: "For Health Workers", href: "#who-for" },
    { label: "For Facility Admins", href: "#who-for" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Our Impact", href: "#about" },
  ],
  Resources: [
    { label: "Help Center", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Contact Support", href: "#" },
    { label: "MoH Rwanda Portal", href: "#", external: true },
  ],
};

export default function FooterSection() {
  return (
    <footer
      className="relative overflow-hidden border-t border-[#D5E7E4]"
      style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F4F8F7 100%)" }}
    >
      {/* Top section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="group mb-5 flex items-center gap-3">
              {/* <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, #226D68, #5DCAA5)",
                  boxShadow: "0 4px 16px rgba(34,109,104,0.35)",
                }}
              >
                <Heart className="h-5 w-5 text-white" fill="white" />
              </div> */}
              <div>
                <p
                  className="text-[16px] font-black leading-none text-[#163F42]"
                  style={{ fontFamily: DISPLAY }}
                >
                  Motherhood Journey
                </p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5DCAA5]">
                  Maternal &amp; Child Health · Rwanda
                </p>
              </div>
            </Link>

            <p className="mb-6 max-w-xs text-[14px] font-normal leading-relaxed text-[#648386]">
              A unified digital health platform empowering mothers, health workers and communities
              across Rwanda to achieve better maternal and child health outcomes.
            </p>

            {/* Rwanda flag + affiliation */}
            {/* <div className="mb-6 flex items-center gap-2 rounded-2xl border border-[#D5E7E4] bg-[#F4F8F7] px-4 py-3">
              <span className="text-2xl">🇷🇼</span>
              <div>
                <p className="text-[12px] font-bold text-[#163F42]">Proudly Rwandan</p>
                <p className="text-[11px] font-normal text-[#648386]">Supported by Ministry of Health Rwanda</p>
              </div>
            </div> */}

            {/* Contact info */}
            <div className="flex flex-col gap-2.5">
              {[
                { icon: Mail,   text: "support@motherhoodjourney.rw" },
                { icon: Phone,  text: "+250 788 000 000" },
                { icon: MapPin, text: "Kigali, Rwanda" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0 text-[#226D68]" />
                  <span className="text-[13px] font-normal text-[#648386]">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(NAV).map(([group, links]) => (
            <div key={group}>
              <p className="mb-5 text-[11px] font-black uppercase tracking-[0.14em] text-[#163F42]">
                {group}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="inline-flex items-center gap-1 text-[13.5px] font-normal text-[#648386] transition-colors hover:text-[#226D68]"
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {label}
                      {external && <ExternalLink className="h-3 w-3 opacity-50" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#D5E7E4]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-[12.5px] font-normal text-[#648386]">
            © 2026 Motherhood Journey. All rights reserved. Built with{" "}
          </p>
          <div className="flex items-center gap-5">
            {["Privacy", "Terms", "Cookies", "Accessibility"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-[12px] font-semibold text-[#648386] transition-colors hover:text-[#226D68]"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
