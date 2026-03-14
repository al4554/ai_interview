export const parseModelOutput = (rawText, fallback) => {
  if (!rawText || typeof rawText !== "string") {
    return fallback;
  }

  try {
    return JSON.parse(rawText);
  } catch (firstError) {
    const firstBrace = rawText.indexOf("{");
    const lastBrace = rawText.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
      return fallback;
    }

    const candidateJson = rawText.slice(firstBrace, lastBrace + 1);

    try {
      return JSON.parse(candidateJson);
    } catch (secondError) {
      return fallback;
    }
  }
};
