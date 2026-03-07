import type { Metadata } from "next";
import {  Roboto_Condensed, Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const RobotoCondensed = Roboto_Condensed({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Neuro Slides",
  description: "AI PPt generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={` ${RobotoCondensed.className} antialiased text-lg `}
      >
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
