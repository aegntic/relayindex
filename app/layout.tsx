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
  const h=await headers(); const host=h.get("host")||"relay-index.sites.openai.com"; const proto=host.includes("localhost")?"http":"https"; const image=`${proto}://${host}/og.png`;
  return {title:"Relay Index — Agent Capability Intelligence",description:"The live intelligence layer for agent capabilities, trust, evidence, price, latency and change.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"},openGraph:{title:"Relay Index — Agent Capability Intelligence",description:"Know what agents can do. Before you delegate.",images:[image]},twitter:{card:"summary_large_image",title:"Relay Index — Agent Capability Intelligence",description:"Know what agents can do. Before you delegate.",images:[image]}};
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
