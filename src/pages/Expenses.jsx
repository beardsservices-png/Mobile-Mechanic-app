import { useState } from 'react'
import { expenses as expensesApi } from '../api'
import { useApi } from '../hooks/useApi'
import { Spinner, ErrorMsg } from '../lib/utils'

const CATEGORIES = [
  { key: 'parts',     label: 'Parts',     color: 'bg-blue-100 text-blue-700' },
  { key: 'supplies',  label: 'Supplies',  color: 'bg-amber-100 text-amber-700' },
  { key: 'tools',     label: 'Tools',     color: 'bg-orange-100 text-orange-700' },
  { key: 'fuel',      label: 'Fuel',      color: 'bg-green-100 text-green-700' },
  { key: 'insurance', label: 'Insurance', color: 'bg-purple-100 text-purple-700' },
  { key: 'other',     label: 'Other',     color: 'bg-slate-100 text-slate-600' },
]

const catStyle = key => CATEGORIES.find(c => c.key === key)?.color || 'bg-slate-100 text-slate-600'
const catLabel = key => CATEGORIES.find(c => c.key === key)?.label || key

export default function Expenses() {
  const year = new Date().getFullYear()
  const { data, loading, error, reload } = useApi(() => expensesApi.list(year))
  const [showForm, setShowForm] = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0,10),
    category: 'parts', description: '', amount: '', receipt_note: '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleAdd() {
    if (!form.amount || !form.description) return
    setSaving(true)
    try {
      await expensesApi.create(form)
      setForm({ date: new Date().toISOString().slice(0,10), category: 'parts', description: '', amount: '', receipt_note: '' })
      setShowForm(false)
      reload()
    } catch (err) {
      alert('Failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    try { await expensesApi.delete(id); reload() } catch {}
  }

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg message={error} onRetry={reload} />

  const entries = data || []
  const total = entries.reduce((s, e) => s + (e.amount || 0), 0)

  // By category
  const byCat = {}
  for (const e of entries) {
    byCat[e.category] = (byCat[e.category] || 0) + (e.amount || 0)
  }

  const fmt = n => `$${Math.round(n || 0).toLocaleString('en-US')}`

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 brand-heading">Expenses</h1>
        <button onClick={() => setShowForm(v => !v)}
          className="px-3 py-1.5 bg-orange-500 text-white rounded-xl text-sm font-semibold">
          + Add
        </button>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">Total Expenses ({year})</p>
          <p className="text-xl font-bold text-red-500">{fmt(total)}</p>
        </div>
        {Object.keys(byCat).length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            {Object.entries(byCat).sort((a,b) => b[1]-a[1]).map(([cat, amt]) => (
              <div key={cat} className="flex items-center justify-between">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${catStyle(cat)}`}>
                  {catLabel(cat)}
                </span>
                <span className="text-sm font-semibold text-slate-700">{fmt(amt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
          <h2 className="font-semibold text-slate-700">Add Expense</h2>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                className="w-full mt-0.5 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount ($)</label>
              <input type="number" value={form.amount} onChange={e => set('amount', e.target.value)}
                placeholder="0.00" className="w-full mt-0.5 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="w-full mt-0.5 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
              {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</label>
            <input type="text" value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="What did you buy?" className="w-full mt-0.5 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Receipt Note (optional)</label>
            <input type="text" value={form.receipt_note} onChange={e => set('receipt_note', e.target.value)}
              placeholder="Where you bought it, receipt #, etc." className="w-full mt-0.5 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <button onClick={handleAdd} disabled={saving || !form.amount || !form.description}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl text-sm font-semibold">
            {saving ? 'Saving…' : 'Add Expense'}
          </button>
        </div>
      )}

      {/* List */}
      {entries.length === 0 ? (
        <p className="text-center text-slate-400 text-sm py-10">No expenses logged yet. Tap + Add to start.</p>
      ) : (
        <div className="space-y-2">
          {entries.map(exp => (
            <div key={exp.id} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-slate-100 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${catStyle(exp.category)}`}>
                    {catLabel(exp.category)}
                  </span>
                  <span className="text-sm font-semibold text-slate-800">{fmt(exp.amount)}</span>
                </div>
                <p className="text-sm text-slate-700 mt-0.5">{exp.description}</p>
                {exp.receipt_note && <p className="text-xs text-slate-400">{exp.receipt_note}</p>}
                <p className="text-xs text-slate-400 mt-0.5">{exp.date}</p>
              </div>
              <button onClick={() => handleDelete(exp.id)} className="text-slate-200 hover:text-red-400 text-xl leading-none shrink-0 mt-0.5">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
