// Centralized API key helper for Gemini / Google GenAI client.
// The helper looks for:
//  - Vite env var: import.meta.env.VITE_GENAI_API_KEY or VITE_API_KEY
//  - window.__GENAI_API_KEY (a ad-hoc global injected for dev or testing)
//  - if window.aistudio exists, letting components use the aistudio flow (hasSelectedApiKey/openSelectKey)
//
// Usage: import { getApiKey } from './apiKey'; const key = getApiKey();
export const getApiKey = (): string | null => {
  try {
    // Vite / build-time env variables typically exposed via import.meta.env
    const env = (import.meta as any).env || {};
    const keys = [
      env.VITE_GENAI_API_KEY,
      env.VITE_API_KEY,
      env.GENAI_API_KEY,
      env.API_KEY
    ];
    for (const k of keys) {
      if (typeof k === 'string' && k.trim().length > 0) return k.trim();
    }
  } catch (e) {
    // ignore if import.meta isn't accessible in some environments
  }

  // Common browser globals that can be set by the host or devtools
  const win = window as any;
  if (win.__GENAI_API_KEY && typeof win.__GENAI_API_KEY === 'string') return win.__GENAI_API_KEY;
  if (win.__AISTUDIO_API_KEY && typeof win.__AISTUDIO_API_KEY === 'string') return win.__AISTUDIO_API_KEY;

  // If none available, return null. Consumers may call window.aistudio flows instead.
  return null;
};
