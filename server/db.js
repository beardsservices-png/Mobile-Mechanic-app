import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DB_PATH = process.env.NODE_ENV === 'production'
  ? '/data/dymon.db'
  : join(__dirname, '..', 'dymon.db')

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// ── MIGRATIONS ──────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    phone      TEXT,
    email      TEXT,
    address    TEXT,
    notes      TEXT,
    deleted_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS vehicles (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id  INTEGER REFERENCES customers(id),
    year         TEXT,
    make         TEXT,
    model        TEXT,
    trim         TEXT,
    color        TEXT,
    plate        TEXT,
    vin          TEXT,
    mileage_in   INTEGER,
    mileage_last INTEGER,
    notes        TEXT,
    created_at   TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id    INTEGER REFERENCES customers(id),
    vehicle_id     INTEGER REFERENCES vehicles(id),
    status         TEXT DEFAULT 'scheduled',
    date           TEXT,
    symptom        TEXT,
    complaint      TEXT,
    diagnosis      TEXT,
    work_performed TEXT,
    parts_used     TEXT DEFAULT '[]',
    tech_notes     TEXT,
    total          REAL DEFAULT 0,
    created_at     TEXT DEFAULT (datetime('now')),
    updated_at     TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS job_services (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id   INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    name     TEXT NOT NULL,
    price    REAL NOT NULL,
    qty      INTEGER DEFAULT 1,
    category TEXT
  );

  CREATE TABLE IF NOT EXISTS estimates (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    estimate_num TEXT UNIQUE,
    customer_id  INTEGER REFERENCES customers(id),
    vehicle_id   INTEGER REFERENCES vehicles(id),
    status       TEXT DEFAULT 'draft',
    subtotal     REAL DEFAULT 0,
    total        REAL DEFAULT 0,
    notes        TEXT,
    valid_until  TEXT,
    created_at   TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS estimate_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    estimate_id INTEGER REFERENCES estimates(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    price       REAL NOT NULL,
    qty         INTEGER DEFAULT 1,
    category    TEXT
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_num    TEXT UNIQUE,
    job_id         INTEGER REFERENCES jobs(id),
    customer_id    INTEGER REFERENCES customers(id),
    vehicle_id     INTEGER REFERENCES vehicles(id),
    status         TEXT DEFAULT 'unpaid',
    subtotal       REAL DEFAULT 0,
    total          REAL DEFAULT 0,
    paid_amount    REAL DEFAULT 0,
    payment_method TEXT,
    notes          TEXT,
    due_date       TEXT,
    paid_at        TEXT,
    created_at     TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS mileage_log (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id     INTEGER REFERENCES jobs(id),
    date       TEXT,
    from_loc   TEXT,
    to_loc     TEXT,
    miles      REAL,
    purpose    TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id       INTEGER REFERENCES jobs(id),
    date         TEXT,
    category     TEXT,
    description  TEXT,
    amount       REAL,
    receipt_note TEXT,
    created_at   TEXT DEFAULT (datetime('now'))
  );
`)

// ── SEED ────────────────────────────────────────────────────────────────────

function parseMileage(str) {
  if (!str) return null
  return parseInt(String(str).replace(/,/g, ''), 10) || null
}

function parseVehicle(str) {
  const parts = str.trim().split(' ')
  return { year: parts[0], make: parts[1], model: parts.slice(2).join(' ') }
}

const SERVICE_CATALOG = [
  { category: 'Oil & Fluids', items: [
    { name: 'Oil Change (Conventional)',    price: 39  },
    { name: 'Oil Change (Synthetic Blend)', price: 54  },
    { name: 'Oil Change (Full Synthetic)',  price: 69  },
    { name: 'Transmission Fluid Service',   price: 149 },
    { name: 'Coolant Flush',                price: 89  },
    { name: 'Power Steering Fluid',         price: 49  },
    { name: 'Brake Fluid Flush',            price: 79  },
  ]},
  { category: 'Brakes', items: [
    { name: 'Brake Pads (Front)',    price: 149 },
    { name: 'Brake Pads (Rear)',     price: 139 },
    { name: 'Rotors (Front Pair)',   price: 189 },
    { name: 'Rotors (Rear Pair)',    price: 179 },
    { name: 'Caliper (Single)',      price: 129 },
  ]},
  { category: 'Tires', items: [
    { name: 'Tire Rotation',           price: 29 },
    { name: 'Tire Balance (per tire)', price: 19 },
    { name: 'Tire Repair / Plug',      price: 25 },
  ]},
  { category: 'Electrical', items: [
    { name: 'Battery Replacement', price: 119 },
    { name: 'Alternator Test',     price: 39  },
    { name: 'Diagnostic Scan',     price: 79  },
    { name: 'Starter Replacement', price: 289 },
  ]},
  { category: 'Filters', items: [
    { name: 'Air Filter',   price: 39 },
    { name: 'Cabin Filter', price: 45 },
    { name: 'Fuel Filter',  price: 69 },
  ]},
  { category: 'Tune-Up', items: [
    { name: 'Spark Plugs (4-cyl)', price: 79  },
    { name: 'Spark Plugs (V6)',    price: 99  },
    { name: 'Spark Plugs (V8)',    price: 119 },
    { name: 'PCV Valve',           price: 29  },
    { name: 'Serpentine Belt',     price: 159 },
  ]},
  { category: 'Suspension', items: [
    { name: 'Shocks / Struts (each)', price: 149 },
    { name: 'Ball Joint (each)',      price: 129 },
    { name: 'Wheel Bearing (each)',   price: 189 },
    { name: 'Tie Rod End (each)',     price: 99  },
    { name: 'Alignment Check',       price: 49  },
  ]},
  { category: 'Misc', items: [
    { name: 'Multi-Point Inspection', price: 29 },
    { name: 'Wiper Blades (pair)',    price: 39 },
    { name: 'Fuel System Cleaner',    price: 49 },
    { name: 'AC Recharge',            price: 89 },
  ]},
]

const allServices = SERVICE_CATALOG.flatMap(cat =>
  cat.items.map(item => ({ ...item, category: cat.category }))
)

function findService(name) {
  return allServices.find(s => s.name === name) || { name, price: 0, category: 'Misc' }
}

const CUSTOMERS_SEED = [
  { id: 1, name: 'Tom Harris',     phone: '(870) 555-0142', vehicle: '2018 Ford F-150',            plate: 'ARK 4821' },
  { id: 2, name: 'Sarah Mitchell', phone: '(870) 555-0287', vehicle: '2021 Honda Civic',            plate: 'ARK 7734' },
  { id: 3, name: 'Dave Kowalski',  phone: '(870) 555-0391', vehicle: '2015 Chevy Silverado',        plate: 'ARK 2291' },
  { id: 4, name: 'Jennifer Park',  phone: '(870) 555-0456', vehicle: '2019 Toyota Camry',           plate: 'ARK 9903' },
  { id: 5, name: 'Bob Cramer',     phone: '(870) 555-0518', vehicle: '2017 Dodge Ram 1500',         plate: 'ARK 3357' },
  { id: 6, name: 'Ashley Torres',  phone: '(870) 555-0623', vehicle: '2020 Jeep Grand Cherokee',    plate: 'ARK 6612' },
  { id: 7, name: 'Carl Whitman',   phone: '(870) 555-0711', vehicle: '2014 GMC Sierra',             plate: 'ARK 1180' },
  { id: 8, name: 'Megan Flores',   phone: '(870) 555-0834', vehicle: '2022 Subaru Outback',         plate: 'ARK 5549' },
]

const JOBS_SEED = [
  { id: 1,  customerId: 1, mileage: '87,240',  date: '2026-05-28', services: ['Oil Change (Full Synthetic)', 'Tire Rotation'],                              total: 98,  status: 'scheduled',  complaint: 'Due for oil change, also wants tires rotated',             symptom: 'maintenance' },
  { id: 2,  customerId: 3, mileage: '134,500', date: '2026-05-28', services: ['Brake Pads (Front)', 'Brake Fluid Flush'],                                   total: 228, status: 'in-progress', complaint: 'Grinding noise when braking at low speeds',                 symptom: 'grinding' },
  { id: 3,  customerId: 5, mileage: '99,870',  date: '2026-05-29', services: ['Battery Replacement', 'Diagnostic Scan'],                                    total: 198, status: 'scheduled',  complaint: "Won't start in the mornings, clicks once",                 symptom: 'no-start' },
  { id: 4,  customerId: 2, mileage: '31,200',  date: '2026-05-27', services: ['Oil Change (Synthetic Blend)', 'Air Filter', 'Cabin Filter'],                total: 138, status: 'completed',  complaint: 'Routine maintenance',                                       symptom: 'maintenance' },
  { id: 5,  customerId: 4, mileage: '62,400',  date: '2026-05-26', services: ['Serpentine Belt', 'Coolant Flush'],                                          total: 248, status: 'invoiced',   complaint: 'Squealing noise from engine bay on startup',               symptom: 'squealing' },
  { id: 6,  customerId: 6, mileage: '48,900',  date: '2026-05-24', services: ['Spark Plugs (V6)', 'PCV Valve'],                                             total: 128, status: 'invoiced',   complaint: 'Rough idle, slight hesitation on acceleration',             symptom: 'rough-idle' },
  { id: 7,  customerId: 7, mileage: '178,300', date: '2026-05-22', services: ['Brake Pads (Rear)', 'Rotors (Rear Pair)'],                                   total: 318, status: 'invoiced',   complaint: 'Vibration when braking at highway speeds',                 symptom: 'vibration' },
  { id: 8,  customerId: 8, mileage: '22,100',  date: '2026-05-20', services: ['Oil Change (Full Synthetic)', 'Tire Rotation', 'Multi-Point Inspection'],    total: 127, status: 'invoiced',   complaint: 'Scheduled maintenance',                                    symptom: 'maintenance' },
  { id: 9,  customerId: 1, mileage: '85,000',  date: '2026-05-15', services: ['Transmission Fluid Service'],                                               total: 149, status: 'invoiced',   complaint: 'Transmission slipping slightly between gears',             symptom: 'transmission' },
  { id: 10, customerId: 3, mileage: '132,000', date: '2026-05-10', services: ['Battery Replacement'],                                                       total: 119, status: 'invoiced',   complaint: 'Battery dead, jump start only lasts a day',               symptom: 'no-start' },
]

function seed() {
  const count = db.prepare('SELECT COUNT(*) as n FROM customers').get()
  if (count.n > 0) return

  const insertCustomer  = db.prepare('INSERT INTO customers (name, phone) VALUES (?, ?)')
  const insertVehicle   = db.prepare('INSERT INTO vehicles (customer_id, year, make, model, plate, mileage_last) VALUES (?, ?, ?, ?, ?, ?)')
  const insertJob       = db.prepare(`INSERT INTO jobs (customer_id, vehicle_id, status, date, symptom, complaint, total) VALUES (?, ?, ?, ?, ?, ?, ?)`)
  const insertJobSvc    = db.prepare('INSERT INTO job_services (job_id, name, price, qty, category) VALUES (?, ?, ?, 1, ?)')
  const insertInvoice   = db.prepare(`INSERT INTO invoices (invoice_num, job_id, customer_id, vehicle_id, status, subtotal, total, paid_amount, payment_method, paid_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)

  const vehicleIdByCustomer = {}

  db.transaction(() => {
    for (const c of CUSTOMERS_SEED) {
      const r = insertCustomer.run(c.name, c.phone)
      const cid = r.lastInsertRowid
      const { year, make, model } = parseVehicle(c.vehicle)
      const vr = insertVehicle.run(cid, year, make, model, c.plate, null)
      vehicleIdByCustomer[c.id] = { vehicleId: vr.lastInsertRowid, customerId: cid }
    }

    const jobIdMap = {}
    for (const j of JOBS_SEED) {
      const { vehicleId, customerId } = vehicleIdByCustomer[j.customerId]
      const jr = insertJob.run(customerId, vehicleId, j.status, j.date, j.symptom, j.complaint, j.total)
      const jobId = jr.lastInsertRowid
      jobIdMap[j.id] = { jobId, customerId, vehicleId }
      for (const svcName of j.services) {
        const svc = findService(svcName)
        insertJobSvc.run(jobId, svcName, svc.price, svc.category)
      }
    }

    // Seed invoices for 'invoiced' jobs
    const invoicedJobs = JOBS_SEED.filter(j => j.status === 'invoiced')
    let invSeq = 1
    for (const j of invoicedJobs) {
      const { jobId, customerId, vehicleId } = jobIdMap[j.id]
      const num = `INV-2605-${String(invSeq).padStart(2, '0')}`
      const isPaid = j.total < 200
      insertInvoice.run(
        num, jobId, customerId, vehicleId,
        isPaid ? 'paid' : 'unpaid',
        j.total, j.total,
        isPaid ? j.total : 0,
        isPaid ? 'cash' : null,
        isPaid ? j.date : null
      )
      invSeq++
    }
  })()
}

seed()

export default db
