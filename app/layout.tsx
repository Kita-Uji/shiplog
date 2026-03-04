import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "shiplog",
  description: "Track your AI builds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-ship-bg min-h-screen font-mono">
        <div className="max-w-2xl mx-auto px-4 pb-8">{children}</div>
      </body>
    </html>
  );
}
