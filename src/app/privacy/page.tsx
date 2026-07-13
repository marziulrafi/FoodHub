export default function PrivacyPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="rounded-[2rem] border border-gray-200 bg-white p-10 shadow-sm">
        <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-6 text-gray-600 leading-8">
          FoodHub values your privacy. We collect only the information needed to provide service and keep your account secure.
        </p>
        <div className="mt-10 space-y-8 text-gray-600 leading-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Information we collect</h2>
            <p className="mt-3">Your name, email, order history, and delivery details are used to process orders and support your experience.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">How we use data</h2>
            <p className="mt-3">We use your information to provide ordering, manage accounts, and communicate updates or promotions.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Security</h2>
            <p className="mt-3">We protect your data with secure servers and industry-standard practices. We never sell your personal information.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
