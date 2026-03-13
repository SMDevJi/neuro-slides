"use client";

import { useRouter } from "next/navigation";

export default function PaymentCancelledPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
      <div className="max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Payment Cancelled
        </h1>

        <p className="text-gray-700 mb-6">
          Your payment was not completed. No charges were made.
        </p>

        <button
          onClick={() => router.push("/pricing")}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Go Back to Pricing
        </button>
      </div>
    </div>
  );
}