import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Android emulator reaches the host machine via 10.0.2.2. On a real phone set EXPO_PUBLIC_API_URL
// to your computer's address, e.g. http://192.168.100.252:8000/api/v1
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8000/api/v1';

export const api = axios.create({ baseURL: API_URL, timeout: 15000 });

type Retryable = InternalAxiosRequestConfig & { _retried?: boolean };

// Wired up by session.ts so this file doesn't import it (they depend on each other).
let refresher: (() => Promise<string | null>) | undefined;
export function setTokenRefresher(fn: () => Promise<string | null>) {
  refresher = fn;
}

// The access token lasts an hour. On a 401 get a new one and repeat the request once.
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const config = error.config as Retryable | undefined;
    const isAuthCall = config?.url?.startsWith('/auth/');
    if (error.response?.status === 401 && config && !config._retried && !isAuthCall && refresher) {
      config._retried = true;
      const access = await refresher();
      if (access) {
        config.headers.Authorization = `Bearer ${access}`;
        return api(config);
      }
    }
    return Promise.reject(error);
  },
);

type Page<T> = { count: number; next: string | null; results: T[] };

/** Every page of a list endpoint, flattened. */
export async function getAll<T>(url: string, params?: Record<string, unknown>): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  for (;;) {
    const { data } = await api.get<Page<T>>(url, { params: { ...params, page } });
    items.push(...data.results);
    if (!data.next || page >= 20) return items;
    page += 1;
  }
}

/** A file picked on the phone, ready to be sent as multipart form data. */
export function filePart(uri: string, fallbackName = 'photo.jpg') {
  const name = uri.split('/').pop() || fallbackName;
  const ext = name.split('.').pop()?.toLowerCase();
  const type = ext === 'png' ? 'image/png' : 'image/jpeg';
  return { uri, name, type } as unknown as Blob;
}
