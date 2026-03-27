const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

const authHeaders = () => {
  const token = localStorage.getItem("access")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function api(path, { method = "GET", headers = {}, body } = {}) {
  const ls = localStorage.getItem("access")
  const ss = sessionStorage.getItem("access")
  const token = ss || ls

  const init = {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  }

  if (body !== undefined) {
    if (body instanceof FormData) {
      init.body = body
    } else {
      init.headers["Content-Type"] = init.headers["Content-Type"] || "application/json"
      init.body = typeof body === "string" ? body : JSON.stringify(body)
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, init)
  const text = await res.text()
  let data = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {}

  if (!res.ok) {
    let errMsg = data?.message || data?.detail || data?.error || res.statusText || "Error de API"
    if (data && typeof data === 'object' && !data.message && !data.detail && !data.error) {
       const firstKey = Object.keys(data)[0];
       if (firstKey && Array.isArray(data[firstKey])) {
           errMsg = data[firstKey][0];
       } else if (typeof data[firstKey] === 'string') {
           errMsg = data[firstKey];
       }
    }
    const err = new Error(errMsg)
    err.status = res.status
    err.data = data

    if (res.status === 401) {
        localStorage.removeItem("access");
        sessionStorage.removeItem("access");
        window.location.href = "/auth/login";
    }

    throw err
  }
  return data
}
