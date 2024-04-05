import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Your open gallery",
  description:
    "Photo upload by user, and user can add comment to photo. Feel free to add comment to photo.",
};

export default function SEOWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <> {children}</>;
}
