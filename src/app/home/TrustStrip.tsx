import { Award, Lock, MapPin, TrendingUp, Shield, Globe, Users, Star, Heart, Zap } from "lucide-react";

const ITEMS = [
  { icon: Award,      label: "MoH Rwanda Approved",     color: "#E8A03A" },
  { icon: Lock,       label: "GDPR Compliant",           color: "#226D68" },
  { icon: MapPin,     label: "Nationwide Coverage",      color: "#5DCAA5" },
  { icon: TrendingUp, label: "98% ANC Compliance",       color: "#226D68" },
  { icon: Shield,     label: "End-to-End Encryption",    color: "#7B68EE" },
  { icon: Globe,      label: "Works Fully Offline",      color: "#5DCAA5" },
  { icon: Users,      label: "500+ Health Workers",      color: "#226D68" },
  { icon: Star,       label: "50+ Partner Facilities",   color: "#E8A03A" },
  { icon: Heart,      label: "10,000+ Mothers Served",   color: "#EF6F6C" },
  { icon: Zap,        label: "Real-Time Sync",           color: "#226D68" },
];

const ALL = [...ITEMS, ...ITEMS];

export default function TrustStrip() {
  return (
    <div className="overflow-hidden border-y border-[#D5E7E4] bg-white p-4">
      <div
        className="flex will-change-transform"
        style={{ animation: "marqueeLeft 38s linear infinite" }}
      >
        {ALL.map(({ icon: Icon, label, color }, i) => (
          <div key={i} className="mx-7 flex shrink-0 items-center gap-2.5">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
              style={{ background: `${color}18` }}
            >
              <Icon className="h-3.5 w-3.5" style={{ color }} />
            </div>
            <span className="whitespace-nowrap text-[12.5px] font-semibold text-[#163F42]">{label}</span>
            <span className="mx-1 h-1 w-1 rounded-full bg-[#D5E7E4]" />
          </div>
        ))}
      </div>
    </div>
  );
}
