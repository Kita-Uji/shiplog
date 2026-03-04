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
  const [password, setPassword] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);

  async function handleDelete() {
    if (password !== "ayeayecaptain") {
      setWrongPassword(true);
      return;
    }
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
        <div className="bg-ship-bg border border-ship-border rounded-2xl p-5 shadow-xl animate-modal-in w-full max-w-xs">
          {/* Body */}
          <p className="text-sm text-ship-text mb-1">
            Delete{" "}
            <span className="text-ship-accent font-semibold">{ship.title}</span>
            ?
          </p>
          <p className="text-xs text-ship-text/60 mb-2">Enter password before removal</p>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setWrongPassword(false); }}
            onKeyDown={(e) => { if (e.key === "Enter" && password !== "") handleDelete(); }}
            placeholder="Password"
            disabled={deleting}
            className="w-full bg-ship-card border border-ship-border rounded-xl px-3 py-2 text-sm text-ship-text placeholder-ship-text/40 focus:outline-none focus:border-ship-accent/60 mb-1 disabled:opacity-40"
          />
          {wrongPassword && (
            <p className="text-xs text-red-500 mb-5">Incorrect password.</p>
          )}
          {!wrongPassword && <div className="mb-5" />}

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
              disabled={deleting || password === ""}
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
