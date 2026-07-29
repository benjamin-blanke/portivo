"use client";

import { ReactNode, TextareaHTMLAttributes, InputHTMLAttributes } from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-neutral-700 mb-1.5">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-neutral-500 mt-1">{hint}</span> : null}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 " +
        (props.className ?? "")
      }
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={
        "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 " +
        (props.className ?? "")
      }
    />
  );
}

export function ColorInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#e5e5e5"}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-9 cursor-pointer rounded border border-neutral-300 bg-white p-1"
      />
      <TextInput value={value} onChange={(e) => onChange(e.target.value)} placeholder="#e5e5e5" />
    </div>
  );
}

export function ToggleField({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 text-sm font-medium text-neutral-700"
    >
      <span
        className={
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors " +
          (checked ? "bg-neutral-900" : "bg-neutral-300")
        }
      >
        <span
          className={
            "inline-block h-4.5 w-4.5 transform rounded-full bg-white transition-transform shadow " +
            (checked ? "translate-x-6" : "translate-x-1")
          }
        />
      </span>
      {label}
    </button>
  );
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost" }) {
  const styles: Record<string, string> = {
    primary: "bg-neutral-900 text-white hover:bg-neutral-700 disabled:bg-neutral-400",
    secondary: "bg-white text-neutral-900 border border-neutral-300 hover:bg-neutral-50",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
    ghost: "text-neutral-600 hover:bg-neutral-100",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    />
  );
}

export function SaveBar({
  onSave,
  saving,
  message,
  error,
}: {
  onSave: () => void;
  saving: boolean;
  message?: string | null;
  error?: string | null;
}) {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 mt-8 flex items-center justify-between rounded-xl border border-neutral-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
      <div className="text-sm">
        {error ? (
          <span className="text-red-600">{error}</span>
        ) : message ? (
          <span className="text-emerald-600">{message}</span>
        ) : (
          <span className="text-neutral-400">Unsaved changes are not published until you save.</span>
        )}
      </div>
      <Button onClick={onSave} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}

export function SectionCard({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
        {description ? <p className="mt-0.5 text-sm text-neutral-500">{description}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
