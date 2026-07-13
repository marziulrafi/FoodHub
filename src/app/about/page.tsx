export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="rounded-[2rem] border border-gray-200 bg-white p-10 shadow-sm">
        <h1 className="text-4xl font-bold text-gray-900">About FoodHub</h1>
        <p className="mt-6 text-gray-600 leading-8">
          FoodHub connects hungry customers with local restaurants delivering fresh meals fast. Our platform makes it easy to browse menus, place orders, and enjoy reliable delivery from trusted providers.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-gray-900">Our mission</h2>
            <p className="mt-3 text-gray-600">
              To make ordering food simple, transparent, and delightful for everyone.
            </p>
          </div>
          <div className="rounded-3xl bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-gray-900">What we do</h2>
            <p className="mt-3 text-gray-600">
              We help customers discover meals, support restaurants, and provide an easy ordering experience across devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
