interface DonutProps {
  value: number;
  size?: number;
  thickness?: number;
  trackColor?: string;
  color?: string;
  className?: string;
}

export function Donut({
  value,
  size = 56,
  thickness = 6,
  trackColor = "#E8EBEF",
  color = "#0B1220",
  className,
}: DonutProps) {
  const normalized = Math.min(Math.max(value, 0), 1);
  const radius = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * normalized;
  const gap = circumference - dash;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} aria-hidden>
      <circle cx={cx} cy={cy} r={radius} stroke={trackColor} strokeWidth={thickness} fill="none" />
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={color}
        strokeWidth={thickness}
        fill="none"
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={circumference / 4}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    </svg>
  );
}
