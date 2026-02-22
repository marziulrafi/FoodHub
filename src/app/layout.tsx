import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/layout/Providers";

export const metadata: Metadata = {
  title: "FoodHub 🍱",
  description: "Discover & Order Delicious Meals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="bg-gray-900 text-gray-400 text-center py-6 text-sm">
              © {new Date().getFullYear()} FoodHub. Discover &amp; Order
              Delicious Meals.
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
