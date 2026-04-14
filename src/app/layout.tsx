import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/ToastContainer";
import ClientProvider from "@/providers/ClientProvider";


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
    <html lang="en" >
      <body
        className={` ${RobotoCondensed.className} antialiased text-lg `}
      >
        <ClientProvider>
            <Navbar />
            {children}
            <ToastContainer />
            <Footer />
        </ClientProvider>

      </body>
    </html>
  );
}
