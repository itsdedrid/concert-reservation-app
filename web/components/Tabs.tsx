"use client";
import { useState } from "react";

export function Tabs({
  tabs,
  initial = 0,
}: {
  tabs: { label: string; content: React.ReactNode }[];
  initial?: number;
}) {
  const [idx, setIdx] = useState(initial);
  return (
    <div>
      <div className="mb-4 flex gap-6 overflow-x-auto border-b">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setIdx(i)}
            className={`-mb-px border-b-2 px-1 pb-2 text-sm font-medium
              ${i === idx ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-blue-600"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>{tabs[idx].content}</div>
    </div>
  );
}
