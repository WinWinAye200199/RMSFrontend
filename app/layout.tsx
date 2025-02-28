// styles
// import "nprogress/nprogress.css";
import '@ant-design/v5-patch-for-react-19';
import "./globals.css";

import { NProgressBar } from "@/components/common/NProgressBar";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  variable: "--jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: true,
});

export const metadata: Metadata = {
  title: "Shift Manager",
  description: " Manage your staff shifts with ease and simplicity. ",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${jetbrainsMono.className} ${jetbrainsMono.variable} antialiased`}
      >
        <NProgressBar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
