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
    <header className="flex flex-col gap-4 rounded-[2rem] border border-[#D5E9E6] bg-linear-to-r from-white via-[#F9FCFB] to-white p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="inline-flex items-center rounded-full bg-[#E6F5F2] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2C6F73]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-[#1D5052] sm:text-[2rem]">
          {title}
        </h1>
        {subtitle ? (
          <p className="max-w-3xl text-sm leading-6 text-[#54797C]">{subtitle}</p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
