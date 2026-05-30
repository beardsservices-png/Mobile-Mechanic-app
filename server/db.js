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

// One-time wipe of demo data — runs if the wipe flag isn't set yet
const wiped = db.prepare("SELECT COUNT(*) as n FROM customers WHERE name IN ('Tom Harris','Sarah Mitchell','Dave Kowalski','Jennifer Park','Bob Cramer','Ashley Torres','Carl Whitman','Megan Flores')").get()
if (wiped.n > 0) {
  db.transaction(() => {
    db.exec(`
      DELETE FROM invoices;
      DELETE FROM estimate_items;
      DELETE FROM estimates;
      DELETE FROM job_services;
      DELETE FROM jobs;
      DELETE FROM vehicles;
      DELETE FROM customers;
      DELETE FROM mileage_log;
      DELETE FROM expenses;
    `)
  })()
  console.log('Demo data cleared — app is ready for real use.')
}

export default db
