export default function FAQPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="rounded-[2rem] border border-gray-200 bg-white p-10 shadow-sm">
        <h1 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
        <div className="mt-10 space-y-6 text-gray-600 leading-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">How do I place an order?</h2>
            <p className="mt-3">Browse meals, add items to your cart, and checkout with your delivery information.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Can I register as a restaurant?</h2>
            <p className="mt-3">Yes. Click Register and choose Provider to submit your restaurant details for approval.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">How can I contact support?</h2>
            <p className="mt-3">Use the Contact page to send a message, or email support@foodhub.com for help.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
