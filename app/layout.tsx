import type { Metadata } from "next";
import { AppFrame } from "@/components/ui/app-frame";
import "./globals.css";

export const metadata: Metadata = {
  title: "计划执行系统",
  description: "把长期目标拆解为可执行计划，并持续跟踪执行进度。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
