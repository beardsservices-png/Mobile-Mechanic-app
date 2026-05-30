import { Router } from 'express'
import db from '../db.js'

const router = Router()

function hydrateJob(row) {
  if (!row) return null
  row.services   = db.prepare('SELECT * FROM job_services WHERE job_id = ? ORDER BY id').all(row.id)
  row.parts_used = JSON.parse(row.parts_used || '[]')
  return row
}

const BASE_SELECT = `
  SELECT j.*,
    c.name  AS customer_name,
    c.phone AS customer_phone,
    v.year || ' ' || v.make || ' ' || v.model AS vehicle,
    v.plate, v.mileage_in, v.color
  FROM jobs j
  LEFT JOIN customers c ON j.customer_id = c.id
  LEFT JOIN vehicles  v ON j.vehicle_id  = v.id
`

router.get('/', (req, res) => {
  const { status, date, customerId } = req.query
  let sql = BASE_SELECT + ' WHERE 1=1'
  const params = []
  if (status)     { sql += ' AND j.status = ?';       params.push(status) }
  if (date)       { sql += ' AND j.date = ?';          params.push(date) }
  if (customerId) { sql += ' AND j.customer_id = ?';   params.push(customerId) }
  sql += ' ORDER BY j.date DESC, j.id DESC'
  const rows = db.prepare(sql).all(...params)
  for (const r of rows) hydrateJob(r)
  res.json(rows)
})

router.get('/:id', (req, res) => {
  const row = db.prepare(BASE_SELECT + ' WHERE j.id = ?').get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Not found' })
  res.json(hydrateJob(row))
})

router.post('/', (req, res) => {
  const { customer_id, vehicle_id, status, date, symptom, complaint, total } = req.body
  const r = db.prepare(
    'INSERT INTO jobs (customer_id, vehicle_id, status, date, symptom, complaint, total) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(customer_id, vehicle_id || null, status || 'scheduled', date || new Date().toISOString().slice(0,10), symptom || null, complaint || null, total || 0)
  const job = db.prepare(BASE_SELECT + ' WHERE j.id = ?').get(r.lastInsertRowid)
  res.json(hydrateJob(job))
})

router.put('/:id', (req, res) => {
  const {
    status, date, symptom, complaint, diagnosis,
    work_performed, parts_used, tech_notes, total,
    services
  } = req.body

  const existing = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })

  db.transaction(() => {
    db.prepare(`
      UPDATE jobs SET
        status=?, date=?, symptom=?, complaint=?, diagnosis=?,
        work_performed=?, parts_used=?, tech_notes=?, total=?,
        updated_at=datetime('now')
      WHERE id=?
    `).run(
      status          ?? existing.status,
      date            ?? existing.date,
      symptom         ?? existing.symptom,
      complaint       ?? existing.complaint,
      diagnosis       !== undefined ? diagnosis      : existing.diagnosis,
      work_performed  !== undefined ? work_performed : existing.work_performed,
      parts_used      !== undefined ? JSON.stringify(parts_used) : existing.parts_used,
      tech_notes      !== undefined ? tech_notes     : existing.tech_notes,
      total           ?? existing.total,
      req.params.id
    )

    if (services !== undefined) {
      db.prepare('DELETE FROM job_services WHERE job_id = ?').run(req.params.id)
      const ins = db.prepare('INSERT INTO job_services (job_id, name, price, qty, category) VALUES (?, ?, ?, ?, ?)')
      for (const svc of services) {
        ins.run(req.params.id, svc.name, svc.price, svc.qty || 1, svc.category || null)
      }
    }

    // Update vehicle mileage when completing a job
    if (status === 'completed' || status === 'paid') {
      const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id)
      if (job.vehicle_id) {
        const veh = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(job.vehicle_id)
        if (veh && veh.mileage_in) {
          db.prepare('UPDATE vehicles SET mileage_last = ? WHERE id = ?').run(veh.mileage_in, veh.id)
        }
      }
    }
  })()

  const updated = db.prepare(BASE_SELECT + ' WHERE j.id = ?').get(req.params.id)
  res.json(hydrateJob(updated))
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM job_services WHERE job_id = ?').run(req.params.id)
  db.prepare('DELETE FROM jobs WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

export default router
