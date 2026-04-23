import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-16">
      <section className="w-full max-w-md rounded-3xl border border-[#B4DDD9] bg-[#E7F7F5] p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2C6F73]">
          Access Restricted
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[#1D5052]">
          You are not authorized to view this page.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#256064]">
          Your account does not have the required role for this section.
        </p>
        <div className="mt-6">
          <Link
            href="/login"
            className="inline-flex rounded-xl bg-[#2C6F73] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
          >
            Return to login
          </Link>
        </div>
      </section>
    </main>
  );
}
