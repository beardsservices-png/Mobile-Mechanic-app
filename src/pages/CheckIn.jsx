import { useState } from 'react'
import { CUSTOMERS } from '../data'

const SYMPTOMS = [
  { key: 'grinding',     label: '🔩 Grinding',        desc: 'Metal-on-metal grinding sound' },
  { key: 'squealing',    label: '📢 Squealing',        desc: 'High-pitched squeal or squeak' },
  { key: 'no-start',     label: '🔋 Won\'t Start',     desc: 'Clicks, cranks, or nothing' },
  { key: 'rough-idle',   label: '⚙️ Rough Idle',       desc: 'Shaking, surging, or stalling at idle' },
  { key: 'vibration',    label: '📳 Vibration',        desc: 'Shaking at speed or while braking' },
  { key: 'transmission', label: '🔄 Transmission',     desc: 'Slipping, hard shifts, no movement' },
  { key: 'overheating',  label: '🌡️ Overheating',      desc: 'Temp gauge high, steam, coolant smell' },
  { key: 'oil-leak',     label: '🛢️ Oil Leak',         desc: 'Spot on ground, burning smell' },
  { key: 'check-engine', label: '⚠️ Check Engine',     desc: 'CEL on — solid or flashing' },
  { key: 'maintenance',  label: '🔧 Maintenance',      desc: 'Routine service, oil change, etc.' },
  { key: 'other',        label: '❓ Other',            desc: 'Something else — describe below' },
]

const MAKES = ['Ford', 'Chevrolet', 'GMC', 'Dodge', 'Ram', 'Toyota', 'Honda', 'Jeep', 'Subaru', 'Nissan', 'Hyundai', 'Kia', 'Mazda', 'Volkswagen', 'BMW', 'Mercedes', 'Chrysler', 'Buick', 'Cadillac', 'Lincoln', 'Other']

export default function CheckIn() {
  const [step, setStep] = useState(1) // 1=customer, 2=vehicle, 3=complaint, 4=confirm
  const [customerType, setCustomerType] = useState('existing') // existing | new
  const [customerId, setCustomerId] = useState('')
  const [form, setForm] = useState({
    name: '', phone: '', year: '', make: '', model: '', plate: '', mileage: '',
    color: '', vin: '', complaint: '', symptom: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const selectedCustomer = CUSTOMERS.find(c => c.id === Number(customerId))

  const handleExistingSelect = (id) => {
    setCustomerId(id)
    const c = CUSTOMERS.find(c => c.id === Number(id))
    if (c) {
      const parts = c.vehicle.split(' ')
      const year = parts[0]
      const make = parts[1]
      const model = parts.slice(2).join(' ')
      setForm(f => ({ ...f, name: c.name, phone: c.phone, year, make, model, plate: c.plate || '' }))
    }
  }

  if (submitted) {
    const vehicle = `${form.year} ${form.make} ${form.model}`.trim()
    const sym = SYMPTOMS.find(s => s.key === form.symptom)
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-[#121212] rounded-2xl p-6 text-center space-y-4 border border-amber-500/30">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white" style={{fontFamily:'Barlow Condensed,sans-serif',letterSpacing:'0.05em'}}>CUSTOMER CHECKED IN</h2>
          <div className="text-left bg-slate-800 rounded-xl p-4 space-y-2">
            <Row label="Name"     value={form.name} />
            <Row label="Phone"    value={form.phone} />
            <Row label="Vehicle"  value={vehicle} />
            <Row label="Plate"    value={form.plate || '—'} />
            <Row label="Mileage"  value={form.mileage ? `${form.mileage} mi` : '—'} />
            <Row label="Symptom"  value={sym?.label || form.symptom} />
            {form.complaint && <Row label="Complaint" value={form.complaint} />}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setStep(1); setForm({ name:'',phone:'',year:'',make:'',model:'',plate:'',mileage:'',color:'',vin:'',complaint:'',symptom:'' }); setCustomerId(''); setSubmitted(false) }}
              className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-semibold transition-colors"
            >New Check-In</button>
            <a href="/intel"
              className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-colors text-center"
            >View Vehicle Intel →</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 brand-heading">Customer Check-In</h1>
          <p className="text-sm text-slate-500 mt-0.5">Step {step} of 4</p>
        </div>
        {/* Step dots */}
        <div className="flex gap-2">
          {[1,2,3,4].map(n => (
            <div key={n} className={`w-2.5 h-2.5 rounded-full transition-colors ${n <= step ? 'bg-orange-500' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      {/* ── STEP 1: CUSTOMER ── */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <h2 className="font-bold text-slate-700 brand-heading text-lg">Who's the customer?</h2>

          <div className="flex gap-2">
            {['existing','new'].map(t => (
              <button key={t} onClick={() => setCustomerType(t)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors capitalize ${customerType === t ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {t === 'existing' ? '📋 Existing' : '➕ New Customer'}
              </button>
            ))}
          </div>

          {customerType === 'existing' ? (
            <select value={customerId} onChange={e => handleExistingSelect(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
              <option value="">-- Select customer --</option>
              {CUSTOMERS.map(c => (
                <option key={c.id} value={c.id}>{c.name} — {c.vehicle}</option>
              ))}
            </select>
          ) : (
            <div className="space-y-3">
              <Input label="Full Name" value={form.name} onChange={v => set('name', v)} placeholder="First Last" />
              <Input label="Phone Number" value={form.phone} onChange={v => set('phone', v)} placeholder="(870) 555-0000" type="tel" />
            </div>
          )}

          <button
            onClick={() => setStep(2)}
            disabled={customerType === 'existing' ? !customerId : !form.name.trim()}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl font-semibold transition-colors">
            Next → Vehicle Info
          </button>
        </div>
      )}

      {/* ── STEP 2: VEHICLE ── */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-700 brand-heading text-lg">Vehicle Info</h2>
            <span className="text-sm font-medium text-orange-600">{form.name}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Year" value={form.year} onChange={v => set('year', v)} placeholder="2019" />
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Make</label>
              <select value={form.make} onChange={e => set('make', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                <option value="">Select…</option>
                {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <Input label="Model" value={form.model} onChange={v => set('model', v)} placeholder="F-150, Camry, Silverado…" />

          <div className="grid grid-cols-2 gap-3">
            <Input label="License Plate" value={form.plate} onChange={v => set('plate', v.toUpperCase())} placeholder="ARK 1234" />
            <Input label="Mileage" value={form.mileage} onChange={v => set('mileage', v)} placeholder="87,500" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Color" value={form.color} onChange={v => set('color', v)} placeholder="White, Black…" />
            <Input label="VIN (optional)" value={form.vin} onChange={v => set('vin', v)} placeholder="Last 6 ok" />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors">← Back</button>
            <button
              onClick={() => setStep(3)}
              disabled={!form.year || !form.make || !form.model}
              className="flex-[2] py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl font-semibold transition-colors">
              Next → Complaint
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: COMPLAINT ── */}
      {step === 3 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div>
            <h2 className="font-bold text-slate-700 brand-heading text-lg">What's going on?</h2>
            <p className="text-xs text-slate-400 mt-0.5">{form.year} {form.make} {form.model} · {form.plate}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Primary Symptom</p>
            <div className="grid grid-cols-2 gap-2">
              {SYMPTOMS.map(s => (
                <button key={s.key} onClick={() => set('symptom', s.key)}
                  className={`text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${form.symptom === s.key ? 'bg-orange-50 border-orange-400 shadow-sm' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}>
                  <div className={`font-medium ${form.symptom === s.key ? 'text-orange-700' : 'text-slate-700'}`}>{s.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5 leading-tight">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer's Description</label>
            <textarea
              value={form.complaint}
              onChange={e => set('complaint', e.target.value)}
              placeholder="In their own words — what are they hearing, feeling, seeing? When does it happen?"
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors">← Back</button>
            <button
              onClick={() => setStep(4)}
              disabled={!form.symptom}
              className="flex-[2] py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl font-semibold transition-colors">
              Next → Review
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: CONFIRM ── */}
      {step === 4 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <h2 className="font-bold text-slate-700 brand-heading text-lg">Confirm Check-In</h2>

          <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Customer</div>
            <Row label="Name"  value={form.name} />
            <Row label="Phone" value={form.phone || '—'} />
            <div className="border-t border-slate-200 my-2" />
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Vehicle</div>
            <Row label="Vehicle"  value={`${form.year} ${form.make} ${form.model}`} />
            <Row label="Plate"    value={form.plate || '—'} />
            <Row label="Mileage"  value={form.mileage ? `${form.mileage} mi` : '—'} />
            <Row label="Color"    value={form.color || '—'} />
            {form.vin && <Row label="VIN" value={form.vin} />}
            <div className="border-t border-slate-200 my-2" />
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Complaint</div>
            <Row label="Symptom"   value={SYMPTOMS.find(s => s.key === form.symptom)?.label || '—'} />
            {form.complaint && <Row label="Notes" value={form.complaint} />}
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep(3)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors">← Edit</button>
            <button
              onClick={() => setSubmitted(true)}
              className="flex-[2] py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors">
              ✓ Check In Customer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Input({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-slate-400 shrink-0">{label}</span>
      <span className="text-slate-800 font-medium text-right">{value}</span>
    </div>
  )
}
