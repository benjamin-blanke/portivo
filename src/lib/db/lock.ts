import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { LOCK_SINGLETON_ID } from "@/lib/constants";

export interface SiteLockStatus {
  locked: boolean;
  reason: string;
}

/** Public site should render normally unless explicitly locked. */
export const getSiteLock = cache(async function getSiteLock(): Promise<SiteLockStatus> {
  const status = await prisma.siteLock.upsert({
    where: { id: LOCK_SINGLETON_ID },
    update: {},
    create: { id: LOCK_SINGLETON_ID, locked: false, reason: "" },
  });
  return { locked: status.locked, reason: status.reason };
});

export async function setSiteLock(locked: boolean, reason: string): Promise<SiteLockStatus> {
  const status = await prisma.siteLock.upsert({
    where: { id: LOCK_SINGLETON_ID },
    update: { locked, reason },
    create: { id: LOCK_SINGLETON_ID, locked, reason },
  });
  return { locked: status.locked, reason: status.reason };
}
