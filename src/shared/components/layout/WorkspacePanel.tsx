import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type WorkspacePanelProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  summary: string;
  highlights: string[];
  sidebarTitle: string;
  sidebarCopy: string;
  sidebarStats: Array<{ label: string; value: string }>;
  primaryAction: { label: string; href: string };
  secondaryAction: { label: string; href: string };
  accent: string;
  border: string;
  text: string;
};

export function WorkspacePanel({
  eyebrow,
  title,
  subtitle,
  summary,
  highlights,
  sidebarTitle,
  sidebarCopy,
  sidebarStats,
  primaryAction,
  secondaryAction,
  accent,
  border,
  text,
}: WorkspacePanelProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
      <article
        className="rounded-[2rem] border bg-white p-6 shadow-sm"
        style={{ borderColor: border }}
      >
        <p
          className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]"
          style={{ backgroundColor: `${accent}18`, color: text }}
        >
          {eyebrow}
        </p>

        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#1D5052]">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#54797C]">
          {subtitle}
        </p>

        <div
          className="mt-6 rounded-[1.5rem] p-5"
          style={{ backgroundColor: `${accent}10` }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
            Overview
          </p>
          <p className="mt-2 text-sm leading-6 text-[#1D5052]">{summary}</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {highlights.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-[#D5E9E6] bg-[#FBFEFD] p-4"
            >
              <div
                className="grid size-7 shrink-0 place-items-center rounded-full text-white"
                style={{ backgroundColor: accent }}
              >
                <CheckCircle2 className="size-4" />
              </div>
              <p className="text-sm leading-6 text-[#1D5052]">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={primaryAction.href}
            className="inline-flex h-11 items-center gap-2 rounded-2xl px-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: accent }}
          >
            {primaryAction.label}
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href={secondaryAction.href}
            className="inline-flex h-11 items-center justify-center rounded-2xl border px-4 text-sm font-semibold transition-transform hover:-translate-y-0.5"
            style={{ borderColor: border, color: text, backgroundColor: "white" }}
          >
            {secondaryAction.label}
          </Link>
        </div>
      </article>

      <aside
        className="space-y-4 rounded-[2rem] border bg-white p-5 shadow-sm"
        style={{ borderColor: border }}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5B8784]">
            {sidebarTitle}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#54797C]">{sidebarCopy}</p>
        </div>

        <div className="grid gap-3">
          {sidebarStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-[#D5E9E6] bg-[#FBFEFD] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
                {stat.label}
              </p>
              <p className="mt-2 text-xl font-semibold text-[#1D5052]">{stat.value}</p>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}