import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  eyebrow?: string;
};

export function PageHeader({
  title,
  subtitle,
  action,
  eyebrow,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-[#D5E9E6] bg-linear-to-r from-white via-[#F8FCFB] to-white p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5B8784]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-[#1D5052]">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-sm leading-6 text-[#54797C]">{subtitle}</p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
