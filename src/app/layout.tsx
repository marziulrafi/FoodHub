import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/layout/Providers";

export const metadata: Metadata = {
  title: {
    default: "FoodHub | Good food, local kitchens",
    template: "%s | FoodHub",
  },
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
            <a className="skip-link" href="#main-content">
              Skip to content
            </a>
            <Navbar />
            <main id="main-content" className="flex-1 min-w-0">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
