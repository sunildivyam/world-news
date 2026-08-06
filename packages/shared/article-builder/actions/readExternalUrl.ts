"use server";

export async function readExternalUrl(
  targetUrl?: string | null,
): Promise<string> {
  // 1. Parameter Validation
  if (!targetUrl || typeof targetUrl !== "string") {
    throw new Error("Missing or invalid URL argument.");
  }

  // Basic URL structure check
  try {
    new URL(targetUrl);
  } catch {
    throw new Error("Invalid URL provided.");
  }

  try {
    // 2. Fetch raw HTML with standard browser headers
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 3600 }, // Cache fetch in Next.js Data Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch target URL. HTTP Status: ${response.status}`,
      );
    }

    const html = await response.text();
    return html;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
}
