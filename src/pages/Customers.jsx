import { useState } from 'react'
import { CUSTOMERS, JOBS } from '../data'

const fmt = n => `$${(n || 0).toLocaleString('en-US')}`
const fmtDate = iso =>
  new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function Customers() {
  const [search, setSearch] = useState('')

  const jobCount = id => JOBS.filter(j => j.customerId === id).length

  const filtered = CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.vehicle.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
        <span className="text-sm text-slate-500">{CUSTOMERS.length} total</span>
      </div>

      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name or vehicle..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-slate-400 text-sm py-10">No customers found.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">{c.name}</p>
                  <p className="text-sm text-slate-600 mt-0.5">{c.vehicle}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-2 text-xs text-slate-400">
                    <span>{c.phone}</span>
                    <span>{jobCount(c.id)} job{jobCount(c.id) !== 1 ? 's' : ''}</span>
                    <span>Last: {fmtDate(c.lastService)}</span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-base font-bold text-slate-800">{fmt(c.totalSpent)}</p>
                  <p className="text-xs text-slate-400">total spent</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
