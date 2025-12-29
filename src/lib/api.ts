export async function api(url: string, options: any = {}) {
  const baseUrl = 'http://127.0.0.1:8000/api';
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const res = await fetch(baseUrl + url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw data; // throw Laravel validation errors
  }

  return data;
}
