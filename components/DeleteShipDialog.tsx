"use client";

import { useState } from "react";
import type { Ship } from "@/types/ship";

interface Props {
  ship: Ship;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteShipDialog({ ship, onClose, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await fetch(`/api/ships/${ship.id}`, { method: "DELETE" });
      onDeleted();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-ship-text/40"
        onClick={onClose}
      />

      {/* Centered dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-ship-bg border border-ship-border rounded-2xl p-6 shadow-xl animate-modal-in w-full max-w-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-ship-text tracking-wide">
              Delete Ship
            </h2>
            <button
              onClick={onClose}
              disabled={deleting}
              className="w-7 h-7 flex items-center justify-center rounded border border-ship-border text-ship-text hover:bg-ship-card transition-colors text-sm disabled:opacity-40"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <p className="text-sm text-ship-text mb-1">
            Delete{" "}
            <span className="text-ship-accent font-semibold">{ship.title}</span>
            ?
          </p>
          <p className="text-xs text-ship-text/60 mb-6">This cannot be undone.</p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={deleting}
              className="flex-1 bg-ship-card border border-ship-border text-ship-text rounded-xl py-2.5 text-sm font-medium hover:border-ship-accent/40 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
