"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/v1/contact", form);
      toast.success("Message sent successfully.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Submission failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
        <div>
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-[0.2em]">
            Contact Us
          </p>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">
            Have a question or feedback?
          </h1>
          <p className="mt-4 text-gray-600 leading-7">
            We&apos;re here to help. Send us a message and our support team will
            get back to you within 24 hours.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-gray-50 p-6 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Support</p>
              <p className="mt-2 font-semibold text-gray-900">
                support@foodhub.com
              </p>
            </div>
            <div className="rounded-3xl bg-gray-50 p-6 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Phone</p>
              <p className="mt-2 font-semibold text-gray-900">
                +88 01234 567890
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Send a message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="field-1"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                id="field-1"
                type="text"
                required
                className="input"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div>
              <label
                htmlFor="field-2"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="field-2"
                type="email"
                required
                className="input"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div>
              <label
                htmlFor="field-3"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone
              </label>
              <input
                id="field-3"
                type="tel"
                className="input"
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
            <div>
              <label
                htmlFor="field-4"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject
              </label>
              <input
                id="field-4"
                type="text"
                className="input"
                value={form.subject}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, subject: e.target.value }))
                }
              />
            </div>
            <div>
              <label
                htmlFor="field-5"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="field-5"
                required
                rows={5}
                className="input resize-none"
                value={form.message}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, message: e.target.value }))
                }
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
