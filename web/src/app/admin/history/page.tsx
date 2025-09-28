"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

/** ชนิดข้อมูลที่ได้จาก API */
type AdminHistoryRow = {
  id: string;
  status: "RESERVED" | "CANCELED";
  createdAt: string;
  user: { id: string; name: string | null; email?: string };
  concert: { id: string; name: string };
};

export default function AdminHistoryPage() {
  const [rows, setRows] = useState<AdminHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get<AdminHistoryRow[]>("/reservations/admin/all");
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="w-full">
      <div className="w-full rounded-xl border bg-white p-4 shadow-sm sm:p-6">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="text-left">
                {["Date time", "Username", "Concert name", "Action"].map((h) => (
                  <th key={h} className="border-b p-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <>
                  <tr><td colSpan={4} className="p-3">
                    <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
                  </td></tr>
                  <tr><td colSpan={4} className="p-3">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                  </td></tr>
                </>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-slate-500">No history yet.</td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="p-3">{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="p-3">{r.user?.name ?? "—"}</td>
                    <td className="p-3">{r.concert?.name ?? "—"}</td>
                    <td className={`p-3 font-medium ${r.status === "RESERVED" ? "text-emerald-600" : "text-rose-600"}`}>
                      {r.status === "RESERVED" ? "Reserve" : "Cancel"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
