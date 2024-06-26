import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { fonts } from "./fonts";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fanatic open gallery",
  description:
    "Fanatic open gallery, where you can share your photo and your thought!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fonts.rubik.variable}>
      <body>
        <div>
          <Toaster />
        </div>

        <Providers>
          <div className="h-screen w-screen m-auto bg-[url('/img/welcome-background.jpg')]  bg-cover bg-center overflow-hidden flex justify-center items-center  ">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
