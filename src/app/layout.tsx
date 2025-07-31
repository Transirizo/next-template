import type { Metadata } from "next";
import "./globals.css";
import { TanstackProvider } from "@/lib/tanstack-query/tanstack-provider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/lib/theme-provider/theme-provider";
import { ThirdPartyScripts } from "@/lib/third-party-scripts/third-party-scripts";
import { UserProvider } from "@/lib/user-context/user-context";
import { ReduxProvider } from "@/lib/redux-provider/redux-provider";
export const metadata: Metadata = {
  icons: {
    icon: "/icon/logo.svg",
  },
  title: "资产管理",
  description: "Next.js with Shadcn UI, Tanstack Query, and Feishu integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <UserProvider>
              <Toaster />
              <TanstackProvider>{children}</TanstackProvider>
            </UserProvider>
          </ReduxProvider>
        </ThemeProvider>
        <ThirdPartyScripts />
      </body>
    </html>
  );
}
