import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AthleteOS",
  description:
    "A guided resume builder for college athletes applying for internships and first jobs",
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
