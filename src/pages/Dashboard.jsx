import { JOBS, WEEKLY_REVENUE } from '../data'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const fmt = n => `$${(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}`

const TODAY      = '2026-05-28'
const THIS_MONTH = '2026-05'

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

function Badge({ status }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-600'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}

export default function Dashboard() {
  const monthJobs  = JOBS.filter(j => j.date.startsWith(THIS_MONTH))
  const doneJobs   = monthJobs.filter(j => ['completed', 'invoiced'].includes(j.status))
  const openJobs   = JOBS.filter(j => ['scheduled', 'in-progress'].includes(j.status))
  const todayJobs  = JOBS.filter(j => j.date === TODAY)
  const revenue    = doneJobs.reduce((s, j) => s + j.total, 0)
  const avgJob     = doneJobs.length ? Math.round(revenue / doneJobs.length) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm">May 2026</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Revenue (May)</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{fmt(revenue)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Jobs Completed</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{doneJobs.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Open Jobs</p>
          <p className="text-2xl font-bold text-orange-500 mt-1">{openJobs.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Avg Job Value</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{fmt(avgJob)}</p>
        </div>
      </div>

      {/* Today's schedule */}
      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-3">Today's Schedule</h2>
        {todayJobs.length === 0 ? (
          <p className="text-slate-400 text-sm">No jobs scheduled for today.</p>
        ) : (
          <div className="space-y-2">
            {todayJobs.map(job => (
              <div key={job.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800">{job.customerName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{job.vehicle}</p>
                    <p className="text-sm text-slate-600 mt-1">{job.services.join(' · ')}</p>
                    {job.notes && (
                      <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 mt-2">{job.notes}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <Badge status={job.status} />
                    <span className="text-base font-bold text-slate-800">{fmt(job.total)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <h2 className="text-base font-semibold text-slate-700 mb-4">Revenue — Last 6 Weeks</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={WEEKLY_REVENUE} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `$${v}`} />
            <Tooltip formatter={v => [`$${v}`, 'Revenue']} cursor={{ fill: '#fff7ed' }} />
            <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
