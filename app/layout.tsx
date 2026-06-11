import type { Metadata } from "next";
import { auth } from "@/auth";
import { AppFrame } from "@/components/ui/app-frame";
import "./globals.css";

export const metadata: Metadata = {
  title: "计划执行系统",
  description: "把长期目标拆解为可执行计划，并持续跟踪执行进度。",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">
        <AppFrame
          user={
            session?.user
              ? {
                  name: session.user.name ?? null,
                  email: session.user.email ?? null,
                  image: session.user.image ?? null,
                }
              : null
          }
        >
          {children}
        </AppFrame>
      </body>
    </html>
  );
}
