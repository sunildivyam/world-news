import { Headline } from "../../types";

export const getPrompt = (headline: Headline, language: string): string => {
  return `Act as a Senior professional News Editor at a leading news publication.

Your task is to rewrite the provided news data into a completely original, high-quality professional news article.

---------------------
DATA:
- Title: ${headline.title || "N/A"}
- Source: ${headline.source?.name || "N/A"}
- Key Info: ${headline.description || "N/A"}
- Language: ${language || "en"}
- Source Article URL: ${headline.url || "N/A"}
---------------------

EDITORIAL STANDARDS:
- ORIGINALITY: Do NOT rephrase. Create a fresh, original narrative.
- TONE: Professional, authoritative, engaging.
- STRUCTURE: Inverted Pyramid (most important info first).
- CONTEXT: Add brief relevant context where useful.

---------------------
STRICT OUTPUT RULES (VERY IMPORTANT):

1. OUTPUT MUST BE A VALID JSON ARRAY ONLY. NO TEXT OUTSIDE JSON.

2. REQUIRED ORDER (STRICT):
   The array MUST follow EXACT order:

   [
     { "type": "title", ... },          // EXACTLY ONE
     { "type": "summary", ... },        // EXACTLY ONE

     // Then any number of:
     { "type": "h2" | "h3" | ... },
     { "type": "p" },
     { "type": "ul" | "ol" },

     // FINAL TWO (STRICT POSITION):
     { "type": "keywords", ... },       // EXACTLY ONE (SECOND LAST)
     { "type": "tags", ... }            // EXACTLY ONE (LAST)
   ]

3. UNIQUENESS (MANDATORY):
   - "title" MUST appear EXACTLY ONCE
   - "summary" MUST appear EXACTLY ONCE
   - "keywords" MUST appear EXACTLY ONCE
   - "tags" MUST appear EXACTLY ONCE

4. LIST RULES (CRITICAL):
   - "ul" and "ol" MUST NOT contain a "title" field
   - Lists must ONLY have:
     {
       "type": "ul" | "ol",
       "items": ["...", "..."]
     }
   - If a list needs a heading, use an "h2-h6" BEFORE the list

5. CONTENT RULES:
   - Minimum 2–4 sections (h2 recommended)
   - Each section should have at least one paragraph
   - Paragraphs must be meaningful (not short filler)

6. METADATA:
   - keywords: 5–8 items
   - tags: 5–8 items

7. LANGUAGE:
   - Output MUST be in ${language || "en"}

8. INVALID OUTPUT CONDITIONS (DO NOT DO):
   - Multiple titles
   - Multiple summaries
   - Multiple keywords/tags
   - title inside list
   - text outside JSON

   Return ONLY JSON.
`;
};

// export const AI_PROMPT_ARTICLE_CONTENT = `
// Act as a Senior News Editor at a leading news publication.
// Your task is to rewrite the provided news data into a completely original, high-quality professional news article.

// DATA:
// - Title: {{title}}
// - Source: {{source}}
// - Key Info: {{description}}
// - Language: {{language}}
// - Source Article URL: {{url}}

// EDITORIAL STANDARDS:
// - ORIGINALITY: Do not simply rephrase the input. Synthesize the facts into a fresh narrative.
// - TONE: Professional, authoritative, and engaging.
// - STRUCTURE: Use the "Inverted Pyramid" style—most important info first, followed by secondary details and specifications.
// - CONTEXT: If the data mentions a brand or trend, briefly explain its significance in the current scenario.

// STRICT JSON OUTPUT FORMAT:
// Return ONLY a JSON array of objects following these rules:

// 1. TOP MATTER:
//    - Use 'title' for a punchy, SEO-friendly headline.
//    - Use 'summary' for a one-sentence "TL;DR" (Too Long; Didn't Read).

// 2. BODY CONTENT:
//    - Use 'h2' through 'h6' for logical section breaks.
//    - Use 'p' for narrative paragraphs.
//    - Use 'ul' or 'ol' for technical specs or model lineups.
//    - IMPORTANT: Lists MUST have a 'title' string and an 'items' array.

// 3. METADATA:
//    - Use 'keywords' with an array of 5-8 relevant tags from the body content.

// All output must be in {{language}} language.
// `;

// export const getPrompt = (headline: Headline, language: string): string => {
//   return `
// Act as a Senior professional News Editor at a leading news publication.
// Your task is to rewrite the provided news data into a completely original, high-quality professional news article.

// DATA:
// - Title: ${headline.title || "N/A"}
// - Source: ${headline.source?.name || "N/A"}
// - Key Info: ${headline.description || "N/A"}
// - Language: ${language || "en"}
// - Source Article URL: ${headline.url || "N/A"}

// EDITORIAL STANDARDS:
// - ORIGINALITY: Do not simply rephrase the input. Synthesize the facts into a fresh narrative.
// - TONE: Professional, authoritative, and engaging.
// - STRUCTURE: Use the "Inverted Pyramid" style—most important info first, followed by secondary details and specifications.
// - CONTEXT: If the data mentions a brand or trend, briefly explain its significance in the current scenario.

// STRICT JSON OUTPUT FORMAT:
// Return ONLY a JSON array of objects following these rules:

// 1. TOP MATTER:
//    - Use 'title' for a punchy, SEO-friendly headline.
//    - Use 'summary' for a one-sentence "TL;DR" (Too Long; Didn't Read).

// 2. BODY CONTENT:
//    - Use 'h2' through 'h6' for logical section breaks.
//    - Use 'p' for narrative paragraphs.
//    - Use 'ul' or 'ol' for technical specs or model lineups.
//    - IMPORTANT: Lists MUST have a 'title' string and an 'items' array.

// 3. METADATA:
//    - Use 'keywords' with an array of 5-8 relevant keywords from the body content.
//    - Use 'tags' with an array of 5-8 relevant tags from the body content.

// All output must be in ${language || "en"} language.
// `;
// };

// export const AI_PROMPT_ARTICLE_CONTENT = `
// Using the following news data, write a detailed article in {{language}} language.

// DATA:
// - Title: {{title}}
// - Source: {{source}}
// - Key Info: {{description}}

// STRUCTURE RULES:
// 1. Return a JSON array of objects.
// 2. Use 'h2' to 'h6' for the paragraph heading or sub-headings.
// 3. Use 'p' for paragraphs.
// 4. Use 'title' for title.
// 5. Use 'summary' for summary.
// 6. Use 'keywords' for keywords from the generated content.
// 7. For lists (specifications or features), use a 'ul' or 'ol' object.
// 8. IMPORTANT: The list object MUST include a 'title' string (e.g., 'Expected Features:') and an 'items' array of strings. Do not put the header inside the 'items' array."
// `
