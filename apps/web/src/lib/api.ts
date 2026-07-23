const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

type ApiOptions = RequestInit & { token?: string };

export async function api(path: string, options: ApiOptions = {}) {
  const { token, headers, ...rest } = options;
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'Erro na API');
  }
  return res.json();
}
