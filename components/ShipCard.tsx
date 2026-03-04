import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import type { Ship } from "@/types/ship";

interface Props {
  ship: Ship;
  truncate?: boolean;
  href?: string;
}

export default function ShipCard({ ship, truncate = true, href }: Props) {
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
            <a
              href={ship.link_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="ml-auto flex items-center gap-1 text-[10px] text-ship-accent border border-ship-accent/40 rounded-full px-2 py-0.5 hover:bg-ship-accent/10 transition-colors"
            >
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Link
            </a>
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

  if (href) {
    return (
      <Link
        href={href}
        className="block bg-ship-card rounded-xl border border-ship-border overflow-hidden hover:border-ship-accent/50 transition-colors"
      >
        {cardBody}
      </Link>
    );
  }

  return (
    <div className="bg-ship-card rounded-xl border border-ship-border overflow-hidden">
      {cardBody}
    </div>
  );
}
