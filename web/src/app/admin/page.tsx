"use client";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import DashboardCard from "@/components/DashboardCard";
import { Tabs } from "@/components/Tabs";
import Toast from "@/components/Toast";
import ConcertCard, { Concert } from "@/components/ConcertCard";
import { Label, TextArea, TextInput } from "@/components/Input";
import ConfirmDialog from "@/components/ConfirmModal";
import { Users, Trash2, Save } from "lucide-react";

type Summary = { totalSeats: number; reserve: number; cancel: number };

export default function AdminHome() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [summary, setSummary] = useState<Summary>({ totalSeats: 0, reserve: 0, cancel: 0 });
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);
  const [confirm, setConfirm] = useState<{ open: boolean; target?: Concert }>({ open: false });

  const load = async () => {
    setLoading(true);
    try {
      const [cRes, sRes] = await Promise.all([
        api.get("/concerts"),
        api.get("/reservations/admin/summary"),
      ]);
      setConcerts(cRes.data);
      setSummary(sRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async (form: { name:string; totalSeats:number; description:string }) => {
    try {
      await api.post('/concerts', form);
      await load();
      setToast({ msg: 'Create successfully', type: 'success' });
    } catch (e:any) {
      setToast({ msg: e.message || 'Create failed', type: 'error' });
    }
  };

  const askDelete = (c: Concert) => setConfirm({ open: true, target: c });
  const doDelete = async () => {
    if (!confirm.target) return;
    try {
      await api.delete(`/concerts/${confirm.target.id}`);
      await load();
      setToast({ msg: "Delete successfully", type: "success" });
    } catch {
      setToast({ msg: "Delete failed", type: "error" });
    } finally {
      setConfirm({ open: false, target: undefined });
    }
  };

  const fallbackTotal = useMemo(
    () => concerts.reduce((s, c) => s + c.totalSeats, 0),
    [concerts]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <DashboardCard title="Total of seats" value={summary.totalSeats ?? fallbackTotal} tone="blue" />
        <DashboardCard title="Reserve" value={summary.reserve ?? 0} tone="green" />
        <DashboardCard title="Cancel" value={summary.cancel ?? 0} tone="red" />
      </div>

      <Tabs
        tabs={[
          {
            label: "Overview",
            content: (
              <div className="space-y-4">
                {loading ? (
                  <>
                    <div className="h-32 animate-pulse rounded-xl bg-slate-200" />
                    <div className="h-32 animate-pulse rounded-xl bg-slate-200" />
                  </>
                ) : concerts.length === 0 ? (
                  <div className="rounded-xl border bg-white p-6 text-center text-sm text-slate-600">
                    No concerts yet.
                  </div>
                ) : (
                  concerts.map((c) => (
                    <ConcertCard
                    key={c.id}
                    concert={c}
                    right={
                      <button
                        onClick={() => askDelete(c)}
                        className="flex items-center gap-2 rounded-md bg-rose-600 px-3 py-2 text-sm text-white hover:bg-rose-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    }
                  />
                  ))
                )}
              </div>
            ),
          },
          {
            label: "Create",
            content: <CreateForm onSubmit={create} />,
          },
        ]}
      />

      <ConfirmDialog
        open={confirm.open}
        title="Are you sure to delete?"
        message={`"${confirm.target?.name}" will be removed.`}
        confirmText="Yes, Delete"
        onConfirm={doDelete}
        onCancel={() => setConfirm({ open: false })}
      />

      {toast && <Toast message={toast.msg} type={toast.type} />}
    </div>
  );
}

function CreateForm({
  onSubmit,
}: {
  onSubmit: (f: { name: string; totalSeats: number; description: string }) => void;
}) {
  const [name, setName] = useState("");
  const [totalSeats, setTotalSeats] = useState<string>("");
  const [desc, setDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totalNum = Number(totalSeats);
  const valid = name.trim().length > 0 && Number.isFinite(totalNum) && totalNum >= 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    await onSubmit({ name: name.trim(), totalSeats: totalNum, description: desc.trim() });
    setName("");
    setTotalSeats("");
    setDesc("");
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-2xl font-semibold text-blue-600">Create</h3>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label>Concert Name</Label>
          <TextInput
            placeholder="Please input concert name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label>Total of seat</Label>
          <div className="relative">
            <TextInput
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="0"
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
              className="pr-9"
            />
            <Users className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <Label>Description</Label>
        <TextArea
          rows={4}
          placeholder="Please input description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>
      <div className="mt-6 flex justify-end gap-2">
          <button
          className={`flex items-center gap-2 rounded-md px-5 py-2 text-sm text-white whitespace-nowrap ${
            valid ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-300 cursor-not-allowed"
          }`}
          type="submit"
          disabled={!valid || submitting}
        >
          <Save className="h-4 w-4" />
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
