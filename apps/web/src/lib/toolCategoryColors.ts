const COLORS: { bg: string; text: string }[] = [
  { bg: 'bg-purple-100', text: 'text-purple-700' },
  { bg: 'bg-blue-100', text: 'text-blue-700' },
  { bg: 'bg-rose-100', text: 'text-rose-700' },
  { bg: 'bg-amber-100', text: 'text-amber-700' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { bg: 'bg-sky-100', text: 'text-sky-700' },
];

export function categoryColor(category: string) {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}
