"use client";

import { useMemo, useState } from "react";
import { format, subDays, startOfWeek, eachDayOfInterval, addDays } from "date-fns";
import type { Ship } from "@/types/ship";

interface Props {
  ships: Ship[];
}

const WEEKS = 16;

function getCellColor(count: number) {
  if (count === 0) return "bg-[#EEEEEA]";
  if (count === 1) return "bg-[#F4C4C4]";
  if (count === 2) return "bg-[#F4ABAB]";
  if (count === 3) return "bg-[#F49191]";
  return "bg-[#E07070]";
}

export default function Heatmap({ ships }: Props) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const { grid, months } = useMemo(() => {
    const today = new Date();
    // Build a map: date string -> count
    const countMap: Record<string, number> = {};
    for (const ship of ships) {
      countMap[ship.ship_date] = (countMap[ship.ship_date] ?? 0) + 1;
    }

    // Start of the grid: go back 52 weeks from the Sunday of current week
    const endDate = today;
    const startDate = subDays(startOfWeek(today, { weekStartsOn: 0 }), (WEEKS - 1) * 7);

    // Build columns: each column is a week (Sun→Sat)
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

    // Month labels: track where each month starts
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
  }, [ships]);

  return (
    <div className="relative select-none">
      {/* Month labels */}
      <div className="flex mb-1" style={{ gap: "2px" }}>
        {grid.map((_, i) => {
          const month = months.find((m) => m.col === i);
          return (
            <div key={i} className="w-4 flex-shrink-0 text-[9px] text-ship-text text-center overflow-visible whitespace-nowrap">
              {month ? month.label : ""}
            </div>
          );
        })}
      </div>

      {/* Grid: 7 rows, N columns */}
      <div className="flex" style={{ gap: "2px" }}>
        {grid.map((col, ci) => (
          <div key={ci} className="flex flex-col" style={{ gap: "2px" }}>
            {col.map((cell, ri) =>
              cell === null ? (
                <div key={ri} className="w-4 h-4 rounded-sm" />
              ) : (
                <div
                  key={ri}
                  className={`w-4 h-4 rounded-sm cursor-default ${getCellColor(cell.count)}`}
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

      {/* Legend */}
      <div className="flex items-center gap-1 mt-2 justify-end text-[10px] text-ship-text">
        <span>Less</span>
        {["bg-[#EEEEEA]", "bg-[#F4C4C4]", "bg-[#F4ABAB]", "bg-[#F49191]", "bg-[#E07070]"].map((c, i) => (
          <div key={i} className={`w-4 h-4 rounded-sm ${c}`} />
        ))}
        <span>More</span>
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
