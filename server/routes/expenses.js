import { Router } from 'express'
import db from '../db.js'

const router = Router()

router.get('/', (req, res) => {
  const { year } = req.query
  let sql = 'SELECT * FROM expenses WHERE 1=1'
  const params = []
  if (year) { sql += " AND strftime('%Y', date) = ?"; params.push(String(year)) }
  sql += ' ORDER BY date DESC'
  const rows = db.prepare(sql).all(...params)
  res.json(rows)
})

router.post('/', (req, res) => {
  const { job_id, date, category, description, amount, receipt_note } = req.body
  const r = db.prepare(
    'INSERT INTO expenses (job_id, date, category, description, amount, receipt_note) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(job_id || null, date || new Date().toISOString().slice(0,10), category || 'other', description || null, amount || 0, receipt_note || null)
  res.json(db.prepare('SELECT * FROM expenses WHERE id = ?').get(r.lastInsertRowid))
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM expenses WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

export default router
