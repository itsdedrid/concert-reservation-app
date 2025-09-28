"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ConcertCard, { Concert } from "@/components/ConcertCard";
import Toast from "@/components/Toast";

type MyRes = { id: string; concertId: string; status: "RESERVED" | "CANCELED" };

export default function UserPage() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [reservedIds, setReservedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);

  const userId = "user-1";

  const load = async () => {
    setLoading(true);
    try {
      const [cRes, rRes] = await Promise.all([
        api.get<Concert[]>("/concerts"),
        api.get<MyRes[]>(`/reservations/me/${userId}`),
      ]);
      setConcerts(cRes.data);
      const active = rRes.data
        .filter((r) => r.status === "RESERVED")
        .map((r) => r.concertId);
      setReservedIds(new Set(active));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const reserve = async (concertId: string) => {
    try {
      await api.post("/reservations", { userId, concertId });
      await load();
      setToast({ msg: "Reserve successfully", type: "success" });
    } catch (e: any) {
      setToast({ msg: e?.message || "Reserve failed", type: "error" });
    }
  };

  const cancel = async (concertId: string) => {
    try {
      const res = await api.get<MyRes[]>(`/reservations/me/${userId}`);
      const mine = res.data.find((r) => r.concertId === concertId && r.status === "RESERVED");
      if (!mine) return;
      await api.delete(`/reservations/${mine.id}`, { data: { userId } });
      await load();
      setToast({ msg: "Cancel successfully", type: "success" });
    } catch {
      setToast({ msg: "Cancel failed", type: "error" });
    }
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <>
          <div className="h-40 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-40 animate-pulse rounded-xl bg-slate-200" />
        </>
      ) : concerts.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-center text-sm text-slate-600">
          No concerts available.
        </div>
      ) : (
        concerts.map((c) => {
          const isReserved = reservedIds.has(c.id);
          return (
            <ConcertCard
              key={c.id}
              concert={c}
              right={
                <button
                  onClick={() => (isReserved ? cancel(c.id) : reserve(c.id))}
                  className={`rounded-md px-4 py-2 text-sm text-white ${
                    isReserved ? "bg-rose-500 hover:bg-rose-600" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isReserved ? "Cancel" : "Reserve"}
                </button>
              }
            />
          );
        })
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
