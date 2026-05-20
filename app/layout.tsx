import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AthleteOS",
  description: "AI career transition platform for athletes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
