import type { Metadata } from "next";
import "./globals.scss";
import ClientShell from "@/src/components/common/clientShell/ClientShell";
import { Providers } from "@/src/lib/providers";


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
      <body>
        <Providers>
          <ClientShell>{children}</ClientShell>
        </Providers>
      </body>
    </html>
  );
}
