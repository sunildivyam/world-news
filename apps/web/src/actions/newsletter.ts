// actions/newsletter.ts
"use server";

export async function subscribeNewsletter(email: string) {
  // Your email capture / newsletter service logic here (e.g., Mailchimp, Resend, DB)
  console.log("Subscribed email:", email);
  return { success: true };
}
