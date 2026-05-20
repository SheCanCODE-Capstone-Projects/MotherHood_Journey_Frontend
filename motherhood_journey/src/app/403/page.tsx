import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          403
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Access denied
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your account is signed in, but it does not have permission to open
          this page.
        </p>
        <div className="mt-6">
          <Link
            href="/login"
            className="inline-flex rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
