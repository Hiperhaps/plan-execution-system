import { getDeepSeekConfig } from "@/lib/config";

type DeepSeekMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
};

type DeepSeekChatOptions = {
  messages: DeepSeekMessage[];
  responseFormat?: {
    type: "json_object";
  };
  maxTokens?: number;
};

export class DeepSeekRequestError extends Error {
  constructor(message = "DeepSeek API request failed.") {
    super(message);
    this.name = "DeepSeekRequestError";
  }
}

async function parseDeepSeekResponse(response: Response) {
  try {
    return (await response.json()) as DeepSeekResponse;
  } catch {
    throw new DeepSeekRequestError("DeepSeek API response is not valid JSON.");
  }
}

export async function createDeepSeekChatCompletion({
  messages,
  responseFormat,
  maxTokens,
}: DeepSeekChatOptions) {
  const { apiKey, apiUrl, model, timeoutMs } = getDeepSeekConfig();

  if (!apiKey) {
    throw new DeepSeekRequestError("DEEPSEEK_API_KEY is not configured.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response: Response;

  try {
    response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages,
        response_format: responseFormat,
        max_tokens: maxTokens,
      }),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new DeepSeekRequestError("DeepSeek API request timed out.");
    }

    throw new DeepSeekRequestError();
  } finally {
    clearTimeout(timeout);
  }

  const payload = await parseDeepSeekResponse(response);

  if (!response.ok) {
    throw new DeepSeekRequestError(
      payload.error?.message || "DeepSeek API request failed.",
    );
  }

  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new DeepSeekRequestError("DeepSeek API did not return content.");
  }

  return content;
}
