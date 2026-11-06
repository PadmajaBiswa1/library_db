import { ApiResponse } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export class ApiError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(message: string, statusCode = 500, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const api = {
  async get<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
    let url = `${BASE_URL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== '') {
          searchParams.append(key, String(val));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: ApiResponse<T> = await res.json();
    if (!res.ok || !data.success) {
      throw new ApiError(data.message || 'Request failed', res.status, data);
    }
    return data.data;
  },

  async post<T>(endpoint: string, payload: any): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data: ApiResponse<T> = await res.json();
    if (!res.ok || !data.success) {
      throw new ApiError(data.message || 'Request failed', res.status, data);
    }
    return data.data;
  },

  async put<T>(endpoint: string, payload: any): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data: ApiResponse<T> = await res.json();
    if (!res.ok || !data.success) {
      throw new ApiError(data.message || 'Request failed', res.status, data);
    }
    return data.data;
  },

  async patch<T>(endpoint: string, payload?: any): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload ? JSON.stringify(payload) : undefined,
    });

    const data: ApiResponse<T> = await res.json();
    if (!res.ok || !data.success) {
      throw new ApiError(data.message || 'Request failed', res.status, data);
    }
    return data.data;
  },

  async delete<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: ApiResponse<T> = await res.json();
    if (!res.ok || !data.success) {
      throw new ApiError(data.message || 'Request failed', res.status, data);
    }
    return data.data;
  },
};
