import { Router } from 'express'
import db from '../db.js'

const router = Router()

// POST /api/checkin — find-or-create customer + vehicle, create job, return job
router.post('/', (req, res) => {
  const {
    customer_id, name, phone,
    vehicle_id, year, make, model, color, plate, vin, mileage,
    symptom, complaint, date
  } = req.body

  try {
    let custId  = customer_id ? Number(customer_id) : null
    let vehId   = vehicle_id  ? Number(vehicle_id)  : null

    db.transaction(() => {
      // Create customer if new
      if (!custId) {
        if (!name?.trim()) throw new Error('Name required for new customer')
        const r = db.prepare('INSERT INTO customers (name, phone) VALUES (?, ?)').run(name.trim(), phone || null)
        custId = r.lastInsertRowid
      }

      // Create vehicle if new
      if (!vehId) {
        const m = parseMileage(mileage)
        const r = db.prepare(
          'INSERT INTO vehicles (customer_id, year, make, model, color, plate, vin, mileage_in) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).run(custId, year || null, make || null, model || null, color || null, plate || null, vin || null, m)
        vehId = r.lastInsertRowid
      }

      // Create job
      const jobDate = date || new Date().toISOString().slice(0, 10)
      const jr = db.prepare(
        'INSERT INTO jobs (customer_id, vehicle_id, status, date, symptom, complaint) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(custId, vehId, 'scheduled', jobDate, symptom || null, complaint || null)

      const job = db.prepare(`
        SELECT j.*,
          c.name AS customer_name, c.phone AS customer_phone,
          v.year || ' ' || v.make || ' ' || v.model AS vehicle, v.plate
        FROM jobs j
        LEFT JOIN customers c ON j.customer_id = c.id
        LEFT JOIN vehicles  v ON j.vehicle_id  = v.id
        WHERE j.id = ?
      `).get(jr.lastInsertRowid)

      res.json(job)
    })()
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

function parseMileage(str) {
  if (!str) return null
  return parseInt(String(str).replace(/,/g, ''), 10) || null
}

export default router
