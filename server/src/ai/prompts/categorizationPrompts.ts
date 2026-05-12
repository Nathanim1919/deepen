export function buildCategorizationPrompt(
  captureTitle: string,
  captureTags: string[],
  captureSummaryExcerpt: string,
  existingCollectionNames: string[],
): string {
  const tagsStr = captureTags.length > 0 ? captureTags.join(", ") : "none";

  const collectionsSection =
    existingCollectionNames.length > 0
      ? `Existing collections:\n${existingCollectionNames.map((n, i) => `${i + 1}. ${n}`).join("\n")}`
      : "The user has no collections yet.";

  return `You are a categorization assistant for a knowledge management app. Given a captured web page, decide which collection (folder) it belongs to.

${collectionsSection}

Captured page:
- Title: ${captureTitle}
- Tags: ${tagsStr}
- Summary: ${captureSummaryExcerpt}

Rules:
- If an existing collection is a good fit, use its EXACT name.
- If no existing collection fits, create a short descriptive name (2-4 words, Title Case).
- Respond with ONLY a JSON object: {"collection": "<name>"}
- No explanation, no extra text.`;
}
