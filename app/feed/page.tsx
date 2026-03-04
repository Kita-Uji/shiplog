"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ShipCard from "@/components/ShipCard";
import type { Ship } from "@/types/ship";

export default function FeedPage() {
  const [ships, setShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      {/* Header */}
      <header className="flex items-center gap-3 pt-6 pb-4">
        <Link
          href="/"
          className="text-ship-text hover:text-ship-accent transition-colors text-sm"
        >
          ←
        </Link>
        <h1 className="text-base font-bold text-ship-text tracking-wide">Ship Feed</h1>
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
            <ShipCard key={ship.id} ship={ship} truncate={false} />
          ))}
        </div>
      )}

    </>
  );
}
