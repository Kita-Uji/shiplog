"use client";

import { useState, useRef, FormEvent } from "react";
import { format } from "date-fns";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function SubmitShipModal({ onClose, onSuccess }: Props) {
  const today = format(new Date(), "yyyy-MM-dd");
  const [date, setDate] = useState(today);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(file: File | null) {
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      let screenshotUrl: string | null = null;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadData = await uploadRes.json();
        screenshotUrl = uploadData.url;
      }

      const shipRes = await fetch("/api/ships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          details: details.trim() || null,
          ship_date: date,
          screenshot_url: screenshotUrl,
          link_url: linkUrl.trim() || null,
        }),
      });
      if (!shipRes.ok) throw new Error("Failed to save ship");

      onSuccess();
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-ship-text/40"
        onClick={onClose}
      />

      {/* Centered modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-ship-bg border border-ship-border rounded-2xl p-6 shadow-xl animate-modal-in w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-ship-text tracking-wide">
              🚢 New Ship
            </h2>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded border border-ship-border text-ship-text hover:bg-ship-card transition-colors text-sm"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Date */}
            <div>
              <label className="block text-[10px] tracking-widest text-ship-text mb-1">DATE</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-ship-card border border-ship-border rounded-lg px-3 py-2 text-sm text-ship-text font-mono focus:outline-none focus:border-ship-accent"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-[10px] tracking-widest text-ship-text mb-1">TITLE</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What did you ship?"
                className="w-full bg-ship-card border border-ship-border rounded-lg px-3 py-2 text-sm text-ship-text font-mono focus:outline-none focus:border-ship-accent placeholder:text-ship-border"
              />
            </div>

            {/* Details */}
            <div>
              <label className="block text-[10px] tracking-widest text-ship-text mb-1">DETAILS</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what you built..."
                rows={3}
                className="w-full bg-ship-card border border-ship-border rounded-lg px-3 py-2 text-sm text-ship-text font-mono focus:outline-none focus:border-ship-accent placeholder:text-ship-border resize-none"
              />
            </div>

            {/* Link */}
            <div>
              <label className="block text-[10px] tracking-widest text-ship-text mb-1">LINK (OPTIONAL)</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://"
                className="w-full bg-ship-card border border-ship-border rounded-lg px-3 py-2 text-sm text-ship-text font-mono focus:outline-none focus:border-ship-accent placeholder:text-ship-border"
              />
            </div>

            {/* Screenshot */}
            <div>
              <label className="block text-[10px] tracking-widest text-ship-text mb-1">
                SCREENSHOT (OPTIONAL)
              </label>
              <div
                className="border border-dashed border-ship-border rounded-lg overflow-hidden cursor-pointer hover:border-ship-accent transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileChange(e.dataTransfer.files[0] ?? null);
                }}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-full aspect-video object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 gap-2 text-ship-text">
                    <span className="text-2xl">📷</span>
                    <span className="text-xs">Tap to add screenshot</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-ship-accent text-white font-bold py-3 rounded-xl text-sm tracking-wide hover:bg-ship-accent-dark transition-colors disabled:opacity-60"
            >
              {submitting ? "Shipping..." : "Ship It 🚢"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
