const BASE_URL = import.meta.env.VITE_BACKEND_URL; // e.g. https://tickethelp-backend.onrender.com/api

export async function api(path, { method = "GET", headers = {}, body } = {}) {
  const init = { method, headers: { ...headers } };

  if (body !== undefined) {
    if (body instanceof FormData) {
      init.body = body;
    } else {
      init.headers["Content-Type"] = "application/json";
      init.body = typeof body === "string" ? body : JSON.stringify(body);
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, init);
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    // propaga .status para que authService sepa si fue 404
    throw { status: res.status, ...errBody };
  }
  return res.json().catch(() => ({}));
}

