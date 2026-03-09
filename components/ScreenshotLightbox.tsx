"use client";
import { useEffect } from "react";
import Image from "next/image";

interface Props {
  url: string;
  alt: string;
  onClose: () => void;
}

export default function ScreenshotLightbox({ url, alt, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={onClose}>
      <div className="flex items-start gap-2" onClick={(e) => e.stopPropagation()}>
        <div className="relative" style={{ maxWidth: "calc(90vw - 2.5rem)", maxHeight: "90vh", width: "900px", height: "506px" }}>
          <Image src={url} alt={alt} fill className="object-contain" />
        </div>
        <button onClick={onClose} className="flex-shrink-0 text-white/70 hover:text-white text-2xl leading-none">×</button>
      </div>
    </div>
  );
}
