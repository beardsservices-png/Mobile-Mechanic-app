const BASE = import.meta.env.VITE_API_URL || ''

async function req(method, path, body) {
  const opts = {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  }
  const res = await fetch(`${BASE}${path}`, opts)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || res.statusText)
  }
  return res.json()
}

export const api = {
  get:    (path)        => req('GET',    path),
  post:   (path, body)  => req('POST',   path, body),
  put:    (path, body)  => req('PUT',    path, body),
  delete: (path)        => req('DELETE', path),
  pdfUrl: (path)        => `${BASE}${path}`,
}

// ── Customers ──
export const customers = {
  list:   ()     => api.get('/api/customers'),
  get:    (id)   => api.get(`/api/customers/${id}`),
  create: (body) => api.post('/api/customers', body),
  update: (id, body) => api.put(`/api/customers/${id}`, body),
  delete: (id)   => api.delete(`/api/customers/${id}`),
}

// ── Vehicles ──
export const vehicles = {
  list:   (customerId) => api.get(`/api/vehicles?customerId=${customerId}`),
  create: (body)       => api.post('/api/vehicles', body),
  update: (id, body)   => api.put(`/api/vehicles/${id}`, body),
}

// ── Jobs ──
export const jobs = {
  list:   (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([,v]) => v != null)).toString()
    return api.get(`/api/jobs${qs ? '?' + qs : ''}`)
  },
  get:    (id)   => api.get(`/api/jobs/${id}`),
  create: (body) => api.post('/api/jobs', body),
  update: (id, body) => api.put(`/api/jobs/${id}`, body),
  delete: (id)   => api.delete(`/api/jobs/${id}`),
}

// ── Check-In ──
export const checkin = {
  submit: (body) => api.post('/api/checkin', body),
}

// ── Estimates ──
export const estimates = {
  list:    ()     => api.get('/api/estimates'),
  get:     (id)   => api.get(`/api/estimates/${id}`),
  create:  (body) => api.post('/api/estimates', body),
  update:  (id, body) => api.put(`/api/estimates/${id}`, body),
  convert: (id)   => api.post(`/api/estimates/${id}/convert`),
  pdfUrl:  (id)   => api.pdfUrl(`/api/estimates/${id}/pdf`),
}

// ── Invoices ──
export const invoices = {
  list:   (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([,v]) => v != null)).toString()
    return api.get(`/api/invoices${qs ? '?' + qs : ''}`)
  },
  get:    (id)   => api.get(`/api/invoices/${id}`),
  create: (body) => api.post('/api/invoices', body),
  update: (id, body) => api.put(`/api/invoices/${id}`, body),
  pdfUrl: (id)   => api.pdfUrl(`/api/invoices/${id}/pdf`),
}

// ── Mileage ──
export const mileage = {
  list:   (year) => api.get(`/api/mileage${year ? '?year=' + year : ''}`),
  create: (body) => api.post('/api/mileage', body),
  delete: (id)   => api.delete(`/api/mileage/${id}`),
}

// ── Expenses ──
export const expenses = {
  list:   (year) => api.get(`/api/expenses${year ? '?year=' + year : ''}`),
  create: (body) => api.post('/api/expenses', body),
  delete: (id)   => api.delete(`/api/expenses/${id}`),
}

// ── Reports ──
export const reports = {
  revenue:  (from, to) => api.get(`/api/reports/revenue?from=${from||''}&to=${to||''}`),
  mileage:  (year)     => api.get(`/api/reports/mileage?year=${year||''}`),
  expenses: (year)     => api.get(`/api/reports/expenses?year=${year||''}`),
}
