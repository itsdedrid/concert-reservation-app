"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";

export default function Toast({
  message,
  type = "success",
  duration = 2500,
  onClose,
}: {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}) {
  const [open, setOpen] = useState(true);
  const Icon = type === "success" ? CheckCircle2 : type === "error" ? XCircle : Info;

  useEffect(() => {
    setOpen(true);
    const t = setTimeout(() => {
      setOpen(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(t);
  }, [message, type, duration, onClose]);

  if (!open) return null;

  const bg =
    type === "success" ? "bg-emerald-600"
    : type === "error" ? "bg-rose-600"
    : "bg-slate-700";

  return (
    <div className="fixed right-4 top-4 z-50">
      <div className={`${bg} text-white rounded-md px-4 py-2 shadow flex items-center gap-2`}>
        <Icon className="h-5 w-5 text-white" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
