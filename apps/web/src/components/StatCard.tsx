import { LucideIcon } from 'lucide-react';

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <div className="bg-white rounded-xl2 p-6 shadow-sm border border-black/5 flex items-center justify-between">
      <div>
        <p className="text-sm text-black/50">{label}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
      <div className="w-11 h-11 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
        <Icon size={22} strokeWidth={1.75} />
      </div>
    </div>
  );
}
