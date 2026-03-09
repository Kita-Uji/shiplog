"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ShipCard from "@/components/ShipCard";
import DeleteShipDialog from "@/components/DeleteShipDialog";
import ScreenshotLightbox from "@/components/ScreenshotLightbox";
import type { Ship } from "@/types/ship";

export default function FeedPage() {
  const [ships, setShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Ship | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ url: string; alt: string } | null>(null);

  const fetchShips = useCallback(async () => {
    try {
      const res = await fetch("/api/ships");
      const data = await res.json();
      setShips(Array.isArray(data) ? data : []);
    } catch {
      setShips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShips();
  }, [fetchShips]);

  useEffect(() => {
    if (ships.length === 0) return;
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setHighlightId(id);
    setTimeout(() => setHighlightId(null), 1500);
  }, [ships]);

  return (
    <>
      {/* Header */}
      <header className="pt-6 pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-ship-text hover:text-ship-accent transition-colors"
        >
          <span className="text-2xl leading-none">←</span>
          <span className="text-base font-bold tracking-wide translate-y-px">Return to Port</span>
        </Link>
      </header>

      {/* Total count */}
      <div className="mb-4">
        <div className="text-sm">
          <span className="text-ship-accent font-bold text-lg">{ships.length}</span>
          <span className="text-ship-text ml-2 text-xs">total ships logged</span>
        </div>
      </div>

      {/* Ship list */}
      {loading ? (
        <div className="text-center py-10 text-ship-text text-sm">Loading…</div>
      ) : ships.length === 0 ? (
        <div className="text-center py-10 text-ship-text text-sm">No ships yet.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {ships.map((ship) => (
            <div key={ship.id} id={`ship-${ship.id}`}>
              <ShipCard ship={ship} truncate={false} highlight={highlightId === `ship-${ship.id}`} onDelete={() => setDeleteTarget(ship)} onScreenshotClick={(url) => setLightbox({ url, alt: ship.title })} />
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <DeleteShipDialog
          ship={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => { setDeleteTarget(null); fetchShips(); }}
        />
      )}

      {lightbox && (
        <ScreenshotLightbox url={lightbox.url} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </>
  );
}
