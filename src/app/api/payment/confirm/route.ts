import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import Order from "@/models/order.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    //  Get raw body as text
    const body = await req.text();

    //  Get signature from request headers
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
        return new NextResponse("Missing Stripe signature", { status: 400 });
    }

    //  Verify webhook
    let event: Stripe.Event;
    try {
        //console.log(body, signature, endpointSecret)
        event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err: any) {
        console.error(" Webhook signature verification failed.", err.message);
        return new NextResponse("Webhook Error", { status: 400 });
    }

    await connectDB();

    //  Handle event
    //console.log(event.type)
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const { userId, product_name, product_price, product_coins, plan } =
                session.metadata || {};

            //console.log(session.metadata)

            if (!userId) break;

            if (plan === "credits_pack") {
                await User.findByIdAndUpdate(
                    userId,
                    { $inc: { credits: parseInt(product_coins || "0") } },
                    { new: true, runValidators: true }
                );
            }

            if (plan === "pro_unlimited") {
                await User.findByIdAndUpdate(
                    userId,
                    { credits: 'unlimited' },
                    { new: true }
                );
            }

            // Create order for record
            await Order.create({
                productName: product_name,
                userId,
                checkoutId: session.id,
                price: product_price,
                coins: product_coins,
            });

            break;
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}