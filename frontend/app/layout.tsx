import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Theme } from '@radix-ui/themes';

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jarvis - AI Assistant",
  description: "An intelligent AI assistant built with Next.js and Radix UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased`}
      >
        <Theme
          appearance="light"
          accentColor="ruby"
          grayColor="slate"
          radius="large"
          scaling="100%"
        >
          {children}
        </Theme>
      </body>
    </html>
  );
}
