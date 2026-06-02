import Image from "next/image";

const ROW_ONE = [
  { src: "/images/hero-1.png",      caption: "Prenatal care at your fingertips" },
  { src: "/images/hero-2.png",      caption: "Mother & child health tracking" },
  { src: "/images/hero-3.png",      caption: "Healthy milestones for every child" },
  { src: "/images/hero-4.png",      caption: "Community-driven maternal support" },
];

const ROW_TWO = [
  { src: "/images/hero-5.png",      caption: "Nationwide coverage across Rwanda" },
  { src: "/images/doctors.jpg",     caption: "500+ certified health workers" },
  { src: "/images/hero-7.png",      caption: "Digital health for modern mothers" },
  { src: "/images/pregnantPic.png", caption: "Safe pregnancies, brighter futures" },
];

const ALL_ONE = [...ROW_ONE, ...ROW_ONE];
const ALL_TWO = [...ROW_TWO, ...ROW_TWO];

function GalleryCard({ src, caption }: { src: string; caption: string }) {
  return (
    <div className="relative shrink-0 overflow-hidden rounded-2xl" style={{ width: 300, height: 200 }}>
      <Image src={src} alt={caption} fill className="object-cover" sizes="300px" />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, transparent 35%, rgba(8,48,38,0.85) 100%)" }}
      />
      <p className="absolute bottom-3 left-3 right-3 text-[12px] font-semibold leading-snug text-white/95">
        {caption}
      </p>
    </div>
  );
}

export default function GallerySection() {
  return (
    <section
      className="overflow-hidden py-20"
      style={{ background: "linear-gradient(180deg, #EBF5F2 0%, #F4F8F7 100%)" }}
    >
      {/* Header */}
      <div className="mb-10 text-center">
        <span
          className="inline-block rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#226D68]"
          style={{ background: "rgba(34,109,104,0.09)", border: "1px solid rgba(34,109,104,0.18)" }}
        >
          Communities We Serve
        </span>
        <p
          className="mx-auto mt-3 max-w-lg text-[15px] font-normal text-[#648386]"
        >
          Trusted across every district — from Kigali City to rural communities throughout Rwanda.
        </p>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="mb-5 flex gap-5 will-change-transform" style={{ animation: "scrollLeft 28s linear infinite" }}>
        {ALL_ONE.map((item, i) => (
          <GalleryCard key={i} {...item} />
        ))}
      </div>

      {/* Row 2 — scrolls right */}
      <div className="flex gap-5 will-change-transform" style={{ animation: "scrollRight 32s linear infinite" }}>
        {ALL_TWO.map((item, i) => (
          <GalleryCard key={i} {...item} />
        ))}
      </div>
    </section>
  );
}
