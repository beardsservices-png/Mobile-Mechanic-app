import { useState } from 'react'
import { CUSTOMERS, SERVICE_CATALOG } from '../data'

const fmt = n => `$${(n || 0).toLocaleString('en-US')}`

export default function Estimate() {
  const [customerId, setCustomerId] = useState('')
  const [newCustomer, setNewCustomer] = useState('')
  const [vehicle, setVehicle] = useState('')
  const [selected, setSelected] = useState([])
  const [saved, setSaved] = useState(false)

  const handleCustomerChange = id => {
    setCustomerId(id)
    const c = CUSTOMERS.find(c => c.id === Number(id))
    setVehicle(c ? c.vehicle : '')
  }

  const toggle = item => {
    setSelected(prev =>
      prev.some(s => s.name === item.name)
        ? prev.filter(s => s.name !== item.name)
        : [...prev, item]
    )
  }

  const isSelected = name => selected.some(s => s.name === name)
  const total = selected.reduce((sum, s) => sum + s.price, 0)

  const customerLabel =
    customerId && customerId !== 'new'
      ? CUSTOMERS.find(c => c.id === Number(customerId))?.name
      : newCustomer.trim() || null

  const canSave =
    selected.length > 0 &&
    ((customerId !== '' && customerId !== 'new') ||
     (customerId === 'new' && newCustomer.trim() !== ''))

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Estimate Created!</h2>
        <p className="text-slate-600 font-medium">{customerLabel || 'Customer'}</p>
        {vehicle && <p className="text-slate-400 text-sm">{vehicle}</p>}
        <p className="text-3xl font-bold text-orange-500">{fmt(total)}</p>
        <p className="text-xs text-slate-400">{selected.length} service{selected.length !== 1 ? 's' : ''}</p>
        <div className="w-full max-w-xs border border-slate-100 rounded-xl p-3 text-left space-y-1 mt-2">
          {selected.map(s => (
            <div key={s.name} className="flex justify-between text-sm">
              <span className="text-slate-600">{s.name}</span>
              <span className="font-medium text-slate-800">{fmt(s.price)}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => { setCustomerId(''); setNewCustomer(''); setVehicle(''); setSelected([]); setSaved(false) }}
          className="mt-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          New Estimate
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">New Estimate</h1>

      {/* Customer */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
        <h2 className="font-semibold text-slate-700">Customer</h2>
        <select
          value={customerId}
          onChange={e => handleCustomerChange(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          <option value="">-- Select existing customer --</option>
          {CUSTOMERS.map(c => (
            <option key={c.id} value={c.id}>{c.name} — {c.vehicle}</option>
          ))}
          <option value="new">+ New customer...</option>
        </select>

        {customerId === 'new' && (
          <input
            type="text"
            placeholder="Customer name"
            value={newCustomer}
            onChange={e => setNewCustomer(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        )}

        <input
          type="text"
          placeholder="Vehicle (e.g. 2019 Toyota Camry)"
          value={vehicle}
          onChange={e => setVehicle(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Service catalog */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-5">
        <h2 className="font-semibold text-slate-700">Services <span className="text-slate-400 font-normal text-sm">(tap to add)</span></h2>
        {SERVICE_CATALOG.map(cat => (
          <div key={cat.category}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{cat.category}</p>
            <div className="space-y-1.5">
              {cat.items.map(item => (
                <button
                  key={item.name}
                  onClick={() => toggle(item)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isSelected(item.name)
                      ? 'bg-orange-50 border border-orange-300 shadow-sm'
                      : 'bg-slate-50 border border-transparent hover:border-slate-200'
                  }`}
                >
                  <span className={isSelected(item.name) ? 'font-medium text-orange-700' : 'text-slate-700'}>
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-slate-700">{fmt(item.price)}</span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected(item.name) ? 'bg-orange-500 border-orange-500' : 'border-slate-300'
                    }`}>
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
            <button
              onClick={() => canSave && setSaved(true)}
              disabled={!canSave}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Save Estimate
            </button>
          </div>
          <div className="space-y-0.5">
            {selected.map(s => (
              <div key={s.name} className="flex justify-between text-xs text-slate-400">
                <span>{s.name}</span>
                <span>{fmt(s.price)}</span>
              </div>
            ))}
          </div>
          {!canSave && (
            <p className="text-xs text-orange-500 mt-2">Select a customer to save.</p>
          )}
        </div>
      )}
    </div>
  )
}
