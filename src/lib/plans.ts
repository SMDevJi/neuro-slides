export interface IPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  credits: number | "unlimited";
  interval?: "month";
  description: string;
}

export const PLANS: IPlan[] = [
  {
    id: "credits_pack",
    name: "Starter Credits",
    price: 2,
    currency: "USD",
    credits: 5,
    description: "Get 5 credits for one-time use."
  },
  {
    id: "pro_unlimited",
    name: "Pro Unlimited",
    price: 10,
    currency: "USD",
    credits: "unlimited",
    interval: "month",
    description: "Unlimited credits billed monthly."
  }
];