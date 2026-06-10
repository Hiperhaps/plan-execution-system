export class HttpRequestError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "HttpRequestError";
  }
}

async function readPayload(response: Response) {
  try {
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

function getPayloadMessage(payload: unknown) {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  return null;
}

export function getRequestErrorMessage(error: unknown, fallback: string) {
  return error instanceof HttpRequestError ? error.message : fallback;
}

export async function requestJson<T>(
  url: string,
  init: RequestInit,
  fallbackMessage: string,
) {
  let response: Response;

  try {
    response = await fetch(url, init);
  } catch {
    throw new HttpRequestError("网络请求失败，请稍后再试。");
  }

  const payload = await readPayload(response);

  if (!response.ok) {
    throw new HttpRequestError(
      getPayloadMessage(payload) ?? fallbackMessage,
      response.status,
    );
  }

  if (payload === null) {
    throw new HttpRequestError("服务器返回格式不正确。", response.status);
  }

  return payload as T;
}
