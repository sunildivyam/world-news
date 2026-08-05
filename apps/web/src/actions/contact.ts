// actions/contact.ts
"use server";

export async function saveContactus(contactData: {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}) {
  // Your database saving or email service dispatch logic here
  console.log("Received contact submission:", contactData);
  return { success: true };
}
