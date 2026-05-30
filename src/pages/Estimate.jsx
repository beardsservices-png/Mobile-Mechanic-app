import { useState, useEffect } from 'react'
import { customers as customersApi, estimates as estimatesApi } from '../api'
import { fmt } from '../lib/utils'
import { SERVICE_CATALOG } from '../data'

export default function Estimate() {
  const [customerList, setCustomerList] = useState([])
  const [customerId,   setCustomerId]   = useState('')
  const [vehicleList,  setVehicleList]  = useState([])
  const [vehicleId,    setVehicleId]    = useState('')
  const [selected,     setSelected]     = useState([])
  const [notes,        setNotes]        = useState('')
  const [saved,        setSaved]        = useState(null)
  const [saving,       setSaving]       = useState(false)

  useEffect(() => {
    customersApi.list().then(setCustomerList).catch(() => {})
  }, [])

  const handleCustomerChange = async id => {
    setCustomerId(id)
    setVehicleId('')
    setVehicleList([])
    if (!id) return
    try {
      const cust = await customersApi.get(id)
      setVehicleList(cust.vehicles || [])
      if (cust.vehicles?.length === 1) setVehicleId(String(cust.vehicles[0].id))
    } catch { /* ignore */ }
  }

  const toggle = item => {
    setSelected(prev =>
      prev.some(s => s.name === item.name)
        ? prev.filter(s => s.name !== item.name)
        : [...prev, { ...item, qty: 1 }]
    )
  }

  const isSelected = name => selected.some(s => s.name === name)
  const total = selected.reduce((sum, s) => sum + s.price * s.qty, 0)

  const customer = customerList.find(c => c.id === Number(customerId))
  const vehicle  = vehicleList.find(v => v.id === Number(vehicleId))

  const canSave = selected.length > 0 && customerId

  const handleSave = async () => {
    if (!canSave) return
    setSaving(true)
    try {
      const est = await estimatesApi.create({
        customer_id: Number(customerId),
        vehicle_id:  vehicleId ? Number(vehicleId) : undefined,
        notes,
        items: selected.map(s => ({ name: s.name, price: s.price, qty: s.qty, category: s.category })),
      })
      setSaved(est)
    } catch (err) {
      alert('Failed to save: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 max-w-sm mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Estimate Saved!</h2>
        <p className="text-slate-500 text-sm font-mono">{saved.estimate_num}</p>
        <p className="text-slate-600 font-medium">{customer?.name}</p>
        {vehicle && <p className="text-slate-400 text-sm">{vehicle.year} {vehicle.make} {vehicle.model}</p>}
        <p className="text-3xl font-bold text-orange-500">{fmt(total)}</p>

        <a href={`/api/estimates/${saved.id}/pdf`} target="_blank" rel="noopener noreferrer"
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors">
          Download PDF
        </a>
        <button onClick={() => { setCustomerId(''); setVehicleId(''); setSelected([]); setNotes(''); setSaved(null) }}
          className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-colors">
          New Estimate
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-800 brand-heading tracking-wide">New Estimate</h1>

      {/* Customer + Vehicle */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
        <h2 className="font-semibold text-slate-700">Customer</h2>
        <select value={customerId} onChange={e => handleCustomerChange(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
          <option value="">-- Select customer --</option>
          {customerList.map(c => (
            <option key={c.id} value={c.id}>{c.name}{c.phone ? ` — ${c.phone}` : ''}</option>
          ))}
        </select>

        {vehicleList.length > 0 && (
          <select value={vehicleId} onChange={e => setVehicleId(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
            <option value="">-- Select vehicle --</option>
            {vehicleList.map(v => (
              <option key={v.id} value={v.id}>{v.year} {v.make} {v.model} {v.plate ? `· ${v.plate}` : ''}</option>
            ))}
          </select>
        )}

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Notes</label>
          <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Optional notes for this estimate..."
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
      </div>

      {/* Service catalog */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-5">
        <h2 className="font-semibold text-slate-700">Services <span className="text-slate-400 font-normal text-sm">(tap to add)</span></h2>
        {SERVICE_CATALOG.map(cat => (
          <div key={cat.category}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{cat.category}</p>
            <div className="space-y-1.5">
              {cat.items.map(item => (
                <button key={item.name} onClick={() => toggle({ ...item, category: cat.category })}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isSelected(item.name) ? 'bg-orange-50 border border-orange-300 shadow-sm' : 'bg-slate-50 border border-transparent hover:border-slate-200'
                  }`}>
                  <span className={isSelected(item.name) ? 'font-medium text-orange-700' : 'text-slate-700'}>{item.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-slate-700">{fmt(item.price)}</span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected(item.name) ? 'bg-orange-500 border-orange-500' : 'border-slate-300'}`}>
                      {isSelected(item.name) && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating total bar */}
      {selected.length > 0 && (
        <div className="sticky bottom-20 md:bottom-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-slate-400">{selected.length} service{selected.length !== 1 ? 's' : ''}</p>
              <p className="text-2xl font-bold text-slate-800">{fmt(total)}</p>
            </div>
            <button onClick={handleSave} disabled={!canSave || saving}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition-colors">
              {saving ? 'Saving…' : 'Save Estimate'}
            </button>
          </div>
          {!canSave && <p className="text-xs text-orange-500">Select a customer to save.</p>}
        </div>
      )}
    </div>
  )
}
