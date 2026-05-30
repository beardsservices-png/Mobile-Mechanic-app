import { Router } from 'express'
import db from '../db.js'

const router = Router()

router.get('/revenue', (req, res) => {
  const { from, to } = req.query
  const rows = db.prepare(`
    SELECT
      strftime('%Y-%W', date) AS week_key,
      MIN(date) AS week_start,
      COUNT(*) AS job_count,
      SUM(total) AS revenue
    FROM jobs
    WHERE status IN ('completed','invoiced','paid')
      AND (? IS NULL OR date >= ?)
      AND (? IS NULL OR date <= ?)
    GROUP BY week_key
    ORDER BY week_key
  `).all(from||null, from||null, to||null, to||null)
  res.json(rows)
})

router.get('/mileage', (req, res) => {
  const year = req.query.year || new Date().getFullYear()
  const total = db.prepare(`
    SELECT COALESCE(SUM(miles),0) AS total_miles, COUNT(*) AS trips
    FROM mileage_log WHERE strftime('%Y', date) = ?
  `).get(String(year))
  const byMonth = db.prepare(`
    SELECT strftime('%Y-%m', date) AS month, SUM(miles) AS miles, COUNT(*) AS trips
    FROM mileage_log WHERE strftime('%Y', date) = ?
    GROUP BY month ORDER BY month
  `).all(String(year))
  res.json({ year, ...total, by_month: byMonth })
})

router.get('/expenses', (req, res) => {
  const year = req.query.year || new Date().getFullYear()
  const total = db.prepare(`
    SELECT COALESCE(SUM(amount),0) AS total_amount FROM expenses WHERE strftime('%Y', date) = ?
  `).get(String(year))
  const byCategory = db.prepare(`
    SELECT category, SUM(amount) AS amount, COUNT(*) AS count
    FROM expenses WHERE strftime('%Y', date) = ?
    GROUP BY category ORDER BY amount DESC
  `).all(String(year))
  res.json({ year, ...total, by_category: byCategory })
})

export default router
