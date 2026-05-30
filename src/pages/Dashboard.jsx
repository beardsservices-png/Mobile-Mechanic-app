import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { jobs as jobsApi, reports } from '../api'
import { Badge, fmt, fmtDate, Spinner, ErrorMsg } from '../lib/utils'

const THIS_MONTH = new Date().toISOString().slice(0, 7)
const TODAY      = new Date().toISOString().slice(0, 10)

export default function Dashboard() {
  const [jobList,      setJobList]      = useState(null)
  const [chartData,    setChartData]    = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const [allJobs, rev] = await Promise.all([
          jobsApi.list(),
          reports.revenue(),
        ])
        if (!mounted) return
        setJobList(allJobs)
        setChartData(rev.slice(-6).map(r => ({
          week: fmtDate(r.week_start),
          revenue: Math.round(r.revenue || 0),
        })))
      } catch (err) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg message={error} />

  const monthJobs = jobList.filter(j => j.date?.startsWith(THIS_MONTH))
  const doneJobs  = monthJobs.filter(j => ['completed','invoiced','paid'].includes(j.status))
  const openJobs  = jobList.filter(j => ['scheduled','in-progress'].includes(j.status))
  const todayJobs = jobList.filter(j => j.date === TODAY)
  const activeJob = jobList.find(j => j.status === 'in-progress')
  const revenue   = doneJobs.reduce((s, j) => s + (j.total || 0), 0)
  const avgJob    = doneJobs.length ? Math.round(revenue / doneJobs.length) : 0

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 brand-heading tracking-wide">Dashboard</h1>
        <p className="text-slate-500 text-sm">{currentMonth}</p>
      </div>

      {/* Active job alert */}
      {activeJob && (
        <Link to={`/jobs/${activeJob.id}`}
          className="flex items-center gap-3 bg-orange-500 text-white rounded-xl p-4 shadow-md">
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">Job in Progress</p>
            <p className="text-orange-100 text-xs truncate">{activeJob.customer_name} · {activeJob.vehicle}</p>
          </div>
          <span className="text-orange-100 text-sm shrink-0">View →</span>
        </Link>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Revenue (Month)</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{fmt(revenue)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Jobs Done</p>
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
              <Link key={job.id} to={`/jobs/${job.id}`}
                className="block bg-white rounded-xl p-4 shadow-sm border border-slate-100 active:bg-slate-50">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800">{job.customer_name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{job.vehicle}</p>
                    <p className="text-sm text-slate-600 mt-1 truncate">
                      {(job.services || []).map(s => s.name).join(' · ')}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <Badge status={job.status} />
                    <span className="text-base font-bold text-slate-800">{fmt(job.total)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <h2 className="text-base font-semibold text-slate-700 mb-4">Revenue — Last 6 Weeks</h2>
        {chartData.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">No completed jobs yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `$${v}`} />
              <Tooltip formatter={v => [`$${v}`, 'Revenue']} cursor={{ fill: '#fff7ed' }} />
              <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
