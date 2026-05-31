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
<<<<<<< HEAD
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between py-2">
=======
    <header className="flex flex-col gap-4 rounded-[8px] border border-[#D5E9E6] bg-white/90 p-5 shadow-[0_16px_40px_-32px_rgba(22,63,66,0.5)] backdrop-blur sm:flex-row sm:items-start sm:justify-between">
>>>>>>> main
      <div className="space-y-1">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
            {eyebrow}
          </p>
        ) : null}
<<<<<<< HEAD
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
=======
        <h1 className="text-2xl font-semibold tracking-tight text-[#163F42]">
>>>>>>> main
          {title}
        </h1>
        {subtitle ? (
          <p className="text-sm leading-6 text-gray-600">{subtitle}</p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
