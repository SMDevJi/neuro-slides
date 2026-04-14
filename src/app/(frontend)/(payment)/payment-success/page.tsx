import PaymentSuccess from "@/components/PaymentSuccessClient";
import { Suspense } from "react";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentSuccess />
        </Suspense>
    );
}