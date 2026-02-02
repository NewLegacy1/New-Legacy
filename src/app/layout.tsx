import type { Metadata } from "next";
import "./globals.css";
import "./custom.css";

export const metadata: Metadata = {
  title: "New Legacy AI | Custom AI Agents for Business Automation",
  description:
    "New Legacy AI - Custom AI agents that handle your calls, texts, emails, and bookings — so you can scale without the stress.",
  icons: {
    icon: "/phoenix-icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-charcoal">{children}</body>
    </html>
  );
}
