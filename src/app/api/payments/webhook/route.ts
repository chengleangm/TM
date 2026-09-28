import { paymentProvider } from "@/services/payment/payment-provider";
export async function POST(request: Request) {
  const signature = request.headers.get("x-payment-signature") ?? "";
  const payload = await request.text();
  if (payload.length > 65536 || !await paymentProvider.verifyCallback(payload, signature)) return Response.json({error:"Unverified callback"},{status:401});
  await paymentProvider.handleWebhook(payload,signature); return Response.json({received:true});
}
