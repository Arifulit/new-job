import { z } from "zod";

export const createPaymentSchema = z.object({
  plan: z.enum(["Basic", "Standard", "Premium"]),
  paymentMethod: z.enum(["SSLCommerz", "Stripe", "PayPal"]),
});

export type CreatePaymentDto = z.infer<typeof createPaymentSchema>;
