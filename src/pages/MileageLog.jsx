import { useState } from 'react'
import { mileage as mileageApi } from '../api'
import { useApi } from '../hooks/useApi'
import { Spinner, ErrorMsg } from '../lib/utils'

const PURPOSES = ['Job site', 'Supply run', 'Parts pickup', 'Bank', 'Other']

export default function MileageLog() {
  const year = new Date().getFullYear()
  const { data, loading, error, reload } = useApi(() => mileageApi.list(year))
  const [showForm, setShowForm] = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0,10),
    from_loc: '', to_loc: '', miles: '', purpose: 'Job site',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleAdd() {
    if (!form.miles) return
    setSaving(true)
    try {
      await mileageApi.create(form)
      setForm({ date: new Date().toISOString().slice(0,10), from_loc: '', to_loc: '', miles: '', purpose: 'Job site' })
      setShowForm(false)
      reload()
    } catch (err) {
      alert('Failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    try {
      await mileageApi.delete(id)
      reload()
    } catch {}
  }

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg message={error} onRetry={reload} />

  const entries = data || []
  const totalMiles = entries.reduce((s, e) => s + (e.miles || 0), 0)
  const taxDeduction = Math.round(totalMiles * 0.67) // IRS 2024 rate: $0.67/mile

  // Group by month
  const byMonth = {}
  for (const e of entries) {
    const month = (e.date || '').slice(0, 7)
    if (!byMonth[month]) byMonth[month] = []
    byMonth[month].push(e)
  }

  const fmtMonth = ym => {
    if (!ym) return ''
    const d = new Date(ym + '-01T12:00:00')
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 brand-heading">Mileage Log</h1>
        <button onClick={() => setShowForm(v => !v)}
          className="px-3 py-1.5 bg-orange-500 text-white rounded-xl text-sm font-semibold">
          + Add
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Total Miles ({year})</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{totalMiles.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Tax Deduction</p>
          <p className="text-2xl font-bold text-green-600 mt-1">${taxDeduction.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400">@$0.67/mi (2024 rate)</p>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
          <h2 className="font-semibold text-slate-700">Log Trip</h2>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                className="w-full mt-0.5 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Miles</label>
              <input type="number" value={form.miles} onChange={e => set('miles', e.target.value)}
                placeholder="0" className="w-full mt-0.5 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">From</label>
            <input type="text" value={form.from_loc} onChange={e => set('from_loc', e.target.value)}
              placeholder="Starting location" className="w-full mt-0.5 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">To</label>
            <input type="text" value={form.to_loc} onChange={e => set('to_loc', e.target.value)}
              placeholder="Destination" className="w-full mt-0.5 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Purpose</label>
            <select value={form.purpose} onChange={e => set('purpose', e.target.value)}
              className="w-full mt-0.5 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
              {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <button onClick={handleAdd} disabled={saving || !form.miles}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl text-sm font-semibold">
            {saving ? 'Saving…' : 'Log Trip'}
          </button>
        </div>
      )}

      {/* Entries by month */}
      {entries.length === 0 ? (
        <p className="text-center text-slate-400 text-sm py-10">No trips logged yet. Tap + Add to start.</p>
      ) : (
        Object.entries(byMonth).sort((a,b) => b[0].localeCompare(a[0])).map(([month, trips]) => (
          <div key={month} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">{fmtMonth(month)}</p>
              <p className="text-xs text-slate-400">{trips.reduce((s,t) => s + (t.miles||0), 0).toFixed(1)} mi</p>
            </div>
            {trips.map(trip => (
              <div key={trip.id} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-slate-100 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-slate-800">{trip.miles} mi</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 truncate">{trip.purpose || 'Trip'}</span>
                  </div>
                  {(trip.from_loc || trip.to_loc) && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      {trip.from_loc}{trip.from_loc && trip.to_loc ? ' → ' : ''}{trip.to_loc}
                    </p>
                  )}
                </div>
                <button onClick={() => handleDelete(trip.id)} className="text-slate-200 hover:text-red-400 text-xl leading-none shrink-0">×</button>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  )
}
