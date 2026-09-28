import { PaymentResult } from "@/components/payment/Checkout";
import type { PublicProps } from "@/components/public/Pages";
export const metadata = {
  title: "Payment pending | TM Cambodia",
  robots: { index: false, follow: false },
};
export default async function Page(props: PublicProps) {
  const params = await props.params;
  return PaymentResult({
    ...props,
    params: Promise.resolve({ ...params, status: "pending" }),
  });
}
