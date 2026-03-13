import { PLANS } from "@/lib/plans";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
    try {
        const { planId, userId } = await req.json();

        let session;

        const plan = PLANS.find(p => p.id === planId);

        if (!plan) {
            return NextResponse.json({ error: "Plan not found" }, { status: 404 });
        }

        let { credits, price, name } = plan;

        if (planId === "credits_pack") {
            session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success/?title=${planId}&price=${price}&coins=${credits}`,
                cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
                metadata: {
                    userId: userId,
                    plan: planId,
                    product_name: name,
                    product_price: price,
                    product_coins: credits
                },
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: "5 Credits Pack",
                            },
                            unit_amount: 200,
                        },
                        quantity: 1,
                    },
                ],
            });
        }


        if (planId === "pro_unlimited") {
            session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "subscription",
                success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success/?title=${planId}&price=${price}&coins=${credits}`,
                cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
                metadata: {
                    userId: userId,
                    plan: planId,
                    product_name: name,
                    product_price: price,
                    product_coins: credits
                },
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: "Pro Unlimited Plan",
                            },
                            unit_amount: 1000,
                            recurring: {
                                interval: "month",
                            },
                        },
                        quantity: 1,
                    },
                ],
            });
        }

        return NextResponse.json({ url: session?.url });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Checkout session creation failed" },
            { status: 500 }
        );
    }
}