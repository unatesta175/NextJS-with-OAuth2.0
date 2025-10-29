import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ConditionalLayout } from "./conditional-layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Lunara Spa",
  description: "Lunara Spa Booking System",
  icons: {
    icon: "/Logo/favicon.png",
    shortcut: "/Logo/favicon.png",
    apple: "/Logo/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
