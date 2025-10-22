const BASE_URL = import.meta.env.VITE_BACKEND_URL

const authHeaders = () => {
  const token = localStorage.getItem("access")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function api(path, { method = "GET", headers = {}, body } = {}) {
  const init = { method, headers: { ...headers } };

  if (body !== undefined) {
    if (body instanceof FormData) {
      // No pongas Content-Type manualmente
      init.body = body;
    } else {
      init.headers["Content-Type"] = "application/json";
      init.body = typeof body === "string" ? body : JSON.stringify(body);
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, init);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }
  return res.json().catch(() => ({}));
}
