import Link from "next/link";
import { ArrowLeft, LockKeyhole, ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#eefaf8_0%,_#ffffff_45%,_#f6fbfb_100%)] px-6 py-16">
      <section className="w-full max-w-lg rounded-[2rem] border border-[#DDEFEB] bg-white/90 p-8 text-center shadow-[0_20px_60px_rgba(17,64,63,0.08)] backdrop-blur">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#F2FAF9] text-[#1D5551]">
          <LockKeyhole className="size-8" />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#5B8784]">Access restricted</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#11403F]">
          You are not authorized to view this page.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#54797C]">
          Your account does not have the required role for this section. If you think this is a mistake, go back to the login screen.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1D5551] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#154844]"
          >
            <ArrowLeft className="size-4" />
            Return to login
          </Link>
          <div className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DDEFEB] px-4 py-2.5 text-sm font-semibold text-[#11403F]">
            <ShieldAlert className="size-4 text-[#1D5551]" />
            Role protected
          </div>
        </div>
      </section>
    </main>
  );
}
