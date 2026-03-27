import { getActiveSubscription } from "./collections/subscription";

export async function validateSubscription(tenantId: string) {
  const sub = await getActiveSubscription(tenantId);

  if (!sub) {
    throw new Error("NO_ACTIVE_SUBSCRIPTION");
  }

  return sub;
}
