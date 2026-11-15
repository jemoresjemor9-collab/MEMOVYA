import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Memovya — Votre espace numérique",
    template: "%s | Memovya",
  },
  description:
    "Conservez, organisez et retrouvez vos fichiers importants dans votre espace numérique personnel.",
  applicationName: "Memovya",
};

export const viewport: Viewport = {
  themeColor: "#F8FAFC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
