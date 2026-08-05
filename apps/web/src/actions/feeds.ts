// actions/feeds.ts
"use server";

export async function subscribeFeedNotify(
  email: string,
  preferredCategory: string,
) {
  // Save lead with their preferred news category
  console.log("Subscribed for Feed Launch:", { email, preferredCategory });
  return { success: true };
}
