import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";

import { ReactPlugin } from "@stagewise-plugins/react";
import { StagewiseToolbar } from "@stagewise/toolbar-next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

const isDevelopment = process.env.NODE_ENV === "development";

export const metadata: Metadata = {
  title: `Orator AI ${isDevelopment ? " - Dev" : ""}`,
  description: "Ton assistant vocal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${poppins.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}

        <StagewiseToolbar
          config={{
            plugins: [ReactPlugin],
          }}
        />
      </body>
    </html>
  );
}
