import { useMemo } from "react";
import { format, subDays, isEqual, parseISO } from "date-fns";
import type { Ship } from "@/types/ship";

interface Props {
  ships: Ship[];
}

export default function StatsBar({ ships }: Props) {
  const stats = useMemo(() => {
    const total = ships.length;

    const uniqueDays = new Set(ships.map((s) => s.ship_date)).size;

    // Current streak: consecutive days ending today (or yesterday) with ≥1 ship
    const shipDates = new Set(ships.map((s) => s.ship_date));
    let streak = 0;
    let cursor = new Date();
    // Check if today has ships; if not, start from yesterday
    const todayStr = format(cursor, "yyyy-MM-dd");
    if (!shipDates.has(todayStr)) {
      cursor = subDays(cursor, 1);
    }
    while (shipDates.has(format(cursor, "yyyy-MM-dd"))) {
      streak++;
      cursor = subDays(cursor, 1);
    }

    return { total, uniqueDays, streak };
  }, [ships]);

  return (
    <div className="flex items-center justify-around py-4 border-y border-ship-border">
      <Stat value={stats.total} label="TOTAL SHIPS" />
      <div className="w-px h-8 bg-ship-border" />
      <Stat value={stats.uniqueDays} label="ACTIVE DAYS" />
      <div className="w-px h-8 bg-ship-border" />
      <Stat value={`${stats.streak}d`} label="CURRENT STREAK" />
    </div>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-ship-accent">{value}</div>
      <div className="text-[10px] tracking-widest text-ship-text mt-0.5">{label}</div>
    </div>
  );
}
