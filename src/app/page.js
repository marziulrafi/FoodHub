import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import Hero from "../components/Home/Hero.tsx";
import CategoriesSection from "../components/Home/CategoriesSection.tsx";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 pt-16 md:pt-20">
        <Hero />
        <CategoriesSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
