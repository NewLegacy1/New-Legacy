import type { Metadata } from "next";
import "./globals.css";
import "./custom.css";
import { LeadCaptureProvider } from "@/components/LeadCaptureProvider";

export const metadata: Metadata = {
  title: "New Legacy AI | Custom AI Agents for Business Automation",
  description:
    "New Legacy AI - Custom AI agents that handle your calls, texts, emails, and bookings — so you can scale without the stress.",
  icons: {
    icon: [{ url: "/new-legacy-logo.png", type: "image/png" }],
    shortcut: [{ url: "/new-legacy-logo.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-charcoal" style={{ backgroundColor: "#0f0f0f" }}>
        <LeadCaptureProvider>{children}</LeadCaptureProvider>
      </body>
    </html>
  );
}
