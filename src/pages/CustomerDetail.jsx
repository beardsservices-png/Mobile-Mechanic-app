import { useParams, Link } from 'react-router-dom'
import { customers as customersApi } from '../api'
import { useApi } from '../hooks/useApi'
import { Badge, fmt, fmtDateFull, Spinner, ErrorMsg } from '../lib/utils'

export default function CustomerDetail() {
  const { id } = useParams()
  const { data: cust, loading, error, reload } = useApi(() => customersApi.get(id), [id])

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg message={error} onRetry={reload} />
  if (!cust)   return null

  const totalSpent = (cust.jobs || [])
    .filter(j => ['completed','invoiced','paid'].includes(j.status))
    .reduce((s, j) => s + (j.total || 0), 0)

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Link to="/customers" className="text-sm text-orange-500 font-medium">← Customers</Link>

      {/* Header */}
      <div className="bg-[#121212] rounded-2xl p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white brand-heading">{cust.name}</h1>
            <p className="text-slate-400 text-sm mt-0.5">{cust.phone}</p>
            {cust.email && <p className="text-slate-400 text-sm">{cust.email}</p>}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-amber-400">{fmt(totalSpent)}</p>
            <p className="text-xs text-slate-400">lifetime value</p>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <a href={`tel:${cust.phone}`}
            className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold text-center transition-colors">
            Call Customer
          </a>
          <Link to={`/checkin`}
            className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-semibold text-center transition-colors">
            New Job
          </Link>
        </div>
      </div>

      {/* Vehicles */}
      {cust.vehicles?.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
          <h2 className="font-semibold text-slate-700">Vehicles on File</h2>
          <div className="space-y-2">
            {cust.vehicles.map(v => (
              <div key={v.id} className="bg-slate-50 rounded-xl p-3">
                <p className="font-semibold text-slate-800 text-sm">{v.year} {v.make} {v.model}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-slate-400">
                  {v.plate && <span>{v.plate}</span>}
                  {v.color && <span>{v.color}</span>}
                  {v.vin   && <span>VIN: {v.vin}</span>}
                  {v.mileage_last && <span>{Number(v.mileage_last).toLocaleString()} mi</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Job history */}
      <div className="space-y-2">
        <h2 className="font-semibold text-slate-700">Job History ({cust.jobs?.length || 0})</h2>
        {(cust.jobs || []).length === 0 ? (
          <p className="text-slate-400 text-sm">No jobs yet.</p>
        ) : (
          cust.jobs.map(job => (
            <Link key={job.id} to={`/jobs/${job.id}`}
              className="block bg-white rounded-xl p-4 shadow-sm border border-slate-100 active:bg-slate-50">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800">{job.vehicle}</span>
                    <Badge status={job.status} />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{fmtDateFull(job.date)}</p>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {(job.services || []).map(s => s.name).join(', ') || job.symptom || '—'}
                  </p>
                </div>
                <span className="text-base font-bold text-slate-800 shrink-0">{fmt(job.total)}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
