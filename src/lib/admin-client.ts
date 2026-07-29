export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message = (body as { error?: string } | null)?.error ?? `Request failed (${response.status})`;
    throw new ApiError(response.status, message);
  }

  return body as T;
}

export const adminApi = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data?: unknown) =>
    request<T>(url, { method: "POST", body: data !== undefined ? JSON.stringify(data) : undefined }),
  put: <T>(url: string, data: unknown) => request<T>(url, { method: "PUT", body: JSON.stringify(data) }),
  del: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};

/** Reads a File as a base64 data URI in the browser, for image uploads. */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
