"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Heatmap from "@/components/Heatmap";
import StatsBar from "@/components/StatsBar";
import RecentShips from "@/components/RecentShips";
import SubmitShipModal from "@/components/SubmitShipModal";
import type { Ship } from "@/types/ship";

export default function Home() {
  const [ships, setShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

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
      <header className="pt-6 pb-4">
        <div className="text-2xl font-bold">
          <span className="text-ship-accent">ship</span>
          <span className="text-ship-text">log</span>
        </div>
      </header>

      {/* Heatmap card */}
      <div className="bg-ship-card border border-ship-border rounded-xl p-4 mb-4">
        <div className="flex items-center mb-3">
          <span className="text-xs text-ship-text">2025 Shipping</span>
        </div>
        {loading ? (
          <div className="h-24 flex items-center justify-center text-xs text-ship-text">
            Loading…
          </div>
        ) : (
          <Heatmap ships={ships} />
        )}
      </div>

      {/* Stats */}
      <StatsBar ships={ships} />

      {/* Submit button */}
      <button
        onClick={() => setModalOpen(true)}
        className="w-full mt-5 bg-ship-accent text-white font-bold py-4 rounded-2xl text-base tracking-wide hover:bg-ship-accent-dark transition-colors"
      >
        🚢 Submit a Ship
      </button>

      {/* Recent ships */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-ship-text tracking-wide">Recent Ships</h2>
          <Link
            href="/feed"
            className="text-xs text-ship-accent hover:underline"
          >
            View all →
          </Link>
        </div>
        <RecentShips ships={ships} />
      </div>

      {/* Modal */}
      {modalOpen && (
        <SubmitShipModal
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setModalOpen(false);
            fetchShips();
          }}
        />
      )}
    </>
  );
}
