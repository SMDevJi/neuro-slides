"use client";

import { PLANS } from "@/lib/plans";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Order {
  _id: string;
  productName: string;
  price: number;
  coins: number;
  createdAt: string;
}



export default function PricingPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const { data: session, update } = useSession()
  const user = session?.user


  async function fetchOrders() {
    try {
      const res = await fetch("/api/payment/get-orders");
      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function handleCheckout(planId: string) {
    try {
      setLoading(true);
      setSelectedPlan(planId)

      const userId = user?.id

      const res = await fetch("/api/payment/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ planId, userId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setSelectedPlan(null)
    }
  }

  return (
    <div className="max-w-5xl min-h-[75vh] mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8">Pricing</h1>


      <div className="plans grid md:grid-cols-2 gap-6 mb-12">


        <div className="credits border-3 rounded-xl p-6 hover:scale-105 transition">
          <h2 className="text-xl font-semibold">{PLANS[0].name}</h2>

          <p className="text-3xl font-bold mt-2">${PLANS[0].price}</p>

          <p className="text-gray-600 mt-2">
            Get {PLANS[0].credits} credits (one-time purchase)
          </p>

          <button
            onClick={() => handleCheckout(PLANS[0].id)}
            className="mt-4 bg-primary hover:bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
            disabled={loading}
          >
            {(loading && selectedPlan == PLANS[0].id) ? 'Buying...' : `Buy ${PLANS[0].credits} Credits`}
          </button>
        </div>


        <div className="border-3 rounded-xl p-6 hover:scale-105 transition">
          <h2 className="text-xl font-semibold">{PLANS[1].name}</h2>

          <p className="text-3xl font-bold mt-2">${PLANS[1].price} / month</p>

          <p className="text-gray-600 mt-2">
            Unlimited credits with monthly billing
          </p>

          <button
            onClick={() => handleCheckout(PLANS[1].id)}
            className="mt-4 bg-primary hover:bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
            disabled={loading}
          >
            {(loading && selectedPlan == PLANS[1].id) ? 'Buying...' : 'Subscribe'}

          </button>
        </div>

      </div>


      <div className="orders">

        <h2 className="text-2xl font-semibold mb-4">Past Orders</h2>

        {orders.length === 0 && (
          <p className="text-gray-500">No orders found.</p>
        )}

        {orders.length > 0 && (
          <div className="border rounded-lg overflow-scroll">

            <table className="w-full text-left">

              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Credits</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t">

                    <td className="p-3">{order.productName}</td>

                    <td className="p-3">${order.price}</td>

                    <td className="p-3">{order.coins}</td>

                    <td className="p-3">
                      {new Date(order.createdAt).toLocaleDateString('en-GB')}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>
    </div>
  );
}