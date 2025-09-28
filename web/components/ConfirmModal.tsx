"use client";

import { X } from "lucide-react";

export default function ConfirmDialog({
  open,
  title = "Confirm",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title?: string;
  message?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg text-center">
        
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
          <X className="h-6 w-6 text-rose-600" />
        </div>
        <div className="mb-2 text-lg font-semibold">{title}</div>
        <div className="mb-6 text-sm text-gray-700">{message}</div>
        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="rounded-md border px-4 py-2 text-sm hover:bg-slate-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
