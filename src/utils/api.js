const BASE = (import.meta.env.VITE_API_URL || '') + '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(method, url, data, isFormData = false) {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE}${url}`, {
    method,
    headers,
    body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Error en la solicitud');
  return json;
}

export const api = {
  get: (url) => request('GET', url),
  post: (url, data) => request('POST', url, data),
  put: (url, data) => request('PUT', url, data),
  delete: (url) => request('DELETE', url),
  upload: (url, formData) => request('POST', url, formData, true),
};
