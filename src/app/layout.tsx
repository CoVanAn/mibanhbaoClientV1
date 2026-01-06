import type { Metadata } from "next";
import "./globals.scss";
import ClientShell from "@/src/components/ClientShell/ClientShell";

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
      <body >
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
