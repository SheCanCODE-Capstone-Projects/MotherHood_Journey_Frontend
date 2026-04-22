export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="flex flex-col items-center text-center gap-6 p-8">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-锌-50">
          MotherHood Journey
        </h1>
        <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          A digital platform connecting mothers, community health workers, nurses,
          and administrators to improve childhood vaccination compliance.
        </p>
        <div className="flex gap-4 mt-8">
          <a
            href="/login"
            className="rounded-full bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Go to Login
          </a>
        </div>
      </main>
    </div>
  );
}
