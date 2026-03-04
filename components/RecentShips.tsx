import ShipCard from "./ShipCard";
import type { Ship } from "@/types/ship";

interface Props {
  ships: Ship[];
  limit?: number;
}

export default function RecentShips({ ships, limit = 3 }: Props) {
  const recent = ships.slice(0, limit);

  if (recent.length === 0) {
    return (
      <div className="text-center py-10 text-ship-text text-sm">
        No ships yet. Submit your first build!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {recent.map((ship) => (
        <ShipCard
          key={ship.id}
          ship={ship}
          truncate
          href={`/feed#ship-${ship.id}`}
        />
      ))}
    </div>
  );
}
