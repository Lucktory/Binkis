"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QrImageProps {
  value: string;
  size?: number;
  className?: string;
  alt?: string;
}

export function QrImage({ value, size = 180, className, alt = "QR" }: QrImageProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: size,
      color: { dark: "#0B0D0F", light: "#FFFFFF" },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        className={className}
        style={{ width: size, height: size, backgroundColor: "#FFFFFF" }}
      />
    );
  }

  return (
    <img
      src={dataUrl}
      alt={alt}
      width={size}
      height={size}
      className={className}
    />
  );
}
