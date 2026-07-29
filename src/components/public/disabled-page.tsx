export function DisabledPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
      <div className="max-w-md">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">Website unavailable</p>
        <h1 className="mt-4 text-2xl font-semibold">This website is temporarily disabled</h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-400">
          The owner of this website has paused it, most likely due to an outstanding payment. Please check back
          later, or contact the site owner for more information.
        </p>
      </div>
    </main>
  );
}
