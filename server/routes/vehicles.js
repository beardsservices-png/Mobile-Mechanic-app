import { Router } from 'express'
import db from '../db.js'

const router = Router()

router.get('/', (req, res) => {
  const { customerId } = req.query
  if (!customerId) return res.status(400).json({ error: 'customerId required' })
  const rows = db.prepare('SELECT * FROM vehicles WHERE customer_id = ? ORDER BY id').all(customerId)
  res.json(rows)
})

router.post('/', (req, res) => {
  const { customer_id, year, make, model, trim, color, plate, vin, mileage_in, notes } = req.body
  if (!customer_id) return res.status(400).json({ error: 'customer_id required' })
  const r = db.prepare(
    'INSERT INTO vehicles (customer_id, year, make, model, trim, color, plate, vin, mileage_in, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(customer_id, year || null, make || null, model || null, trim || null, color || null, plate || null, vin || null, mileage_in || null, notes || null)
  res.json(db.prepare('SELECT * FROM vehicles WHERE id = ?').get(r.lastInsertRowid))
})

router.put('/:id', (req, res) => {
  const { year, make, model, trim, color, plate, vin, mileage_in, mileage_last, notes } = req.body
  db.prepare(
    'UPDATE vehicles SET year=?, make=?, model=?, trim=?, color=?, plate=?, vin=?, mileage_in=?, mileage_last=?, notes=? WHERE id=?'
  ).run(year, make, model, trim || null, color || null, plate || null, vin || null, mileage_in || null, mileage_last || null, notes || null, req.params.id)
  res.json(db.prepare('SELECT * FROM vehicles WHERE id = ?').get(req.params.id))
})

export default router
