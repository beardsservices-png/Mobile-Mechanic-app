export const CUSTOMERS = [
  { id: 1, name: 'Tom Harris',     phone: '(870) 555-0142', vehicle: '2018 Ford F-150',            plate: 'ARK 4821', lastService: '2026-05-28', totalSpent: 247 },
  { id: 2, name: 'Sarah Mitchell', phone: '(870) 555-0287', vehicle: '2021 Honda Civic',            plate: 'ARK 7734', lastService: '2026-05-27', totalSpent: 138 },
  { id: 3, name: 'Dave Kowalski',  phone: '(870) 555-0391', vehicle: '2015 Chevy Silverado',        plate: 'ARK 2291', lastService: '2026-05-28', totalSpent: 347 },
  { id: 4, name: 'Jennifer Park',  phone: '(870) 555-0456', vehicle: '2019 Toyota Camry',           plate: 'ARK 9903', lastService: '2026-05-26', totalSpent: 248 },
  { id: 5, name: 'Bob Cramer',     phone: '(870) 555-0518', vehicle: '2017 Dodge Ram 1500',         plate: 'ARK 3357', lastService: '2026-04-14', totalSpent: 89  },
  { id: 6, name: 'Ashley Torres',  phone: '(870) 555-0623', vehicle: '2020 Jeep Grand Cherokee',    plate: 'ARK 6612', lastService: '2026-05-24', totalSpent: 128 },
  { id: 7, name: 'Carl Whitman',   phone: '(870) 555-0711', vehicle: '2014 GMC Sierra',             plate: 'ARK 1180', lastService: '2026-05-22', totalSpent: 318 },
  { id: 8, name: 'Megan Flores',   phone: '(870) 555-0834', vehicle: '2022 Subaru Outback',         plate: 'ARK 5549', lastService: '2026-05-20', totalSpent: 127 },
]

export const JOBS = [
  { id: 1,  customerId: 1, customerName: 'Tom Harris',    vehicle: '2018 Ford F-150',         plate: 'ARK 4821', mileage: '87,240', date: '2026-05-28', services: ['Oil Change (Full Synthetic)', 'Tire Rotation'],     total: 98,  status: 'scheduled',  complaint: 'Due for oil change, also wants tires rotated', symptom: 'maintenance' },
  { id: 2,  customerId: 3, customerName: 'Dave Kowalski', vehicle: '2015 Chevy Silverado',     plate: 'ARK 2291', mileage: '134,500', date: '2026-05-28', services: ['Brake Pads (Front)', 'Brake Fluid Flush'],          total: 228, status: 'in-progress', complaint: 'Grinding noise when braking at low speeds', symptom: 'grinding' },
  { id: 3,  customerId: 5, customerName: 'Bob Cramer',    vehicle: '2017 Dodge Ram 1500',      plate: 'ARK 3357', mileage: '99,870', date: '2026-05-29', services: ['Battery Replacement', 'Diagnostic Scan'],           total: 198, status: 'scheduled',  complaint: "Won't start in the mornings, clicks once", symptom: 'no-start' },
  { id: 4,  customerId: 2, customerName: 'Sarah Mitchell',vehicle: '2021 Honda Civic',         plate: 'ARK 7734', mileage: '31,200', date: '2026-05-27', services: ['Oil Change (Synthetic Blend)', 'Air Filter', 'Cabin Filter'], total: 138, status: 'completed', complaint: 'Routine maintenance', symptom: 'maintenance' },
  { id: 5,  customerId: 4, customerName: 'Jennifer Park', vehicle: '2019 Toyota Camry',        plate: 'ARK 9903', mileage: '62,400', date: '2026-05-26', services: ['Serpentine Belt', 'Coolant Flush'],                 total: 248, status: 'invoiced',   complaint: 'Squealing noise from engine bay on startup', symptom: 'squealing' },
  { id: 6,  customerId: 6, customerName: 'Ashley Torres', vehicle: '2020 Jeep Grand Cherokee', plate: 'ARK 6612', mileage: '48,900', date: '2026-05-24', services: ['Spark Plugs (V6)', 'PCV Valve'],                   total: 128, status: 'invoiced',   complaint: 'Rough idle, slight hesitation on acceleration', symptom: 'rough-idle' },
  { id: 7,  customerId: 7, customerName: 'Carl Whitman',  vehicle: '2014 GMC Sierra',          plate: 'ARK 1180', mileage: '178,300', date: '2026-05-22', services: ['Brake Pads (Rear)', 'Rotors (Rear Pair)'],          total: 318, status: 'invoiced',   complaint: 'Vibration when braking at highway speeds', symptom: 'vibration' },
  { id: 8,  customerId: 8, customerName: 'Megan Flores',  vehicle: '2022 Subaru Outback',      plate: 'ARK 5549', mileage: '22,100', date: '2026-05-20', services: ['Oil Change (Full Synthetic)', 'Tire Rotation', 'Multi-Point Inspection'], total: 127, status: 'invoiced', complaint: 'Scheduled maintenance', symptom: 'maintenance' },
  { id: 9,  customerId: 1, customerName: 'Tom Harris',    vehicle: '2018 Ford F-150',          plate: 'ARK 4821', mileage: '85,000', date: '2026-05-15', services: ['Transmission Fluid Service'],                      total: 149, status: 'invoiced',   complaint: 'Transmission slipping slightly between gears', symptom: 'transmission' },
  { id: 10, customerId: 3, customerName: 'Dave Kowalski', vehicle: '2015 Chevy Silverado',     plate: 'ARK 2291', mileage: '132,000', date: '2026-05-10', services: ['Battery Replacement'],                             total: 119, status: 'invoiced',   complaint: 'Battery dead, jump start only lasts a day', symptom: 'no-start' },
]

export const SERVICE_CATALOG = [
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
  { category: 'Suspension', items: [
    { name: 'Shocks / Struts (each)',   price: 149 },
    { name: 'Ball Joint (each)',         price: 129 },
    { name: 'Wheel Bearing (each)',      price: 189 },
    { name: 'Tie Rod End (each)',        price: 99  },
    { name: 'Alignment Check',          price: 49  },
  ]},
  { category: 'Misc', items: [
    { name: 'Multi-Point Inspection', price: 29 },
    { name: 'Wiper Blades (pair)',    price: 39 },
    { name: 'Fuel System Cleaner',    price: 49 },
    { name: 'AC Recharge',            price: 89 },
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

// ── VEHICLE INTEL DATABASE ──
export const VEHICLE_INTEL = {
  // FORD
  'ford f-150': {
    commonIssues: [
      { issue: 'Spark plug blowout (2004–2008 5.4L)', severity: 'high', note: 'Triton engines notorious for this — check thread count' },
      { issue: 'Phaser rattle on cold start (2011–2014 5.0L)', severity: 'medium', note: 'Oil pressure related — verify oil change history' },
      { issue: 'Rear axle seal leak', severity: 'medium', note: 'Common on high-mileage units, check differential fluid color' },
      { issue: 'HVAC blend door actuator failure', severity: 'low', note: 'Clicking sound from dash, heat/AC stuck on one side' },
      { issue: 'Transfer case motor failure (4WD models)', severity: 'medium', note: '4WD will not engage or disengage' },
    ],
    symptoms: {
      'grinding':     ['Worn brake pads (check front first)', 'Wheel bearing failure', 'Caliper sticking'],
      'squealing':    ['Brake pad wear indicators', 'Serpentine belt glazing', 'Power steering pump'],
      'no-start':     ['Battery (check CCA vs spec)', 'Alternator output low', 'Starter solenoid', 'Crankshaft position sensor'],
      'rough-idle':   ['MAF sensor dirty', 'Spark plugs worn', 'Vacuum leak (intake manifold gasket common)', 'EGR valve stuck'],
      'vibration':    ['Warped rotors (highway speed)', 'Driveshaft u-joint', 'Tire balance/separation', 'Motor mount'],
      'transmission': ['Low fluid / burnt fluid', 'Torque converter shudder', 'Shift solenoid B'],
      'maintenance':  ['5W-20 or 5W-30 per door sticker', 'Check tire pressure — F-150 spec varies by load'],
    },
    parts: [
      { name: 'Oil Filter',         partNum: 'FL-820S',    est: '$8–12'   },
      { name: 'Brake Pads (Front)', partNum: 'D1263',      est: '$35–65'  },
      { name: 'Rotors (Front)',     partNum: 'BD180116',   est: '$45–90'  },
      { name: 'Battery (V8)',       partNum: 'H7 / Group 65', est: '$120–180' },
      { name: 'Serpentine Belt',    partNum: 'K061005',    est: '$28–45'  },
      { name: 'Spark Plugs (V8)',   partNum: 'SP-515',     est: '$8–16 ea'},
      { name: 'Air Filter',         partNum: 'FA-1888',    est: '$18–28'  },
    ],
    laborNotes: 'Spark plugs on 5.4L 3V engine: allow 2–3 hrs, use extractor kit. Brake job on F-150: straightforward, 1–1.5 hrs front. Battery replacement: 30 min, keep memory saver connected (some trims have adaptive transmission learning).',
  },
  'ford': {
    commonIssues: [
      { issue: 'PCM/ECU calibration issues', severity: 'medium', note: 'May require dealer-level reprogramming' },
      { issue: 'Cooling system leaks (plastic coolant fittings)', severity: 'high', note: 'Inspect all plastic fittings and overflow tank' },
    ],
    symptoms: {
      'grinding': ['Brake wear', 'Wheel bearing'], 'squealing': ['Belts', 'Brakes'],
      'no-start': ['Battery', 'Alternator', 'Starter'], 'rough-idle': ['Sensors', 'Plugs'],
      'vibration': ['Tires', 'Rotors', 'Driveshaft'], 'maintenance': ['See door sticker for oil spec'],
      'transmission': ['Check fluid level and condition first'],
    },
    parts: [{ name: 'Oil Filter', partNum: 'FL-820S', est: '$8–12' }],
    laborNotes: 'Consult ALLDATA or Mitchell1 for vehicle-specific labor times.',
  },

  // CHEVY / GMC
  'chevy silverado': {
    commonIssues: [
      { issue: 'AFM / DOD lifter failure (V8 5.3L)', severity: 'high', note: 'Active Fuel Management causes premature lifter collapse — very common 2007–2021' },
      { issue: 'Oil consumption (5.3L LS engine)', severity: 'high', note: 'Check oil every fill-up, may need PCV upgrade kit' },
      { issue: 'Front differential actuator failure (4WD)', severity: 'medium', note: 'Service 4WD light, grinding on engagement' },
      { issue: 'Throttle position sensor', severity: 'medium', note: 'Surging idle, hesitation — common on early 2000s' },
      { issue: 'Rear window defroster tab', severity: 'low', note: 'Tab breaks off glass, easy solder repair' },
    ],
    symptoms: {
      'grinding':     ['Brake pads metal-on-metal', 'Front wheel bearing (knocking turns)', 'Transfer case chain'],
      'squealing':    ['Brake wear indicators', 'Serpentine belt', 'Fan belt idler pulley bearing'],
      'no-start':     ['Battery (Group 78 common spec)', 'Crankshaft sensor', 'Fuel pump (tank-mounted, check pressure)'],
      'rough-idle':   ['Dirty MAF', 'Lifter tick (AFM)', 'Intake manifold gasket leak', 'Throttle body carbon buildup'],
      'vibration':    ['Warped rotors', 'Driveshaft carrier bearing', 'U-joint worn', 'Tire balance'],
      'transmission': ['4L60E: check fluid, filter service', '6L80: fluid level check — hot process required'],
      'maintenance':  ['5W-30 most V8s, 0W-20 newer models — check door sticker'],
    },
    parts: [
      { name: 'Oil Filter',         partNum: 'PF48',       est: '$8–14'   },
      { name: 'Brake Pads (Front)', partNum: 'D1399',      est: '$40–70'  },
      { name: 'Battery',            partNum: 'Group 78',   est: '$130–190'},
      { name: 'Serpentine Belt',    partNum: 'K060845',    est: '$25–40'  },
      { name: 'Spark Plugs (V8)',   partNum: 'AC Delco 41-985', est: '$12–18 ea' },
      { name: 'Fuel Filter',        partNum: 'GF652',      est: '$25–45'  },
    ],
    laborNotes: 'AFM lifter job: 8–12 hrs minimum, disable AFM with Range Technology delete device as part of fix. Oil change: 30–45 min (filter location varies by year). Brake job front: 1.5 hrs typical.',
  },
  'gmc sierra': {
    commonIssues: [
      { issue: 'AFM lifter failure (same platform as Silverado)', severity: 'high', note: 'See Silverado notes — identical drivetrain' },
      { issue: 'Evap canister vent solenoid', severity: 'medium', note: 'P0449 / P0446 very common, located near fuel tank' },
    ],
    symptoms: {
      'grinding': ['Brake wear', 'Wheel bearing'], 'squealing': ['Brakes', 'Belt'],
      'no-start': ['Battery', 'Crankshaft sensor', 'Fuel pump'],
      'rough-idle': ['MAF', 'Lifter tick', 'Intake gasket'],
      'vibration': ['Rotors', 'Driveshaft', 'U-joint'],
      'transmission': ['Same as Silverado — 4L60E or 6L80'],
      'maintenance': ['5W-30 most trims'],
    },
    parts: [{ name: 'Oil Filter', partNum: 'PF48', est: '$8–14' }, { name: 'Evap Vent Solenoid', partNum: '214-2196', est: '$20–40' }],
    laborNotes: 'Nearly identical to Silverado. Evap solenoid replacement: 30–45 min.',
  },

  // DODGE / RAM
  'dodge ram': {
    commonIssues: [
      { issue: 'TIPM (Totally Integrated Power Module) failure', severity: 'high', note: 'Random electrical gremlins — windows, locks, fuel pump relay' },
      { issue: 'Rear axle pinion seal leak', severity: 'medium', note: 'Gear oil smell, visible seepage at yoke' },
      { issue: 'Death wobble (solid front axle trims)', severity: 'high', note: 'Steering components — track bar, ball joints, tie rods all candidates' },
      { issue: 'Tailgate latch cable failure', severity: 'low', note: 'Tailgate won\'t open or stay closed' },
    ],
    symptoms: {
      'grinding':     ['Brake pads', 'U-joint dry (driveshaft)', 'Wheel bearing'],
      'squealing':    ['Brake wear indicators', 'Idler pulley bearing', 'Serpentine belt'],
      'no-start':     ['TIPM fuel pump relay stuck off', 'Battery', 'NSS (neutral safety switch)'],
      'rough-idle':   ['MAP sensor', 'TPS', 'EGR (diesel)', 'Fuel injector (5.7L Hemi)'],
      'vibration':    ['Death wobble (see above)', 'Warped rotors', 'Driveshaft balance', 'Tire issue'],
      'transmission': ['45RFE/545RFE: low fluid causes erratic shifts', 'Torque converter shudder'],
      'maintenance':  ['5W-20 (Hemi), 5W-40 (Cummins diesel)'],
    },
    parts: [
      { name: 'Oil Filter (Hemi)',  partNum: 'MO-090',   est: '$10–15'  },
      { name: 'Brake Pads (Front)', partNum: 'D1415',    est: '$45–80'  },
      { name: 'Battery',            partNum: 'Group 94R',est: '$140–200'},
      { name: 'Spark Plugs (Hemi)', partNum: 'RC12YC4',  est: '$10–16 ea'},
      { name: 'Serpentine Belt',    partNum: 'K061030',  est: '$30–50'  },
    ],
    laborNotes: 'TIPM replacement: 1–2 hrs + programming. Spark plugs (Hemi 5.7L): 2 hrs, rear bank tight clearance. Brake job: 1.5 hrs front.',
  },
  'ram 1500': {
    commonIssues: [
      { issue: 'TIPM failure', severity: 'high', note: 'Random electrical issues — fuel pump relay most critical' },
      { issue: 'Air suspension leak (air ride trims)', severity: 'medium', note: 'Compressor runs constantly, corner sag overnight' },
    ],
    symptoms: {
      'grinding': ['Brakes', 'Wheel bearing'], 'squealing': ['Brakes', 'Belt', 'Idler pulley'],
      'no-start': ['TIPM', 'Battery', 'Neutral safety switch'],
      'rough-idle': ['MAP sensor', 'Injector', 'TPS'],
      'vibration': ['Rotors', 'Driveshaft', 'Tires'],
      'transmission': ['Check fluid hot — dipstick or fill plug method'],
      'maintenance': ['5W-20 (Hemi), 5W-40 (diesel)'],
    },
    parts: [{ name: 'Oil Filter', partNum: 'MO-090', est: '$10–15' }],
    laborNotes: 'See Dodge Ram notes — same platform.',
  },

  // HONDA
  'honda civic': {
    commonIssues: [
      { issue: 'Oil consumption (1.5L turbo, 2016–2019)', severity: 'high', note: 'Honda extended warranty on some VINs — check NHTSA' },
      { issue: 'CVT judder / shudder (CVT trims)', severity: 'medium', note: 'Low-speed shudder, CVT fluid flush often resolves' },
      { issue: 'AC compressor clutch failure', severity: 'medium', note: 'AC warm, clutch not engaging — check fuse first' },
    ],
    symptoms: {
      'grinding':     ['Brake pads metal-on-metal', 'Wheel bearing (humming turns to grinding)'],
      'squealing':    ['Brake wear indicators (inner pad)', 'Serpentine belt glazing'],
      'no-start':     ['Battery (Group 51R)', 'Main relay', 'Ignition switch'],
      'rough-idle':   ['VTEC solenoid screen clogged', 'Dirty throttle body', 'Spark plugs due'],
      'vibration':    ['Engine/transmission mount (common)', 'Warped rotors', 'CV axle worn'],
      'transmission': ['CVT fluid dark — flush first', 'Auto: check fluid level/color'],
      'maintenance':  ['0W-20 full synthetic — Honda spec strict on this'],
    },
    parts: [
      { name: 'Oil Filter',         partNum: 'S7-317',   est: '$8–12'  },
      { name: 'Brake Pads (Front)', partNum: 'D1253',    est: '$30–55' },
      { name: 'Battery',            partNum: 'Group 51R',est: '$100–150'},
      { name: 'Air Filter',         partNum: 'CA10164',  est: '$15–22' },
      { name: 'Spark Plugs',        partNum: 'NGK IZFR6K11', est: '$15–22 ea' },
      { name: 'CVT Fluid',          partNum: 'Honda HCF-2', est: '$12–18/qt'},
    ],
    laborNotes: 'CVT fluid exchange: 45 min, use only Honda HCF-2 fluid. Oil change: 20–30 min. Brake job: 1 hr front typical. Motor mounts: 1–2 hrs depending on which mount.',
  },

  // TOYOTA
  'toyota camry': {
    commonIssues: [
      { issue: 'Oil sludge (2.4L / 3.0L V6 2002–2006)', severity: 'high', note: 'If oil changes skipped, sludge destroys engine — do not ignore' },
      { issue: 'Power steering hose leak', severity: 'medium', note: 'Hydraulic PS models — hose rots at metal fitting' },
      { issue: 'Dashboard cracking (2007–2011)', severity: 'low', note: 'Cosmetic, Toyota had a customer support program' },
    ],
    symptoms: {
      'grinding':     ['Brake pads', 'Wheel bearing (humming increases with speed)'],
      'squealing':    ['Brake indicators', 'Drive belt'],
      'no-start':     ['Battery (Group 24F typical)', 'Starter', 'Cam position sensor'],
      'rough-idle':   ['Dirty throttle body (2.4L common)', 'Stuck EGR', 'Vacuum leak'],
      'vibration':    ['Motor mount worn (2.4L)', 'Warped rotors', 'CV axle'],
      'transmission': ['U140E/U151E: fluid dark = service overdue', 'Check for slipping between 2nd and 3rd'],
      'maintenance':  ['0W-20 or 5W-20 per year/trim'],
    },
    parts: [
      { name: 'Oil Filter',         partNum: '90915-YZZD1', est: '$8–14'  },
      { name: 'Brake Pads (Front)', partNum: 'D1296',       est: '$35–60' },
      { name: 'Battery',            partNum: 'Group 24F',   est: '$110–160'},
      { name: 'Serpentine Belt',    partNum: '90916-02688', est: '$25–40' },
      { name: 'Spark Plugs',        partNum: 'NGK ILZKR7A11', est: '$15–22 ea' },
    ],
    laborNotes: 'Toyota 2.4L oil change: 30 min. Brake job: 1 hr front. Starter replacement: 1.5–2 hrs (tight in engine bay on some years). Throttle body cleaning: 30–45 min.',
  },

  // JEEP
  'jeep grand cherokee': {
    commonIssues: [
      { issue: 'EVIC / Uconnect screen failure', severity: 'medium', note: 'Touchscreen unresponsive, NAV freezes — software update or unit replacement' },
      { issue: 'Transfer case module failure (NV242/NV247)', severity: 'high', note: 'Service 4WD/AWD light, stuck in one mode' },
      { issue: 'Air suspension compressor failure (Quadra-Lift)', severity: 'high', note: 'Compressor runs constantly, vehicle sits low — common on 2011+' },
      { issue: 'Water pump leak (3.6L Pentastar)', severity: 'medium', note: 'Weep hole drip at passenger side front' },
    ],
    symptoms: {
      'grinding':     ['Brake pads', 'Front differential (AWD under load)', 'Wheel bearing'],
      'squealing':    ['Brake indicators', 'Fan belt', 'Power steering'],
      'no-start':     ['Battery', 'TIPM', 'Crankshaft position sensor'],
      'rough-idle':   ['Spark plugs (3.6L 60k interval)', 'Throttle body', 'Intake manifold bolt loosening (3.7L)'],
      'vibration':    ['Rotors warped', 'Driveshaft (rear)', 'Transfer case binding'],
      'transmission': ['WJ/WK: check fluid and filter', '545RFE: common shift solenoid issue'],
      'maintenance':  ['5W-20 (3.6L), 5W-40 (diesel), 5W-30 (5.7L Hemi)'],
    },
    parts: [
      { name: 'Oil Filter (3.6L)',  partNum: 'MO-399',   est: '$10–16'  },
      { name: 'Brake Pads (Front)', partNum: 'D1523',    est: '$45–80'  },
      { name: 'Battery',            partNum: 'Group 94R',est: '$140–200'},
      { name: 'Spark Plugs (3.6L)',partNum: 'RC10YC4',  est: '$12–18 ea'},
      { name: 'Water Pump',         partNum: 'AW6214',   est: '$60–120' },
    ],
    laborNotes: 'Air suspension compressor: 1–2 hrs. Spark plugs (3.6L): 1.5 hrs, rear bank tight. Water pump: 2–3 hrs. Brake job: 1.5 hrs front.',
  },

  // SUBARU
  'subaru outback': {
    commonIssues: [
      { issue: 'Head gasket failure (2.5L EJ-series pre-2012)', severity: 'high', note: 'External leak type — most common at cylinders 2 and 3' },
      { issue: 'CV axle boot tear', severity: 'medium', note: 'Clicking on tight turns — replace axle before damage spreads to diff' },
      { issue: 'Positive crankcase ventilation (PCV) failure', severity: 'medium', note: 'Oil leaks, excessive blow-by — common on older FA/FB engines' },
    ],
    symptoms: {
      'grinding':     ['Brake pads', 'Wheel bearing (AWD — check all 4)', 'CV axle damage'],
      'squealing':    ['Brake indicators', 'Drive belt', 'Power steering pump (older)'],
      'no-start':     ['Battery (Group 25)', 'Starter', 'Main relay'],
      'rough-idle':   ['Head gasket early leak', 'MAF sensor', 'O2 sensor'],
      'vibration':    ['CV axle worn', 'Rotors', 'All 4 tires must be same brand/size (AWD!)'],
      'transmission': ['CVT: Subaru CVT fluid only, 30k service interval', 'Auto: check for shudder'],
      'maintenance':  ['0W-20 FA/FB engine (2013+), 5W-30 EJ (pre-2012)'],
    },
    parts: [
      { name: 'Oil Filter',         partNum: '15208AA100', est: '$8–14'  },
      { name: 'Brake Pads (Front)', partNum: 'D1310',      est: '$35–60' },
      { name: 'Battery',            partNum: 'Group 25',   est: '$110–160'},
      { name: 'CV Axle (each)',     partNum: '8-9653',     est: '$60–120' },
    ],
    laborNotes: 'CRITICAL: All 4 tires must be within 2/32" tread depth on AWD models — mismatched tires destroy center differential. Head gasket: 8–12 hrs. Oil change: 30 min.',
  },
}

// Lookup helper — fuzzy match vehicle string to intel key
export function getVehicleIntel(vehicleStr) {
  if (!vehicleStr) return null
  const v = vehicleStr.toLowerCase()
  const keys = Object.keys(VEHICLE_INTEL)
  // exact match first
  for (const k of keys) { if (v.includes(k)) return VEHICLE_INTEL[k] }
  return null
}
