"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function PaymentSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [coinsUpdated, setCoinsUpdated] = useState(false);

    const { data: session, update } = useSession()
    const user = session?.user

    const [countdown, setCountdown] = useState(5);

    const courseTitle = searchParams.get("title");
    const coursePrice = searchParams.get("price");
    const courseCoins = searchParams.get("coins");

    // update coins
    useEffect(() => {
        console.log(user?.credits)
        if (!courseCoins || coinsUpdated || user?.credits === undefined) return;

        console.log(user?.credits)
        const updateCoins = async () => {

            if (courseCoins == 'unlimited') {
                await update({
                    credits: 'unlimited'
                })
            } else {
                await update({
                    credits: user?.credits as number + parseInt(courseCoins || "0", 10)
                })
            }

            setCoinsUpdated(true);
        }
        updateCoins()

    }, [courseCoins, user?.credits, coinsUpdated]);

    // countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // redirect
    useEffect(() => {
        if (countdown <= 0) {
            router.push("/pricing");
        }
    }, [countdown, router]);





    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
            <h1 className="text-3xl font-bold text-green-600 mb-4">
                Payment Successful!
            </h1>

            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <p className="text-gray-700 mb-2">
                    <strong>Title:</strong> {courseTitle}
                </p>

                <p className="text-gray-700 mb-2">
                    <strong>Coins Bought:</strong> {courseCoins}
                </p>

                <p className="text-gray-700 mb-4">
                    <strong>Price:</strong> ${coursePrice}
                </p>

                <p className="text-sm text-gray-500 text-center">
                    Redirecting to your purchases in{" "}
                    <strong>{countdown}</strong> second
                    {countdown !== 1 && "s"}...
                </p>

            </div>
        </div>
    );
}