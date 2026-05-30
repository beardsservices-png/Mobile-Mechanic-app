import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { customers as customersApi, checkin as checkinApi } from '../api'

const SYMPTOMS = [
  { key: 'grinding',     label: '🔩 Grinding',      desc: 'Metal-on-metal grinding sound' },
  { key: 'squealing',    label: '📢 Squealing',      desc: 'High-pitched squeal or squeak' },
  { key: 'no-start',     label: '🔋 Won\'t Start',   desc: 'Clicks, cranks, or nothing' },
  { key: 'rough-idle',   label: '⚙️ Rough Idle',     desc: 'Shaking, surging, or stalling' },
  { key: 'vibration',    label: '📳 Vibration',      desc: 'Shaking at speed or braking' },
  { key: 'transmission', label: '🔄 Transmission',   desc: 'Slipping, hard shifts' },
  { key: 'overheating',  label: '🌡️ Overheating',    desc: 'Temp high, steam, coolant smell' },
  { key: 'oil-leak',     label: '🛢️ Oil Leak',       desc: 'Spot on ground, burning smell' },
  { key: 'check-engine', label: '⚠️ Check Engine',   desc: 'CEL on — solid or flashing' },
  { key: 'maintenance',  label: '🔧 Maintenance',    desc: 'Routine service, oil change, etc.' },
  { key: 'other',        label: '❓ Other',          desc: 'Something else — describe below' },
]

const MAKES = ['Ford','Chevrolet','GMC','Dodge','Ram','Toyota','Honda','Jeep','Subaru','Nissan','Hyundai','Kia','Mazda','Volkswagen','BMW','Mercedes','Chrysler','Buick','Cadillac','Lincoln','Other']

export default function CheckIn() {
  const navigate = useNavigate()
  const [step,         setStep]         = useState(1)
  const [customerType, setCustomerType] = useState('existing')
  const [customerId,   setCustomerId]   = useState('')
  const [vehicleId,    setVehicleId]    = useState('')
  const [customerList, setCustomerList] = useState([])
  const [vehicleList,  setVehicleList]  = useState([])
  const [submitting,   setSubmitting]   = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', year: '', make: '', model: '', plate: '',
    mileage: '', color: '', vin: '', complaint: '', symptom: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    customersApi.list().then(setCustomerList).catch(() => {})
  }, [])

  const handleExistingSelect = async id => {
    setCustomerId(id)
    setVehicleId('')
    const c = customerList.find(c => c.id === Number(id))
    if (c) set('name', c.name)

    if (id) {
      try {
        const { vehicles } = await customersApi.get(id)
        setVehicleList(vehicles || [])
      } catch { setVehicleList([]) }
    }
  }

  const handleVehicleSelect = id => {
    setVehicleId(id)
    const v = vehicleList.find(v => v.id === Number(id))
    if (v) {
      setForm(f => ({
        ...f,
        year: v.year || '', make: v.make || '', model: v.model || '',
        plate: v.plate || '', color: v.color || '', vin: v.vin || '',
        mileage: v.mileage_last ? String(v.mileage_last) : '',
      }))
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const body = {
        customer_id: customerType === 'existing' ? customerId || undefined : undefined,
        name:   customerType === 'new' ? form.name : undefined,
        phone:  customerType === 'new' ? form.phone : undefined,
        vehicle_id: vehicleId || undefined,
        year: form.year, make: form.make, model: form.model,
        plate: form.plate, mileage: form.mileage, color: form.color, vin: form.vin,
        symptom: form.symptom, complaint: form.complaint,
        date: new Date().toISOString().slice(0,10),
      }
      const job = await checkinApi.submit(body)
      navigate(`/jobs/${job.id}`)
    } catch (err) {
      alert('Check-in failed: ' + err.message)
      setSubmitting(false)
    }
  }

  const selectedCustomer = customerList.find(c => c.id === Number(customerId))

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 brand-heading">Customer Check-In</h1>
          <p className="text-sm text-slate-500 mt-0.5">Step {step} of 4</p>
        </div>
        <div className="flex gap-2">
          {[1,2,3,4].map(n => (
            <div key={n} className={`w-2.5 h-2.5 rounded-full transition-colors ${n <= step ? 'bg-orange-500' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <h2 className="font-bold text-slate-700 brand-heading text-lg">Who's the customer?</h2>

          <div className="flex gap-2">
            {['existing','new'].map(t => (
              <button key={t} onClick={() => setCustomerType(t)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${customerType === t ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {t === 'existing' ? '📋 Existing' : '➕ New Customer'}
              </button>
            ))}
          </div>

          {customerType === 'existing' ? (
            <>
              <select value={customerId} onChange={e => handleExistingSelect(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                <option value="">-- Select customer --</option>
                {customerList.map(c => (
                  <option key={c.id} value={c.id}>{c.name}{c.phone ? ` — ${c.phone}` : ''}</option>
                ))}
              </select>
              {customerId && vehicleList.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Vehicle on file</p>
                  <select value={vehicleId} onChange={e => handleVehicleSelect(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                    <option value="">-- Select vehicle or add new --</option>
                    {vehicleList.map(v => (
                      <option key={v.id} value={v.id}>{v.year} {v.make} {v.model} {v.plate ? `· ${v.plate}` : ''}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <Field label="Full Name"     value={form.name}  onChange={v => set('name', v)}  placeholder="First Last" />
              <Field label="Phone Number"  value={form.phone} onChange={v => set('phone', v)} placeholder="(870) 555-0000" type="tel" />
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

      {/* STEP 2 */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-700 brand-heading text-lg">Vehicle Info</h2>
            <span className="text-sm font-medium text-orange-600">{form.name || selectedCustomer?.name}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Year"  value={form.year}  onChange={v => set('year', v)}  placeholder="2019" />
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Make</label>
              <select value={form.make} onChange={e => set('make', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                <option value="">Select…</option>
                {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <Field label="Model"         value={form.model}   onChange={v => set('model', v)}   placeholder="F-150, Camry…" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="License Plate" value={form.plate}   onChange={v => set('plate', v.toUpperCase())} placeholder="ARK 1234" />
            <Field label="Mileage"       value={form.mileage} onChange={v => set('mileage', v)} placeholder="87,500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Color"         value={form.color}   onChange={v => set('color', v)}  placeholder="White, Black…" />
            <Field label="VIN (optional)"value={form.vin}     onChange={v => set('vin', v)}    placeholder="Last 6 ok" />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold">← Back</button>
            <button onClick={() => setStep(3)} disabled={!form.year || !form.make || !form.model}
              className="flex-[2] py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl font-semibold">
              Next → Complaint
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
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
            <textarea value={form.complaint} onChange={e => set('complaint', e.target.value)}
              placeholder="In their own words — what are they hearing, feeling, seeing?"
              rows={3} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold">← Back</button>
            <button onClick={() => setStep(4)} disabled={!form.symptom}
              className="flex-[2] py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl font-semibold">
              Next → Review
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <h2 className="font-bold text-slate-700 brand-heading text-lg">Confirm Check-In</h2>

          <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
            <SectionLabel>Customer</SectionLabel>
            <Row label="Name"  value={form.name || selectedCustomer?.name} />
            <Row label="Phone" value={form.phone || selectedCustomer?.phone || '—'} />
            <Divider />
            <SectionLabel>Vehicle</SectionLabel>
            <Row label="Vehicle"  value={`${form.year} ${form.make} ${form.model}`} />
            <Row label="Plate"    value={form.plate || '—'} />
            <Row label="Mileage"  value={form.mileage ? `${form.mileage} mi` : '—'} />
            <Divider />
            <SectionLabel>Complaint</SectionLabel>
            <Row label="Symptom" value={SYMPTOMS.find(s => s.key === form.symptom)?.label || '—'} />
            {form.complaint && <Row label="Notes" value={form.complaint} />}
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep(3)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold">← Edit</button>
            <button onClick={handleSubmit} disabled={submitting}
              className="flex-[2] py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl font-semibold">
              {submitting ? 'Checking in…' : '✓ Check In Customer'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
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

function SectionLabel({ children }) {
  return <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-1">{children}</div>
}

function Divider() {
  return <div className="border-t border-slate-200 my-1" />
}
