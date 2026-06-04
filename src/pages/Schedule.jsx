import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobs as jobsApi } from '../api'
import { Badge, fmt, Spinner, ErrorMsg } from '../lib/utils'

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function startOfWeek(date) {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
  d.setHours(0, 0, 0, 0)
  return d
}

function isoDate(d) {
  return d.toISOString().slice(0, 10)
}

function fmtMonthDay(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function fmtMonth(d) {
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function Schedule() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()))
  const [allJobs, setAllJobs]     = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    let mounted = true
    jobsApi.list().then(j => { if (mounted) { setAllJobs(j); setLoading(false) } })
      .catch(e => { if (mounted) { setError(e.message); setLoading(false) } })
    return () => { mounted = false }
  }, [])

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg message={error} />

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return isoDate(d)
  })

  const jobsByDay = {}
  for (const day of days) jobsByDay[day] = []
  for (const job of (allJobs || [])) {
    if (jobsByDay[job.date] !== undefined) jobsByDay[job.date].push(job)
  }

  const TODAY = isoDate(new Date())

  function prevWeek() {
    const d = new Date(weekStart)
    d.setDate(d.getDate() - 7)
    setWeekStart(d)
  }
  function nextWeek() {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 7)
    setWeekStart(d)
  }
  function goToday() {
    setWeekStart(startOfWeek(new Date()))
  }

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  const isCurrentWeek = isoDate(startOfWeek(new Date())) === isoDate(weekStart)

  const weekTotal = days.reduce((sum, day) => {
    return sum + jobsByDay[day].reduce((s, j) => s + (j.total || 0), 0)
  }, 0)

  const weekJobCount = days.reduce((sum, day) => sum + jobsByDay[day].length, 0)

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 brand-heading tracking-wide">Schedule</h1>
        {!isCurrentWeek && (
          <button onClick={goToday}
            className="text-xs text-orange-500 font-semibold border border-orange-200 rounded-lg px-3 py-1.5 hover:bg-orange-50">
            Today
          </button>
        )}
      </div>

      {/* Week nav */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3">
        <button onClick={prevWeek}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 active:bg-slate-200 text-lg">
          ‹
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-800">
            {fmtMonthDay(days[0])} – {fmtMonthDay(days[6])}
          </p>
          <p className="text-xs text-slate-400">{fmtMonth(weekStart)}</p>
        </div>
        <button onClick={nextWeek}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 active:bg-slate-200 text-lg">
          ›
        </button>
      </div>

      {/* Week summary */}
      {weekJobCount > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Jobs This Week</p>
            <p className="text-xl font-bold text-slate-800 mt-0.5">{weekJobCount}</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Week Revenue</p>
            <p className="text-xl font-bold text-slate-800 mt-0.5">{fmt(weekTotal)}</p>
          </div>
        </div>
      )}

      {/* Days */}
      <div className="space-y-2">
        {days.map(day => {
          const dayJobs = jobsByDay[day]
          const isToday = day === TODAY
          const isPast = day < TODAY
          const dow = DOW[new Date(day + 'T12:00:00').getDay()]

          return (
            <div key={day}
              className={`rounded-xl border shadow-sm overflow-hidden ${
                isToday ? 'border-orange-300' : 'border-slate-100'
              }`}>
              {/* Day header */}
              <div className={`flex items-center justify-between px-4 py-2.5 ${
                isToday ? 'bg-orange-500' : isPast && dayJobs.length === 0 ? 'bg-slate-50' : 'bg-white'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${isToday ? 'text-white' : isPast ? 'text-slate-400' : 'text-slate-700'}`}>
                    {dow}
                  </span>
                  <span className={`text-xs ${isToday ? 'text-orange-100' : 'text-slate-400'}`}>
                    {fmtMonthDay(day)}
                  </span>
                  {isToday && <span className="text-[10px] bg-white text-orange-500 font-bold px-1.5 py-0.5 rounded-full">TODAY</span>}
                </div>
                {dayJobs.length > 0 && (
                  <span className={`text-xs font-medium ${isToday ? 'text-orange-100' : 'text-slate-400'}`}>
                    {dayJobs.length} job{dayJobs.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Jobs for this day */}
              {dayJobs.length === 0 ? (
                <div className={`px-4 py-2.5 ${isPast ? 'bg-slate-50' : 'bg-white'}`}>
                  <p className="text-xs text-slate-300 italic">No jobs</p>
                </div>
              ) : (
                <div className={`divide-y divide-slate-50 ${isToday ? 'bg-orange-50' : 'bg-white'}`}>
                  {dayJobs.map(job => (
                    <Link key={job.id} to={`/jobs/${job.id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 active:bg-slate-100">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{job.customer_name}</p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{job.vehicle}</p>
                        {job.services?.length > 0 && (
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {job.services.map(s => s.name).join(' · ')}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <Badge status={job.status} />
                        <span className="text-sm font-bold text-slate-700">{fmt(job.total)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Link to check in */}
      <div className="pb-2">
        <Link to="/checkin"
          className="block w-full py-3 bg-orange-500 text-white rounded-xl text-sm font-semibold text-center shadow-sm hover:bg-orange-600 active:bg-orange-700">
          + Schedule a New Job
        </Link>
      </div>
    </div>
  )
}
