type Props = { title: string; value: number | string; color?: 'blue' | 'green' | 'red' };

export default function StatCard({ title, value, color = 'blue' }: Props) {
  const colorMap = {
    blue: 'bg-blue-700',
    green: 'bg-emerald-600',
    red: 'bg-rose-600',
  } as const;
  return (
    <div className={`${colorMap[color]} text-white rounded-xl p-6 shadow`}>
      <div className="opacity-90 text-sm mb-2">{title}</div>
      <div className="text-5xl font-semibold leading-none">{value}</div>
    </div>
  );
}
