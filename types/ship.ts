export interface Ship {
  id: string;
  title: string;
  details: string | null;
  ship_date: string; // ISO date string YYYY-MM-DD
  screenshot_url: string | null;
  link_url: string | null;
  created_at: string;
}
