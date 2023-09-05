import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Scroll Animation GSAP",
  description:
    "An Scroll Based Animation Website using GSAP and Nextjs to simulate an animation just like Apple",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
