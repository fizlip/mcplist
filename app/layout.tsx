import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Find MCP Servers",
  description: "A comprehensive list of all MCP servers in the official Model Context Protocol registry. Discover and explore available MCP servers for your projects.",
  keywords: ["MCP", "Model Context Protocol", "servers", "registry", "AI", "tools"],
  authors: [{ name: "Spekter" }],
  openGraph: {
    title: "Spekter - Access the official MCP Server Registry",
    description: "A comprehensive list of all MCP servers in the official Model Context Protocol registry. Discover and explore available MCP servers for your projects.",
    url: "https://www.spekter.io",
    siteName: "Spekter",
    images: [
      {
        url: "/spekter.png",
        width: 1200,
        height: 630,
        alt: "Spekter - Access the official MCP Server Registry",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spekter - Access the official MCP Server Registry",
    description: "A comprehensive list of all MCP servers in the official Model Context Protocol registry. Discover and explore available MCP servers for your projects.",
    images: ["/spekter.png"],
    creator: "@zlatoidsky", // Replace with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: "your-google-verification-code", // Add when you have it
    // yandex: "your-yandex-verification-code", // Add when you have it
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
