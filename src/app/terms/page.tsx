export default function TermsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="rounded-[2rem] border border-gray-200 bg-white p-10 shadow-sm">
        <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
        <p className="mt-6 text-gray-600 leading-8">
          These terms govern your use of FoodHub. By using the platform, you agree to follow our policies and respect restaurant and customer relationships.
        </p>
        <div className="mt-10 space-y-8 text-gray-600 leading-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Using FoodHub</h2>
            <p className="mt-3">Orders placed through FoodHub are subject to confirmation by restaurants and availability at the time of ordering.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">User responsibilities</h2>
            <p className="mt-3">Keep your account secure, provide accurate delivery information, and comply with applicable laws.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Limitations</h2>
            <p className="mt-3">FoodHub is not liable for issues outside our control, including restaurant preparation errors, delivery delays, or force majeure events.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
