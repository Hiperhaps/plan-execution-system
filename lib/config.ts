const DEFAULT_DEEPSEEK_MODEL = "deepseek-v4-flash";
const DEFAULT_DEEPSEEK_BASE_URL = "https://api.deepseek.com";
const DEFAULT_DEEPSEEK_TIMEOUT_MS = 30_000;

function getPositiveNumber(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getDeepSeekConfig() {
  const baseUrl =
    process.env.DEEPSEEK_BASE_URL || DEFAULT_DEEPSEEK_BASE_URL;

  return {
    apiKey: process.env.DEEPSEEK_API_KEY,
    model: process.env.DEEPSEEK_MODEL || DEFAULT_DEEPSEEK_MODEL,
    apiUrl: `${baseUrl.replace(/\/$/, "")}/chat/completions`,
    timeoutMs: getPositiveNumber(
      process.env.DEEPSEEK_TIMEOUT_MS,
      DEFAULT_DEEPSEEK_TIMEOUT_MS,
    ),
  };
}
