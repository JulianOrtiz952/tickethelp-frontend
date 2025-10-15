// client.js
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const authHeaders = () => {
  const token = localStorage.getItem("access");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function api(path, { method = "GET", body, headers = {} } = {}) {
  const init = {
    method,
    headers: {
      Accept: "application/json",
      ...authHeaders(),
      ...headers,
    },
  };

  // Sólo setear Content-Type/JSON si hay body
  if (body !== undefined) {
    init.headers["Content-Type"] = "application/json";
    init.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, init);
  const contentType = res.headers.get("content-type") || "";
  const isJSON = contentType.includes("application/json");
  const data = isJSON ? await res.json() : await res.text().catch(() => null);

  if (!res.ok) {
    // Lanza un objeto con status + payload de error (compatible con tu patrón)
    const errorPayload = typeof data === "string" ? { detail: data } : (data || {});
    errorPayload.status = res.status;
    throw errorPayload;
  }

  return isJSON ? data : { text: data };
}
