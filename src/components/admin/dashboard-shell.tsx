"use client";

import { useState } from "react";
import { Sidebar } from "@/components/admin/sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-100 md:flex">
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-neutral-800 bg-black px-4 py-3 md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="rounded p-1.5 text-white hover:bg-neutral-900"
          aria-label="Open menu"
        >
          ☰
        </button>
        <span className="text-sm font-semibold text-white">Admin panel</span>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <Sidebar open={open} onClose={() => setOpen(false)} />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 md:px-8 md:py-10">{children}</div>
      </main>
    </div>
  );
}
