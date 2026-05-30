import { Router } from 'express'
import db from '../db.js'

const router = Router()

router.get('/', (req, res) => {
  const rows = db.prepare(`
    SELECT
      c.*,
      (SELECT COUNT(*) FROM vehicles WHERE customer_id = c.id) AS vehicle_count,
      (SELECT COUNT(*) FROM jobs    WHERE customer_id = c.id) AS job_count,
      (SELECT COALESCE(SUM(total),0) FROM jobs WHERE customer_id = c.id AND status IN ('completed','invoiced','paid')) AS total_spent,
      (SELECT MAX(date) FROM jobs WHERE customer_id = c.id) AS last_service
    FROM customers c
    WHERE c.deleted_at IS NULL
    ORDER BY c.name COLLATE NOCASE
  `).all()
  res.json(rows)
})

router.get('/:id', (req, res) => {
  const c = db.prepare('SELECT * FROM customers WHERE id = ? AND deleted_at IS NULL').get(req.params.id)
  if (!c) return res.status(404).json({ error: 'Not found' })

  const vehicles = db.prepare('SELECT * FROM vehicles WHERE customer_id = ? ORDER BY id').all(c.id)
  const jobs = db.prepare(`
    SELECT j.*,
      v.year || ' ' || v.make || ' ' || v.model AS vehicle, v.plate
    FROM jobs j
    LEFT JOIN vehicles v ON j.vehicle_id = v.id
    WHERE j.customer_id = ?
    ORDER BY j.date DESC
  `).all(c.id)

  for (const j of jobs) {
    j.services = db.prepare('SELECT * FROM job_services WHERE job_id = ?').all(j.id)
  }

  res.json({ ...c, vehicles, jobs })
})

router.post('/', (req, res) => {
  const { name, phone, email, address, notes } = req.body
  if (!name?.trim()) return res.status(400).json({ error: 'Name required' })
  const r = db.prepare(
    'INSERT INTO customers (name, phone, email, address, notes) VALUES (?, ?, ?, ?, ?)'
  ).run(name.trim(), phone || null, email || null, address || null, notes || null)
  res.json(db.prepare('SELECT * FROM customers WHERE id = ?').get(r.lastInsertRowid))
})

router.put('/:id', (req, res) => {
  const { name, phone, email, address, notes } = req.body
  db.prepare(
    'UPDATE customers SET name=?, phone=?, email=?, address=?, notes=? WHERE id=?'
  ).run(name, phone || null, email || null, address || null, notes || null, req.params.id)
  res.json(db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id))
})

router.delete('/:id', (req, res) => {
  db.prepare("UPDATE customers SET deleted_at = datetime('now') WHERE id = ?").run(req.params.id)
  res.json({ ok: true })
})

export default router
