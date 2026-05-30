import { useState } from 'react'
import { Link } from 'react-router-dom'
import { customers as customersApi } from '../api'
import { useApi } from '../hooks/useApi'
import { fmt, fmtDateFull, Spinner, ErrorMsg } from '../lib/utils'

export default function Customers() {
  const [search, setSearch] = useState('')
  const { data, loading, error, reload } = useApi(() => customersApi.list())

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg message={error} onRetry={reload} />

  const list = (data || []).filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search)
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 brand-heading tracking-wide">Customers</h1>
        <span className="text-sm text-slate-500">{(data || []).length} total</span>
      </div>

      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        />
      </div>

      {list.length === 0 ? (
        <p className="text-center text-slate-400 text-sm py-10">No customers found.</p>
      ) : (
        <div className="space-y-2">
          {list.map(c => (
            <Link key={c.id} to={`/customers/${c.id}`}
              className="block bg-white rounded-xl p-4 shadow-sm border border-slate-100 active:bg-slate-50">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">{c.name}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5 text-xs text-slate-400">
                    <span>{c.phone}</span>
                    <span>{c.job_count} job{c.job_count !== 1 ? 's' : ''}</span>
                    {c.last_service && <span>Last: {fmtDateFull(c.last_service)}</span>}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-base font-bold text-slate-800">{fmt(c.total_spent)}</p>
                  <p className="text-xs text-slate-400">total spent</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
