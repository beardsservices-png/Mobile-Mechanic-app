import { useState } from 'react'
import { VEHICLE_INTEL, getVehicleIntel, JOBS } from '../data'

const MAKES = ['Ford', 'Chevrolet', 'GMC', 'Dodge', 'Ram', 'Toyota', 'Honda', 'Jeep', 'Subaru', 'Nissan', 'Hyundai', 'Kia', 'Other']

const SYMPTOM_LABELS = {
  'grinding':'🔩 Grinding', 'squealing':'📢 Squealing', 'no-start':"🔋 Won't Start",
  'rough-idle':'⚙️ Rough Idle', 'vibration':'📳 Vibration', 'transmission':'🔄 Transmission',
  'maintenance':'🔧 Maintenance', 'overheating':'🌡️ Overheating', 'oil-leak':'🛢️ Oil Leak',
  'check-engine':'⚠️ Check Engine', 'other':'❓ Other',
}

const SEVERITY_STYLES = {
  high:   'bg-red-100 text-red-700 border border-red-200',
  medium: 'bg-amber-100 text-amber-700 border border-amber-200',
  low:    'bg-slate-100 text-slate-600 border border-slate-200',
}

export default function VehicleIntel() {
  const [tab, setTab] = useState('lookup') // lookup | catalog | recent
  const [year, setYear] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [symptom, setSymptom] = useState('')
  const [searched, setSearched] = useState(false)

  const vehicleStr = `${make} ${model}`.toLowerCase().trim()
  const intel = searched ? getVehicleIntel(vehicleStr) : null

  const symptoms = intel ? Object.keys(intel.symptoms) : []
  const activeSymptoms = symptom && intel ? intel.symptoms[symptom] || [] : []

  const recentJobs = JOBS.filter(j => j.vehicle && make && j.vehicle.toLowerCase().includes(make.toLowerCase())).slice(0, 5)

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-[#121212] rounded-2xl p-5 border border-amber-500/20">
        <div className="flex items-start gap-3">
          <div className="text-3xl">🔍</div>
          <div>
            <h1 className="text-xl font-bold text-white brand-heading tracking-wide">Vehicle Intel</h1>
            <p className="text-sm text-slate-400 mt-0.5">Common issues · Symptom lookup · Parts reference · Labor notes</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {[['lookup','🔎 Lookup'],['catalog','📖 Parts Catalog'],['recent','🕐 Recent Vehicles']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === k ? 'bg-white text-orange-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* ── LOOKUP TAB ── */}
      {tab === 'lookup' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
            <h2 className="font-bold text-slate-700 brand-heading">Search Vehicle</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Year</label>
                <input value={year} onChange={e => setYear(e.target.value)} placeholder="2018"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Make</label>
                <select value={make} onChange={e => { setMake(e.target.value); setSearched(false); setSymptom('') }}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                  <option value="">Select…</option>
                  {MAKES.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Model</label>
                <input value={model} onChange={e => { setModel(e.target.value); setSearched(false) }} placeholder="F-150…"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
            </div>
            <button onClick={() => { setSearched(true); setSymptom('') }}
              disabled={!make || !model}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl font-bold transition-colors brand-heading tracking-wider">
              PULL UP VEHICLE INTEL
            </button>
          </div>

          {/* Results */}
          {searched && !intel && (
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100">
              <div className="text-4xl mb-3">🔧</div>
              <p className="text-slate-600 font-medium">No specific database entry for {year} {make} {model}</p>
              <p className="text-sm text-slate-400 mt-1">Try a broader search — enter just the model (e.g. "Civic" instead of "Civic EX")</p>
            </div>
          )}

          {searched && intel && (
            <div className="space-y-4">
              {/* Vehicle banner */}
              <div className="bg-[#121212] rounded-2xl px-5 py-4 flex items-center justify-between border border-amber-500/20">
                <div>
                  <div className="text-lg font-bold text-white brand-heading tracking-wide">{year} {make} {model}</div>
                  <div className="text-xs text-amber-400 mt-0.5 tracking-wider uppercase">Intel Loaded</div>
                </div>
                <div className="text-3xl">🚗</div>
              </div>

              {/* Common Issues */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
                <h3 className="font-bold text-slate-700 brand-heading text-base flex items-center gap-2">
                  <span className="text-red-500">⚠️</span> Known Issues for This Vehicle
                </h3>
                {intel.commonIssues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg capitalize shrink-0 ${SEVERITY_STYLES[issue.severity]}`}>
                      {issue.severity}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{issue.issue}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{issue.note}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Symptom Lookup */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
                <h3 className="font-bold text-slate-700 brand-heading text-base flex items-center gap-2">
                  <span>🩺</span> Symptom Diagnosis Guide
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {symptoms.map(s => (
                    <button key={s} onClick={() => setSymptom(symptom === s ? '' : s)}
                      className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-all border ${symptom === s ? 'bg-orange-500 text-white border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-orange-300'}`}>
                      {SYMPTOM_LABELS[s] || s}
                    </button>
                  ))}
                </div>
                {symptom && activeSymptoms.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-2">
                    <div className="text-sm font-bold text-orange-700">
                      {SYMPTOM_LABELS[symptom]} — Likely Causes:
                    </div>
                    {activeSymptoms.map((cause, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-orange-400 font-bold shrink-0">{i + 1}.</span>
                        <span className="text-slate-700">{cause}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Parts Reference */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
                <h3 className="font-bold text-slate-700 brand-heading text-base flex items-center gap-2">
                  <span>🏷️</span> Parts Reference
                </h3>
                <div className="space-y-2">
                  {intel.parts.map((p, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2.5 bg-slate-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">{p.name}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">#{p.partNum}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-orange-600">{p.est}</div>
                        <div className="text-xs text-slate-400">est. parts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Labor Notes */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-2">
                <h3 className="font-bold text-slate-700 brand-heading text-base flex items-center gap-2">
                  <span>🕐</span> Labor & Tech Notes
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{intel.laborNotes}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── PARTS CATALOG TAB ── */}
      {tab === 'catalog' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-sm text-amber-800 font-medium">📖 Quick-reference parts catalog. Part numbers are common fitment — always verify by VIN before ordering.</p>
          </div>
          {[
            {
              cat: 'Brakes', icon: '🛞', items: [
                { name: 'Brake Pads — Domestic Trucks',  num: 'D1399 / D1263', price: '$35–70',  labor: '1–1.5 hrs' },
                { name: 'Brake Pads — Import Sedan',     num: 'D1253 / D1296', price: '$28–55',  labor: '45 min–1 hr' },
                { name: 'Rotors — Full Size Truck',      num: 'BD180116',       price: '$45–90',  labor: '1 hr w/ pads' },
                { name: 'Rotors — Compact/Midsize',      num: 'BD125116',       price: '$35–75',  labor: '1 hr w/ pads' },
                { name: 'Brake Fluid (DOT 3)',           num: 'Various',        price: '$8–14',   labor: 'Flush: 30 min' },
              ]
            },
            {
              cat: 'Electrical', icon: '🔋', items: [
                { name: 'Battery — Full Size Truck',     num: 'Group 65 / 78',  price: '$120–190', labor: '20–30 min' },
                { name: 'Battery — Compact/Sedan',       num: 'Group 51R / 35', price: '$95–150',  labor: '15–20 min' },
                { name: 'Alternator — Domestic V8',      num: 'ALT-8270',       price: '$80–160',  labor: '1–2 hrs' },
                { name: 'Starter — Domestic Truck',      num: 'SR-4180N',       price: '$90–170',  labor: '1–2 hrs' },
              ]
            },
            {
              cat: 'Filters & Fluids', icon: '🛢️', items: [
                { name: 'Oil Filter — GM (LS/LT)',       num: 'PF48',           price: '$8–14',    labor: 'With oil change' },
                { name: 'Oil Filter — Ford EcoBoost',    num: 'FL-500S',        price: '$8–12',    labor: 'With oil change' },
                { name: 'Oil Filter — Toyota/Honda',     num: '15208AA / S7-317',price: '$8–12',   labor: 'With oil change' },
                { name: 'Air Filter — Truck',            num: 'FA-1888 / CA9715',price: '$18–30',  labor: '10 min' },
                { name: 'Cabin Filter — Most Vehicles',  num: 'C35481 / CF10285',price: '$15–30',  labor: '15–30 min' },
              ]
            },
            {
              cat: 'Belts & Hoses', icon: '⚙️', items: [
                { name: 'Serpentine Belt — V8 Truck',    num: 'K061005',        price: '$28–50',   labor: '30–45 min' },
                { name: 'Serpentine Belt — 4-cyl',       num: 'K040360',        price: '$18–35',   labor: '20–30 min' },
                { name: 'Upper Radiator Hose',           num: 'CRP RH79C',      price: '$20–45',   labor: '30–45 min' },
              ]
            },
            {
              cat: 'Suspension', icon: '🔩', items: [
                { name: 'Front Strut — Compact Sedan',   num: '71394',          price: '$60–120',  labor: '1.5–2 hrs each' },
                { name: 'Rear Shock — Full Size Truck',  num: '37265',          price: '$40–90',   labor: '45 min each' },
                { name: 'Ball Joint — Lower',            num: 'K8695T',         price: '$35–80',   labor: '1.5–2 hrs' },
                { name: 'Wheel Bearing — Front',         num: 'HA590516',       price: '$80–160',  labor: '1.5–2 hrs' },
              ]
            },
          ].map(({ cat, icon, items }) => (
            <div key={cat} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-slate-800 px-5 py-3 flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <span className="font-bold text-white brand-heading tracking-wide">{cat}</span>
              </div>
              <div className="divide-y divide-slate-50">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-800 text-sm">{item.name}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">#{item.num} · ⏱ {item.labor}</div>
                    </div>
                    <div className="text-right ml-3 shrink-0">
                      <div className="text-sm font-bold text-orange-600">{item.price}</div>
                      <div className="text-xs text-slate-400">parts est.</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── RECENT VEHICLES TAB ── */}
      {tab === 'recent' && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">Vehicles from recent job history</p>
          {JOBS.slice(0,8).map(job => {
            const intel = getVehicleIntel(job.vehicle.toLowerCase())
            return (
              <div key={job.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-bold text-slate-800">{job.vehicle}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{job.customerName} · {job.plate || '—'}</div>
                    <div className="text-xs text-orange-600 mt-1 font-medium">{job.services.join(' · ')}</div>
                    {job.complaint && <div className="text-xs text-slate-500 mt-1 italic">"{job.complaint}"</div>}
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-xs px-2 py-1 rounded-lg font-medium ${intel ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {intel ? '✓ Intel Available' : 'No Intel'}
                    </div>
                  </div>
                </div>
                {intel && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Top Known Issues</div>
                    <div className="space-y-1">
                      {intel.commonIssues.slice(0,2).map((issue, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <span className={`px-1.5 py-0.5 rounded font-bold capitalize shrink-0 ${SEVERITY_STYLES[issue.severity]}`}>{issue.severity}</span>
                          <span className="text-slate-600">{issue.issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
