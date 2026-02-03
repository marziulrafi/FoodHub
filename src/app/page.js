import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-primary text-white p-20 text-center">
        <h1 className="text-5xl font-bold">FoodHub</h1>
        <p className="mt-4">Discover & Order Delicious Meals</p>
      </section>

      {/* Categories */}
      <section className="p-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {["Pizza", "Burgers", "Asian", "Healthy"].map(c => (
          <div key={c} className="bg-white shadow rounded-xl p-6 text-center">
            {c}
          </div>
        ))}
      </section>

      {/* Featured Meals */}
      <section className="p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-5 rounded-xl shadow">
            Meal {i}
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="p-10 bg-gray-100 text-center">
        <h2 className="text-2xl font-bold">How It Works</h2>
        <p>Browse → Order → Enjoy</p>
      </section>

      <Footer />
    </>
  )
}
