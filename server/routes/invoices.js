import { Router } from 'express'
import db from '../db.js'
import { generateInvoicePDF } from '../pdf/invoice.js'

const router = Router()

function nextInvNum() {
  const now  = new Date()
  const yymm = `${String(now.getFullYear()).slice(2)}${String(now.getMonth()+1).padStart(2,'0')}`
  const last = db.prepare(`SELECT invoice_num FROM invoices WHERE invoice_num LIKE ? ORDER BY id DESC LIMIT 1`).get(`INV-${yymm}-%`)
  if (!last) return `INV-${yymm}-01`
  const n = parseInt(last.invoice_num.split('-')[2]) + 1
  return `INV-${yymm}-${String(n).padStart(2,'0')}`
}

function hydrateInv(row) {
  if (!row) return null
  if (row.job_id) {
    row.services = db.prepare('SELECT * FROM job_services WHERE job_id = ? ORDER BY id').all(row.job_id)
  } else {
    row.services = []
  }
  return row
}

const BASE = `
  SELECT i.*,
    c.name AS customer_name, c.phone AS customer_phone,
    v.year || ' ' || v.make || ' ' || v.model AS vehicle, v.plate,
    j.work_performed, j.parts_used
  FROM invoices i
  LEFT JOIN customers c ON i.customer_id = c.id
  LEFT JOIN vehicles  v ON i.vehicle_id  = v.id
  LEFT JOIN jobs      j ON i.job_id      = j.id
`

router.get('/', (req, res) => {
  const { status } = req.query
  let sql = BASE + ' WHERE 1=1'
  const params = []
  if (status) { sql += ' AND i.status = ?'; params.push(status) }
  sql += ' ORDER BY i.created_at DESC'
  const rows = db.prepare(sql).all(...params)
  for (const r of rows) hydrateInv(r)
  res.json(rows)
})

router.get('/:id', (req, res) => {
  const row = db.prepare(BASE + ' WHERE i.id = ?').get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Not found' })
  res.json(hydrateInv(row))
})

router.post('/', (req, res) => {
  const { job_id, customer_id, vehicle_id, notes, due_date } = req.body
  if (!customer_id) return res.status(400).json({ error: 'customer_id required' })

  let total = 0
  if (job_id) {
    const job = db.prepare('SELECT total FROM jobs WHERE id = ?').get(job_id)
    if (job) total = job.total
  }

  const num = nextInvNum()
  const dueDate = due_date || (() => {
    const d = new Date(); d.setDate(d.getDate() + 14); return d.toISOString().slice(0,10)
  })()

  const r = db.prepare(
    'INSERT INTO invoices (invoice_num, job_id, customer_id, vehicle_id, status, subtotal, total, notes, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(num, job_id || null, customer_id, vehicle_id || null, 'unpaid', total, total, notes || null, dueDate)

  if (job_id) {
    db.prepare("UPDATE jobs SET status='invoiced', updated_at=datetime('now') WHERE id=?").run(job_id)
  }

  const inv = db.prepare(BASE + ' WHERE i.id = ?').get(r.lastInsertRowid)
  res.json(hydrateInv(inv))
})

router.put('/:id', (req, res) => {
  const { status, paid_amount, payment_method, notes, due_date } = req.body
  const existing = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })

  const newStatus      = status         ?? existing.status
  const newPaid        = paid_amount    ?? existing.paid_amount
  const newMethod      = payment_method ?? existing.payment_method
  const paidAt         = (newStatus === 'paid' && !existing.paid_at) ? new Date().toISOString() : existing.paid_at

  db.prepare(`
    UPDATE invoices SET status=?, paid_amount=?, payment_method=?, notes=?, due_date=?, paid_at=? WHERE id=?
  `).run(newStatus, newPaid, newMethod || null, notes !== undefined ? notes : existing.notes,
         due_date || existing.due_date, paidAt, req.params.id)

  if (newStatus === 'paid' && existing.job_id) {
    db.prepare("UPDATE jobs SET status='paid', updated_at=datetime('now') WHERE id=?").run(existing.job_id)
  }

  const updated = db.prepare(BASE + ' WHERE i.id = ?').get(req.params.id)
  res.json(hydrateInv(updated))
})

// PDF download
router.get('/:id/pdf', (req, res) => {
  const inv = db.prepare(BASE + ' WHERE i.id = ?').get(req.params.id)
  if (!inv) return res.status(404).json({ error: 'Not found' })
  hydrateInv(inv)

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `inline; filename="${inv.invoice_num}.pdf"`)
  generateInvoicePDF(inv, res)
})

export default router
