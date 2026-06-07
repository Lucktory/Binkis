import { QrImage } from "./QrImage";

interface HologramCardProps {
  code: string;
  validationUrl: string;
  brandName: string;
  collectionNumber: string;
}

export function HologramCard({
  code,
  validationUrl,
  brandName,
  collectionNumber,
}: HologramCardProps) {
  return (
    <div className="relative mx-auto w-full max-w-[340px] overflow-hidden rounded-2xl border-2 border-ink-900 shadow-soft hologram-surface">
      <div className="absolute inset-0 opacity-30">
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="grid" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M 6 0 L 0 0 0 6" fill="none" stroke="#FFFFFF" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative flex flex-col items-center gap-3 p-6 text-white">
        <div className="flex w-full items-center justify-between text-[10px] uppercase tracking-widest text-white/70">
          <span>Edicion Limitada</span>
          <span>No.{collectionNumber}</span>
        </div>

        <div className="pixel-text mt-1 text-3xl font-bold tracking-wider text-yellow-300 drop-shadow-[0_2px_0_rgba(0,0,0,0.6)]">
          ¡GANASTE!
        </div>
        <div className="pixel-text text-[11px] uppercase tracking-widest text-white/80">
          Collectors Series
        </div>

        <div className="flex w-full items-center justify-center gap-4 py-2">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="8" width="12" height="3" fill="#FFE066" />
            <rect x="6" y="11" width="3" height="3" fill="#FFE066" />
            <rect x="15" y="11" width="3" height="3" fill="#FFE066" />
            <rect x="9" y="14" width="6" height="2" fill="#FFE066" />
            <rect x="9" y="10" width="2" height="1" fill="#0B0D0F" />
            <rect x="13" y="10" width="2" height="1" fill="#0B0D0F" />
          </svg>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="9" r="4" fill="#FFFFFF" />
            <rect x="9" y="12" width="6" height="6" fill="#FFFFFF" />
            <circle cx="10.5" cy="8.5" r="0.8" fill="#0B0D0F" />
            <circle cx="13.5" cy="8.5" r="0.8" fill="#0B0D0F" />
            <rect x="8" y="13" width="8" height="1" fill="#0B0D0F" />
          </svg>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="8" width="12" height="3" fill="#FF6B9D" />
            <rect x="6" y="11" width="3" height="3" fill="#FF6B9D" />
            <rect x="15" y="11" width="3" height="3" fill="#FF6B9D" />
            <rect x="9" y="14" width="6" height="2" fill="#FF6B9D" />
            <rect x="9" y="10" width="2" height="1" fill="#0B0D0F" />
            <rect x="13" y="10" width="2" height="1" fill="#0B0D0F" />
          </svg>
        </div>

        <div className="rounded-lg bg-white p-2 shadow-soft">
          <QrImage value={validationUrl} size={150} alt={`QR del codigo ${code}`} />
        </div>

        <div className="pixel-text text-[10px] uppercase tracking-widest text-white/80">
          {collectionNumber} piezas en el mundo
        </div>

        <div className="mt-1 w-full rounded border border-white/20 bg-black/30 px-3 py-1.5 text-center">
          <p className="text-[9px] uppercase tracking-widest text-white/60">Codigo</p>
          <p className="font-mono text-xs font-semibold tracking-wider text-white">{code}</p>
        </div>

        <div className="mt-1 flex w-full items-center justify-between text-[10px] uppercase tracking-widest text-white/70">
          <span>{brandName}</span>
          <div className="flex h-3 items-end gap-px">
            {Array.from({ length: 24 }, (_, i) => (
              <span
                key={i}
                className="block bg-white/70"
                style={{ width: i % 3 === 0 ? 2 : 1, height: i % 2 === 0 ? 12 : 8 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
