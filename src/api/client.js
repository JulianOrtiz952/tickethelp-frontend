
const BASE_URL = "https:tickethelp-backend.onrender.com";

const authHeaders = () => {
  const token = localStorage.getItem("access")
  return token ? { Authorization: `Bearer ${token}` } : {}
}


export async function api(path, { method = "GET", headers = {}, body } = {}) {
  const ls = localStorage.getItem("access");
  const ss = sessionStorage.getItem("access");
  const token = ss || ls;

  const init = {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (body !== undefined) {
    if (body instanceof FormData) {
      init.body = body;
    } else {
      init.headers["Content-Type"] = init.headers["Content-Type"] || "application/json";
      init.body = typeof body === "string" ? body : JSON.stringify(body);
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, init);
  const text = await res.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { }

  if (!res.ok) {
    const err = new Error(data?.detail || res.statusText || "Error de API");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
