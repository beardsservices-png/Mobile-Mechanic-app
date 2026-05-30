import { Router } from 'express'
import db from '../db.js'
import { generateEstimatePDF } from '../pdf/estimate.js'

const router = Router()

function nextEstNum() {
  const now  = new Date()
  const yymm = `${String(now.getFullYear()).slice(2)}${String(now.getMonth()+1).padStart(2,'0')}`
  const last = db.prepare(`SELECT estimate_num FROM estimates WHERE estimate_num LIKE ? ORDER BY id DESC LIMIT 1`).get(`EST-${yymm}-%`)
  if (!last) return `EST-${yymm}-01`
  const n = parseInt(last.estimate_num.split('-')[2]) + 1
  return `EST-${yymm}-${String(n).padStart(2,'0')}`
}

function hydrateEst(row) {
  if (!row) return null
  row.items = db.prepare('SELECT * FROM estimate_items WHERE estimate_id = ? ORDER BY id').all(row.id)
  return row
}

const BASE = `
  SELECT e.*,
    c.name AS customer_name, c.phone AS customer_phone,
    v.year || ' ' || v.make || ' ' || v.model AS vehicle, v.plate
  FROM estimates e
  LEFT JOIN customers c ON e.customer_id = c.id
  LEFT JOIN vehicles  v ON e.vehicle_id  = v.id
`

router.get('/', (req, res) => {
  const rows = db.prepare(BASE + ' ORDER BY e.created_at DESC').all()
  for (const r of rows) hydrateEst(r)
  res.json(rows)
})

router.get('/:id', (req, res) => {
  const row = db.prepare(BASE + ' WHERE e.id = ?').get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Not found' })
  res.json(hydrateEst(row))
})

router.post('/', (req, res) => {
  const { customer_id, vehicle_id, notes, valid_until, items } = req.body
  const num      = nextEstNum()
  const subtotal = (items || []).reduce((s, i) => s + i.price * (i.qty || 1), 0)

  db.transaction(() => {
    const r = db.prepare(
      'INSERT INTO estimates (estimate_num, customer_id, vehicle_id, status, subtotal, total, notes, valid_until) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(num, customer_id, vehicle_id || null, 'draft', subtotal, subtotal, notes || null, valid_until || null)
    const estId = r.lastInsertRowid
    const ins = db.prepare('INSERT INTO estimate_items (estimate_id, name, price, qty, category) VALUES (?, ?, ?, ?, ?)')
    for (const item of (items || [])) {
      ins.run(estId, item.name, item.price, item.qty || 1, item.category || null)
    }
    const est = db.prepare(BASE + ' WHERE e.id = ?').get(estId)
    res.json(hydrateEst(est))
  })()
})

router.put('/:id', (req, res) => {
  const { status, notes, valid_until, items } = req.body
  const existing = db.prepare('SELECT * FROM estimates WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })

  db.transaction(() => {
    const subtotal = items !== undefined
      ? items.reduce((s, i) => s + i.price * (i.qty || 1), 0)
      : existing.subtotal

    db.prepare('UPDATE estimates SET status=?, notes=?, valid_until=?, subtotal=?, total=? WHERE id=?').run(
      status || existing.status, notes !== undefined ? notes : existing.notes,
      valid_until || existing.valid_until, subtotal, subtotal, req.params.id
    )

    if (items !== undefined) {
      db.prepare('DELETE FROM estimate_items WHERE estimate_id = ?').run(req.params.id)
      const ins = db.prepare('INSERT INTO estimate_items (estimate_id, name, price, qty, category) VALUES (?, ?, ?, ?, ?)')
      for (const item of items) ins.run(req.params.id, item.name, item.price, item.qty || 1, item.category || null)
    }
  })()

  const updated = db.prepare(BASE + ' WHERE e.id = ?').get(req.params.id)
  res.json(hydrateEst(updated))
})

// Convert approved estimate to a job
router.post('/:id/convert', (req, res) => {
  const est = db.prepare(BASE + ' WHERE e.id = ?').get(req.params.id)
  if (!est) return res.status(404).json({ error: 'Not found' })
  hydrateEst(est)

  db.transaction(() => {
    const jr = db.prepare(
      'INSERT INTO jobs (customer_id, vehicle_id, status, date, total) VALUES (?, ?, ?, ?, ?)'
    ).run(est.customer_id, est.vehicle_id, 'scheduled', new Date().toISOString().slice(0,10), est.total)
    const jobId = jr.lastInsertRowid

    const ins = db.prepare('INSERT INTO job_services (job_id, name, price, qty, category) VALUES (?, ?, ?, ?, ?)')
    for (const item of est.items) ins.run(jobId, item.name, item.price, item.qty, item.category)

    db.prepare("UPDATE estimates SET status='converted' WHERE id=?").run(req.params.id)
    res.json({ job_id: jobId })
  })()
})

// PDF download
router.get('/:id/pdf', (req, res) => {
  const est = db.prepare(BASE + ' WHERE e.id = ?').get(req.params.id)
  if (!est) return res.status(404).json({ error: 'Not found' })
  hydrateEst(est)

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `inline; filename="${est.estimate_num}.pdf"`)
  generateEstimatePDF(est, res)
})

export default router
