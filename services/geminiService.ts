
// This client-side helper intentionally avoids importing server-only SDKs such as
// `@google/genai` so it can be bundled safely into the browser build. For production
// AI usage you should call the server-side proxy endpoint `/api/generate-description`.

export const generateDescription = async (
  productName: string,
  keywords: string
): Promise<string> => {
  // Try to call server-side proxy first
  try {
    const resp = await fetch('/api/generate-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName, keywords }),
    });

    if (resp.ok) {
      const data = await resp.json();
      if (data && data.description) return data.description;
    }
  } catch (err) {
    // swallow - will fall back to demo text below
    console.warn('Could not reach server-side Gemini proxy:', err);
  }

  // Fallback demo description (safe for client-side use)
  return `(Demo) AI-generated description for ${productName} with keywords: ${keywords}. Feature is disabled or the server proxy is unavailable.`;
};
