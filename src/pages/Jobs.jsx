import { useState } from 'react'
import { JOBS } from '../data'

const fmt = n => `$${(n || 0).toLocaleString('en-US')}`
const TODAY = '2026-05-28'

const STATUS_STYLES = {
  'scheduled':  'bg-blue-100 text-blue-700',
  'in-progress':'bg-orange-100 text-orange-700',
  'completed':  'bg-green-100 text-green-700',
  'invoiced':   'bg-purple-100 text-purple-700',
}
const STATUS_LABELS = {
  'scheduled':  'Scheduled',
  'in-progress':'In Progress',
  'completed':  'Completed',
  'invoiced':   'Invoiced',
}
const STATUS_ORDER = ['in-progress', 'scheduled', 'completed', 'invoiced']

const fmtDate = iso =>
  new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export default function Jobs() {
  const [filter, setFilter] = useState('all')

  const filtered = JOBS
    .filter(j => {
      if (filter === 'today') return j.date === TODAY
      if (filter === 'open')  return ['scheduled', 'in-progress'].includes(j.status)
      if (filter === 'done')  return ['completed', 'invoiced'].includes(j.status)
      return true
    })
    .sort((a, b) => {
      if (b.date !== a.date) return b.date.localeCompare(a.date)
      return STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
    })

  const tabs = [
    { key: 'all',   label: 'All'   },
    { key: 'today', label: 'Today' },
    { key: 'open',  label: 'Open'  },
    { key: 'done',  label: 'Done'  },
  ]

  const tabCls = key =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex-1 text-center ${filter === key ? 'bg-white text-orange-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Jobs</h1>

      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)} className={tabCls(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-slate-400 text-sm py-10">No jobs found.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(job => (
            <div key={job.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800">{job.customerName}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[job.status] || 'bg-slate-100 text-slate-600'}`}>
                      {STATUS_LABELS[job.status] || job.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{job.vehicle}</p>
                  <p className="text-sm text-slate-600 mt-1">{job.services.join(' · ')}</p>
                  {job.notes && (
                    <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 mt-2">{job.notes}</p>
                  )}
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-base font-bold text-slate-800">{fmt(job.total)}</span>
                  <span className="text-xs text-slate-400 mt-0.5">{fmtDate(job.date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
