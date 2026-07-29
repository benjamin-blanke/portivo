"use client";

import { ReactNode } from "react";
import { Button } from "./form";

interface RepeaterProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
  itemLabel: (item: T, index: number) => string;
  addLabel?: string;
  emptyLabel?: string;
}

export function Repeater<T>({
  items,
  onChange,
  createItem,
  renderItem,
  itemLabel,
  addLabel = "Add item",
  emptyLabel = "Nothing here yet.",
}: RepeaterProps<T>) {
  function update(index: number, patch: Partial<T>) {
    const next = items.slice();
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = items.slice();
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {items.length === 0 ? <p className="text-sm text-neutral-400">{emptyLabel}</p> : null}

      {items.map((item, index) => (
        <details
          key={index}
          className="group rounded-lg border border-neutral-200 bg-neutral-50 open:bg-white"
          open={items.length <= 3}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5">
            <span className="flex items-center gap-2 text-sm font-medium text-neutral-800">
              <svg
                className="h-3.5 w-3.5 text-neutral-400 transition-transform group-open:rotate-90"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
              {itemLabel(item, index) || `Item ${index + 1}`}
            </span>
            <span className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="rounded p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 disabled:opacity-30"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                className="rounded p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 disabled:opacity-30"
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
                aria-label="Remove"
              >
                ✕
              </button>
            </span>
          </summary>
          <div className="space-y-3 border-t border-neutral-200 px-3 py-3">
            {renderItem(item, (patch) => update(index, patch), index)}
          </div>
        </details>
      ))}

      <Button type="button" variant="secondary" onClick={() => onChange([...items, createItem()])}>
        + {addLabel}
      </Button>
    </div>
  );
}
