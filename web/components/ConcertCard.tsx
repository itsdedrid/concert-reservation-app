import { Users } from "lucide-react";

export type Concert = {
  id: string;
  name: string;
  description: string;
  totalSeats: number;
};

export default function ConcertCard({
  concert,
  right,
}: {
  concert: Concert;
  right?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h3 className="text-xl font-semibold text-blue-600">{concert.name}</h3>
      <p className="mt-2 text-sm text-slate-700 leading-relaxed">
        {concert.description}
      </p>

      <hr className="my-3" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Users/>
          <span>{concert.totalSeats.toLocaleString()}</span>
        </div>

        {right}
      </div>
    </div>
  );
}
