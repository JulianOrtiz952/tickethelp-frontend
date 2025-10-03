const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const authHeaders = () => {
  const token = localStorage.getItem("access"); // si aún no usas JWT, no pasa nada
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function api(path, { method = "GET", body, headers = {} } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJSON = (res.headers.get("content-type") || "").includes("application/json");
  const data = isJSON ? await res.json() : null;

  if (!res.ok) throw (data || { detail: "Error de red" });
  return data;
}
