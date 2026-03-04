"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { format, subDays, startOfWeek, addDays } from "date-fns";
import type { Ship } from "@/types/ship";

interface Props {
  ships: Ship[];
}

const CELL_SIZE = 24; // w-6 h-6 = 24px (150% of previous w-4 h-4)
const GAP = 2;
const COL_STRIDE = CELL_SIZE + GAP;

function getCellColor(count: number) {
  if (count === 0) return "bg-[#EEEEEA]";
  if (count === 1) return "bg-[#F4C4C4]";
  if (count === 2) return "bg-[#F4ABAB]";
  if (count === 3) return "bg-[#F49191]";
  return "bg-[#E07070]";
}

export default function Heatmap({ ships }: Props) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [weeks, setWeeks] = useState(16);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      if (w > 0) setWeeks(Math.max(1, Math.floor(w / COL_STRIDE)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { grid, months } = useMemo(() => {
    const today = new Date();
    const countMap: Record<string, number> = {};
    for (const ship of ships) {
      countMap[ship.ship_date] = (countMap[ship.ship_date] ?? 0) + 1;
    }

    const endDate = today;
    const startDate = subDays(startOfWeek(today, { weekStartsOn: 0 }), (weeks - 1) * 7);

    const columns: Array<Array<{ date: Date; count: number } | null>> = [];
    let cursor = startDate;

    while (cursor <= endDate) {
      const week: Array<{ date: Date; count: number } | null> = [];
      for (let d = 0; d < 7; d++) {
        const day = addDays(cursor, d);
        if (day > endDate) {
          week.push(null);
        } else {
          const key = format(day, "yyyy-MM-dd");
          week.push({ date: day, count: countMap[key] ?? 0 });
        }
      }
      columns.push(week);
      cursor = addDays(cursor, 7);
    }

    const monthLabels: Array<{ label: string; col: number }> = [];
    let lastMonth = -1;
    columns.forEach((col, i) => {
      const firstCell = col.find((c) => c !== null);
      if (firstCell) {
        const m = firstCell.date.getMonth();
        if (m !== lastMonth) {
          monthLabels.push({ label: format(firstCell.date, "MMM"), col: i });
          lastMonth = m;
        }
      }
    });

    return { grid: columns, months: monthLabels };
  }, [ships, weeks]);

  return (
    <div ref={containerRef} className="relative select-none">
      {/* Month labels */}
      <div className="flex mb-1" style={{ gap: `${GAP}px` }}>
        {grid.map((_, i) => {
          const month = months.find((m) => m.col === i);
          return (
            <div key={i} className="w-6 flex-shrink-0 text-[9px] text-ship-text text-center overflow-visible whitespace-nowrap">
              {month ? month.label : ""}
            </div>
          );
        })}
      </div>

      {/* Grid: 7 rows, N columns */}
      <div className="flex" style={{ gap: `${GAP}px` }}>
        {grid.map((col, ci) => (
          <div key={ci} className="flex flex-col" style={{ gap: `${GAP}px` }}>
            {col.map((cell, ri) =>
              cell === null ? (
                <div key={ri} className="w-6 h-6 rounded-sm" />
              ) : (
                <div
                  key={ri}
                  className={`w-6 h-6 rounded-sm cursor-default ${getCellColor(cell.count)}`}
                  onMouseEnter={(e) => {
                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                    setTooltip({
                      text: `${cell.count} ship${cell.count !== 1 ? "s" : ""} on ${format(cell.date, "yyyy-MM-dd")}`,
                      x: rect.left + rect.width / 2,
                      y: rect.top - 6,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              )
            )}
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none px-2 py-1 rounded text-[11px] bg-ship-text text-ship-bg whitespace-nowrap -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
