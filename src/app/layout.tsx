import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.scss";
import ClientShell from "@/src/components/common/clientShell";
import { Providers } from "@/src/lib/providers";
import localFont from "next/font/local";

const myFont = localFont({
  src: "./fonts/BeVietnamPro-Regular.ttf",
  variable: "--font-beVietNamPro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mi Bánh Bao",
  description: "Mua bánh bao và đồ ăn truyền thống trực tuyến cùng Mi Bánh Bao",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${myFont.className} ${myFont.variable}`}>
        <Providers>
          <Suspense fallback={<main className="app">Đang tải...</main>}>
            <ClientShell>{children}</ClientShell>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
