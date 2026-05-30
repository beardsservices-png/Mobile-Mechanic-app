import { useState } from 'react'
import { Link } from 'react-router-dom'
import { jobs as jobsApi } from '../api'
import { useApi } from '../hooks/useApi'
import { Badge, fmt, fmtDate, Spinner, ErrorMsg } from '../lib/utils'

const TODAY = new Date().toISOString().slice(0, 10)
const STATUS_ORDER = ['in-progress', 'scheduled', 'completed', 'invoiced', 'paid']

export default function Jobs() {
  const [filter, setFilter] = useState('all')
  const { data: allJobs, loading, error, reload } = useApi(() => jobsApi.list())

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg message={error} onRetry={reload} />

  const filtered = (allJobs || [])
    .filter(j => {
      if (filter === 'today') return j.date === TODAY
      if (filter === 'open')  return ['scheduled','in-progress'].includes(j.status)
      if (filter === 'done')  return ['completed','invoiced','paid'].includes(j.status)
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
      <h1 className="text-2xl font-bold text-slate-800 brand-heading tracking-wide">Jobs</h1>

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
            <Link key={job.id} to={`/jobs/${job.id}`}
              className="block bg-white rounded-xl p-4 shadow-sm border border-slate-100 active:bg-slate-50">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800">{job.customer_name}</span>
                    <Badge status={job.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{job.vehicle}</p>
                  <p className="text-sm text-slate-600 mt-1 truncate">
                    {(job.services || []).map(s => s.name).join(' · ') || job.symptom || '—'}
                  </p>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-base font-bold text-slate-800">{fmt(job.total)}</span>
                  <span className="text-xs text-slate-400 mt-0.5">{fmtDate(job.date)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
