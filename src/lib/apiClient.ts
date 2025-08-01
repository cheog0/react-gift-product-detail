export class ApiError extends Error {
  constructor(
    message: string,

    public status: number,

    public data?: unknown
  ) {
    super(message);

    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): HeadersInit {
    const stored = sessionStorage.getItem('userInfo');

    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);

        const token = parsedUser?.authToken;

        return token ? { Authorization: token } : {};
      } catch {
        return {};
      }
    }

    return {};
  }

  private async request<T>(
    endpoint: string,

    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',

        ...this.getAuthHeaders(),

        ...options.headers,
      },

      ...options,
    });

    if (!response.ok) {
      let errorData: Record<string, unknown> = {};

      try {
        errorData = await response.json();
      } catch {
        // JSON 파싱 실패 시 빈 객체 유지
      }

      const errorMessage =
        errorData.data &&
        typeof errorData.data === 'object' &&
        'message' in errorData.data
          ? String(errorData.data.message)
          : typeof errorData.message === 'string'
            ? errorData.message
            : response.statusText;

      throw new ApiError(errorMessage, response.status, errorData);
    }

    const data = await response.json();

    return data.data;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',

      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',

      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
);
