import { getCollections } from "../collections";

export async function getActiveSubscription(tenantId: string) {
  const { subscriptions } = await getCollections();

  return subscriptions.findOne({
    tenantId,
    status: "active",
  });
}
