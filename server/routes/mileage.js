import { Router } from 'express'
import db from '../db.js'

const router = Router()

router.get('/', (req, res) => {
  const { year } = req.query
  let sql = 'SELECT m.*, j.customer_id FROM mileage_log m LEFT JOIN jobs j ON m.job_id = j.id WHERE 1=1'
  const params = []
  if (year) { sql += " AND strftime('%Y', m.date) = ?"; params.push(String(year)) }
  sql += ' ORDER BY m.date DESC'
  const rows = db.prepare(sql).all(...params)
  res.json(rows)
})

router.post('/', (req, res) => {
  const { job_id, date, from_loc, to_loc, miles, purpose } = req.body
  const r = db.prepare(
    'INSERT INTO mileage_log (job_id, date, from_loc, to_loc, miles, purpose) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(job_id || null, date || new Date().toISOString().slice(0,10), from_loc || null, to_loc || null, miles || 0, purpose || null)
  res.json(db.prepare('SELECT * FROM mileage_log WHERE id = ?').get(r.lastInsertRowid))
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM mileage_log WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

export default router
