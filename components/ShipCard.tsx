import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import type { Ship } from "@/types/ship";

interface Props {
  ship: Ship;
  truncate?: boolean;
  href?: string;
  highlight?: boolean;
  onDelete?: () => void;
}

export default function ShipCard({ ship, truncate = true, href, highlight, onDelete }: Props) {
  const dateLabel = (() => {
    try {
      return format(parseISO(ship.ship_date), "MMM d, yyyy");
    } catch {
      return ship.ship_date;
    }
  })();

  const cardBody = (
    <>
      {/* Screenshot area */}
      {ship.screenshot_url ? (
        <div className="relative w-full aspect-video">
          <Image
            src={ship.screenshot_url}
            alt={ship.title}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-full aspect-video flex items-center justify-center border-b border-ship-border">
          <span className="text-xs tracking-widest text-ship-border border border-ship-border px-3 py-1 rounded">
            SCREENSHOT
          </span>
        </div>
      )}

      {/* Card body */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-ship-accent flex-shrink-0" />
          <span className="text-sm text-ship-text">{dateLabel}</span>
          {ship.link_url && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(ship.link_url!, "_blank", "noopener,noreferrer"); }}
              className="ml-auto flex items-center gap-1 text-[10px] text-ship-accent border border-ship-accent/40 rounded-full px-2 py-0.5 hover:bg-ship-accent/10 transition-colors"
            >
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Link
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
              className={`${ship.link_url ? "ml-1" : "ml-auto"} p-1 text-ship-text/40 hover:text-red-400 transition-colors`}
              aria-label="Delete ship"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
              </svg>
            </button>
          )}
        </div>
        <h3 className="font-bold text-ship-accent text-lg leading-tight">{ship.title}</h3>
        {ship.details && (
          <p className={`text-ship-text text-sm mt-1 leading-relaxed ${truncate ? "line-clamp-2" : ""}`}>
            {ship.details}
          </p>
        )}
      </div>
    </>
  );

  const ringClass = highlight ? " ring-fade" : "";

  if (href) {
    return (
      <Link
        href={href}
        className={`block bg-ship-card rounded-xl border border-ship-border overflow-hidden hover:border-ship-accent/50 transition-colors${ringClass}`}
      >
        {cardBody}
      </Link>
    );
  }

  return (
    <div className={`bg-ship-card rounded-xl border border-ship-border overflow-hidden${ringClass}`}>
      {cardBody}
    </div>
  );
}
