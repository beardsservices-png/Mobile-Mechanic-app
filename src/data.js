export const CUSTOMERS = [
  { id: 1, name: 'Tom Harris',     phone: '(870) 555-0142', vehicle: '2018 Ford F-150',            lastService: '2026-05-28', totalSpent: 247 },
  { id: 2, name: 'Sarah Mitchell', phone: '(870) 555-0287', vehicle: '2021 Honda Civic',            lastService: '2026-05-27', totalSpent: 138 },
  { id: 3, name: 'Dave Kowalski',  phone: '(870) 555-0391', vehicle: '2015 Chevy Silverado',        lastService: '2026-05-28', totalSpent: 347 },
  { id: 4, name: 'Jennifer Park',  phone: '(870) 555-0456', vehicle: '2019 Toyota Camry',           lastService: '2026-05-26', totalSpent: 248 },
  { id: 5, name: 'Bob Cramer',     phone: '(870) 555-0518', vehicle: '2017 Dodge Ram 1500',         lastService: '2026-04-14', totalSpent: 89  },
  { id: 6, name: 'Ashley Torres',  phone: '(870) 555-0623', vehicle: '2020 Jeep Grand Cherokee',    lastService: '2026-05-24', totalSpent: 128 },
  { id: 7, name: 'Carl Whitman',   phone: '(870) 555-0711', vehicle: '2014 GMC Sierra',             lastService: '2026-05-22', totalSpent: 318 },
  { id: 8, name: 'Megan Flores',   phone: '(870) 555-0834', vehicle: '2022 Subaru Outback',         lastService: '2026-05-20', totalSpent: 127 },
]

export const JOBS = [
  { id: 1,  customerId: 1, customerName: 'Tom Harris',    vehicle: '2018 Ford F-150',         date: '2026-05-28', services: ['Oil Change (Full Synthetic)', 'Tire Rotation'],     total: 98,  status: 'scheduled',  notes: 'V8 engine — bring extra quart' },
  { id: 2,  customerId: 3, customerName: 'Dave Kowalski', vehicle: '2015 Chevy Silverado',     date: '2026-05-28', services: ['Brake Pads (Front)', 'Brake Fluid Flush'],          total: 228, status: 'in-progress', notes: '' },
  { id: 3,  customerId: 5, customerName: 'Bob Cramer',    vehicle: '2017 Dodge Ram 1500',      date: '2026-05-29', services: ['Battery Replacement', 'Diagnostic Scan'],           total: 198, status: 'scheduled',  notes: "Won't start mornings — check alternator too" },
  { id: 4,  customerId: 2, customerName: 'Sarah Mitchell',vehicle: '2021 Honda Civic',         date: '2026-05-27', services: ['Oil Change (Synthetic Blend)', 'Air Filter', 'Cabin Filter'], total: 138, status: 'completed', notes: '' },
  { id: 5,  customerId: 4, customerName: 'Jennifer Park', vehicle: '2019 Toyota Camry',        date: '2026-05-26', services: ['Serpentine Belt', 'Coolant Flush'],                 total: 248, status: 'invoiced',   notes: '' },
  { id: 6,  customerId: 6, customerName: 'Ashley Torres', vehicle: '2020 Jeep Grand Cherokee', date: '2026-05-24', services: ['Spark Plugs (V6)', 'PCV Valve'],                   total: 128, status: 'invoiced',   notes: '' },
  { id: 7,  customerId: 7, customerName: 'Carl Whitman',  vehicle: '2014 GMC Sierra',          date: '2026-05-22', services: ['Brake Pads (Rear)', 'Rotors (Rear Pair)'],          total: 318, status: 'invoiced',   notes: '' },
  { id: 8,  customerId: 8, customerName: 'Megan Flores',  vehicle: '2022 Subaru Outback',      date: '2026-05-20', services: ['Oil Change (Full Synthetic)', 'Tire Rotation', 'Multi-Point Inspection'], total: 127, status: 'invoiced', notes: '' },
  { id: 9,  customerId: 1, customerName: 'Tom Harris',    vehicle: '2018 Ford F-150',          date: '2026-05-15', services: ['Transmission Fluid Service'],                      total: 149, status: 'invoiced',   notes: '' },
  { id: 10, customerId: 3, customerName: 'Dave Kowalski', vehicle: '2015 Chevy Silverado',     date: '2026-05-10', services: ['Battery Replacement'],                             total: 119, status: 'invoiced',   notes: '' },
]

export const SERVICE_CATALOG = [
  { category: 'Oil & Fluids', items: [
    { name: 'Oil Change (Conventional)',    price: 39  },
    { name: 'Oil Change (Synthetic Blend)', price: 54  },
    { name: 'Oil Change (Full Synthetic)',  price: 69  },
    { name: 'Transmission Fluid Service',   price: 149 },
    { name: 'Coolant Flush',                price: 89  },
    { name: 'Power Steering Fluid',         price: 49  },
  ]},
  { category: 'Brakes', items: [
    { name: 'Brake Pads (Front)',    price: 149 },
    { name: 'Brake Pads (Rear)',     price: 139 },
    { name: 'Rotors (Front Pair)',   price: 189 },
    { name: 'Rotors (Rear Pair)',    price: 179 },
    { name: 'Brake Fluid Flush',     price: 79  },
  ]},
  { category: 'Tires', items: [
    { name: 'Tire Rotation',          price: 29 },
    { name: 'Tire Balance (per tire)',price: 19 },
    { name: 'Tire Repair / Plug',     price: 25 },
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
    { name: 'Spark Plugs (4-cyl)',  price: 79  },
    { name: 'Spark Plugs (V6)',     price: 99  },
    { name: 'Spark Plugs (V8)',     price: 119 },
    { name: 'PCV Valve',            price: 29  },
    { name: 'Serpentine Belt',      price: 159 },
  ]},
  { category: 'Misc', items: [
    { name: 'Multi-Point Inspection', price: 29 },
    { name: 'Wiper Blades (pair)',    price: 39 },
    { name: 'Fuel System Cleaner',    price: 49 },
  ]},
]

export const WEEKLY_REVENUE = [
  { week: 'Apr 21', revenue: 612  },
  { week: 'Apr 28', revenue: 748  },
  { week: 'May 5',  revenue: 891  },
  { week: 'May 12', revenue: 567  },
  { week: 'May 19', revenue: 1022 },
  { week: 'May 26', revenue: 407  },
]
