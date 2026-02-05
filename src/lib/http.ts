/**
 * HTTP Client
 * Simple fetch wrapper for calling Next.js Route Handlers
 * 
 * Note: This is for calling internal Route Handlers only (baseUrl = '')
 * For external API calls, use axios from lib/axios.ts
 */

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  headers?: Record<string, string>;
}

class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    method: HttpMethod,
    url: string,
    body?: any,
    options?: RequestOptions
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    const config: RequestInit = {
      method,
      headers,
    };

    if (body !== null && body !== undefined) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${url}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new HttpError(response.status, data);
    }

    return data;
  }

  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", url, undefined, options);
  }

  post<T>(url: string, body: any, options?: RequestOptions): Promise<T> {
    return this.request<T>("POST", url, body, options);
  }

  put<T>(url: string, body: any, options?: RequestOptions): Promise<T> {
    return this.request<T>("PUT", url, body, options);
  }

  patch<T>(url: string, body: any, options?: RequestOptions): Promise<T> {
    return this.request<T>("PATCH", url, body, options);
  }

  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("DELETE", url, undefined, options);
  }
}

export class HttpError extends Error {
  status: number;
  payload: any;

  constructor(status: number, payload: any) {
    super(payload?.message || "HTTP Error");
    this.status = status;
    this.payload = payload;
  }
}

// Export singleton instance for Route Handler calls
export const httpClient = new HttpClient();

// Export class for custom instances if needed
export default HttpClient;
