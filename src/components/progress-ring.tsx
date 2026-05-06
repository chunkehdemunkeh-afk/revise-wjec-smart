interface Props {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  label?: string;
}

export function ProgressRing({ value, size = 72, stroke = 8, label }: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, value)) / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" strokeWidth={stroke} fill="none" className="text-white/10" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          className="text-primary transition-all duration-500"
        />
      </svg>
      <span className="absolute text-sm font-semibold">{label ?? `${Math.round(value)}%`}</span>
    </div>
  );
}
