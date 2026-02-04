import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "FoodHub",
  description: "Discover & Order Delicious Meals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="icon" href="/images/logo.svg" sizes="any" />
      <body>{children}</body>
    </html>
  );
}
