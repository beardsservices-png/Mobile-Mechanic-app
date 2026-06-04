import { Router } from 'express'
import db from '../db.js'

const router = Router()

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM settings').all()
  const obj = {}
  for (const r of rows) obj[r.key] = r.value
  res.json(obj)
})

router.put('/', (req, res) => {
  const allowed = ['business_name','business_type','phone','website','labor_rate','markup','invoice_due_days','mileage_rate','tax_year']
  const upsert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
  db.transaction(() => {
    for (const key of allowed) {
      if (req.body[key] !== undefined) upsert.run(key, String(req.body[key]))
    }
  })()
  const rows = db.prepare('SELECT key, value FROM settings').all()
  const obj = {}
  for (const r of rows) obj[r.key] = r.value
  res.json(obj)
})

export default router
