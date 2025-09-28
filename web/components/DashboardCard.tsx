import { UserRound, BookmarkCheck, XCircle } from "lucide-react";

export default function DashboardCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: number | string;
  tone: "blue" | "green" | "red";
}) {
  const toneCls =
    tone === "blue"
      ? "bg-blue-600"
      : tone === "green"
      ? "bg-emerald-600"
      : "bg-rose-600";
  const Icon =
    tone === "blue" ? UserRound : tone === "green" ? BookmarkCheck : XCircle;

  return (
    <div
      className={`${toneCls} text-white rounded-xl p-5 shadow-sm flex flex-col items-center justify-center text-center`}
    >
      {/* Icon ตรงกลางด้านบน */}
      <Icon className="h-10 w-10 mb-3 text-white/90" />

      {/* Title */}
      <span className="text-sm text-white/90">{title}</span>

      {/* Value */}
      <div className="mt-1 text-4xl font-bold leading-none">{value}</div>
    </div>
  );
}
