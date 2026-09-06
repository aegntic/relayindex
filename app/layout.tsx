import type { Metadata } from "next";
import { headers } from "next/headers";
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

export async function generateMetadata():Promise<Metadata>{
  const host=(await headers()).get("host")?.split(":")[0]?.toLowerCase();
  const origin=host==="relayindex.dev"?"https://relayindex.dev":"https://relay-index-intelligence.aegnt.chatgpt.site";
  const image=`${origin}/og.png`;
  return {title:"Relay Index — Agent Capability Intelligence",description:"A sample preview of independent decision assurance for external agent capabilities: evidence, price, latency, reliability and change risk.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"},openGraph:{title:"Relay Index — Agent Capability Intelligence",description:"Preview how agents can evaluate capabilities before they delegate.",images:[image]},twitter:{card:"summary_large_image",title:"Relay Index — Agent Capability Intelligence",description:"Preview how agents can evaluate capabilities before they delegate.",images:[image]}};
}

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
