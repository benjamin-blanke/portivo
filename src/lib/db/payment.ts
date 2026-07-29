import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { PAYMENT_SINGLETON_ID } from "@/lib/constants";

/** Public site should render normally unless explicitly marked unpaid. */
export const isSitePaid = cache(async function isSitePaid(): Promise<boolean> {
  const status = await prisma.paymentStatus.upsert({
    where: { id: PAYMENT_SINGLETON_ID },
    update: {},
    create: { id: PAYMENT_SINGLETON_ID, isPaid: true },
  });
  return status.isPaid;
});

export async function setSitePaid(isPaid: boolean): Promise<boolean> {
  const status = await prisma.paymentStatus.upsert({
    where: { id: PAYMENT_SINGLETON_ID },
    update: { isPaid },
    create: { id: PAYMENT_SINGLETON_ID, isPaid },
  });
  return status.isPaid;
}
