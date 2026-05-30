import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { jobs as jobsApi, invoices as invoicesApi } from '../api'
import { Badge, fmt, fmtDateFull, Spinner, ErrorMsg } from '../lib/utils'
import { SERVICE_CATALOG } from '../data'

const STATUS_FLOW = ['scheduled', 'in-progress', 'completed', 'invoiced', 'paid']
const STATUS_LABELS_FLOW = { scheduled: 'Scheduled', 'in-progress': 'In Progress', completed: 'Completed', invoiced: 'Invoiced', paid: 'Paid' }
const NEXT_ACTION = {
  'scheduled':   { label: 'Start Job', nextStatus: 'in-progress', color: 'bg-orange-500 hover:bg-orange-600' },
  'in-progress': { label: 'Complete Job', nextStatus: 'completed', color: 'bg-green-600 hover:bg-green-700' },
  'completed':   { label: 'Create Invoice', nextStatus: null,      color: 'bg-purple-600 hover:bg-purple-700' },
  'invoiced':    { label: 'Mark Paid', nextStatus: null,            color: 'bg-teal-600 hover:bg-teal-700' },
  'paid':        null,
}

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job,       setJob]       = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [saving,    setSaving]    = useState(false)
  const [edits,     setEdits]     = useState({})
  const [parts,     setParts]     = useState([])
  const [services,  setServices]  = useState([])
  const [showSvcAdd, setShowSvcAdd] = useState(false)
  const [addSvcName, setAddSvcName] = useState('')
  const [addSvcPrice, setAddSvcPrice] = useState('')
  const [addSvcCat, setAddSvcCat] = useState('')

  // Timer
  const [timerStart, setTimerStart] = useState(null)
  const [timerSecs,  setTimerSecs]  = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem(`timer_job_${id}`)
    if (saved) {
      const start = parseInt(saved)
      setTimerStart(start)
      setTimerSecs(Math.floor((Date.now() - start) / 1000))
    }
  }, [id])

  useEffect(() => {
    if (timerStart) {
      timerRef.current = setInterval(() => {
        setTimerSecs(Math.floor((Date.now() - timerStart) / 1000))
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [timerStart])

  async function loadJob() {
    setLoading(true)
    setError(null)
    try {
      const data = await jobsApi.get(id)
      setJob(data)
      setEdits({
        diagnosis:      data.diagnosis      || '',
        work_performed: data.work_performed || '',
        tech_notes:     data.tech_notes     || '',
      })
      setParts(data.parts_used || [])
      setServices(data.services || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadJob() }, [id]) // eslint-disable-line

  const setEdit = (k, v) => setEdits(e => ({ ...e, [k]: v }))

  async function save() {
    setSaving(true)
    try {
      const total = services.reduce((s, svc) => s + svc.price * (svc.qty || 1), 0)
      const updated = await jobsApi.update(id, {
        diagnosis:      edits.diagnosis,
        work_performed: edits.work_performed,
        tech_notes:     edits.tech_notes,
        parts_used:     parts,
        services,
        total,
      })
      setJob(updated)
      setServices(updated.services || [])
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function advanceStatus(nextStatus) {
    setSaving(true)
    try {
      if (nextStatus) {
        const updated = await jobsApi.update(id, { status: nextStatus })
        setJob(updated)
      } else if (job.status === 'completed') {
        // Create invoice
        const inv = await invoicesApi.create({
          job_id: job.id,
          customer_id: job.customer_id,
          vehicle_id: job.vehicle_id,
        })
        navigate(`/invoices/${inv.id}`)
      } else if (job.status === 'invoiced') {
        navigate(`/invoices`)
      }
    } catch (err) {
      alert('Failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  function startTimer() {
    const now = Date.now()
    setTimerStart(now)
    setTimerSecs(0)
    localStorage.setItem(`timer_job_${id}`, now)
  }

  function stopTimer() {
    setTimerStart(null)
    localStorage.removeItem(`timer_job_${id}`)
  }

  function fmtTimer(secs) {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    if (h > 0) return `${h}h ${m}m`
    return `${m}m ${s}s`
  }

  function addPart() {
    setParts(p => [...p, { name: '', partNum: '', cost: '', markup: 20, sellPrice: '' }])
  }

  function updatePart(idx, key, val) {
    setParts(p => p.map((pt, i) => {
      if (i !== idx) return pt
      const updated = { ...pt, [key]: val }
      if (key === 'cost' || key === 'markup') {
        const cost   = parseFloat(key === 'cost'   ? val : pt.cost)   || 0
        const markup = parseFloat(key === 'markup' ? val : pt.markup) || 0
        updated.sellPrice = Math.round(cost * (1 + markup / 100))
      }
      return updated
    }))
  }

  function removePart(idx) {
    setParts(p => p.filter((_, i) => i !== idx))
  }

  function removeService(idx) {
    setServices(s => s.filter((_, i) => i !== idx))
  }

  function addService() {
    const name  = addSvcName.trim()
    const price = parseFloat(addSvcPrice) || 0
    if (!name || !price) return
    setServices(s => [...s, { name, price, qty: 1, category: addSvcCat || 'Misc' }])
    setAddSvcName(''); setAddSvcPrice(''); setAddSvcCat('')
    setShowSvcAdd(false)
  }

  function addCatalogService(item, category) {
    if (services.some(s => s.name === item.name)) return
    setServices(s => [...s, { name: item.name, price: item.price, qty: 1, category }])
  }

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg message={error} onRetry={loadJob} />
  if (!job)    return null

  const jobTotal = services.reduce((s, svc) => s + svc.price * (svc.qty || 1), 0)
  const action = NEXT_ACTION[job.status]
  const stepIdx = STATUS_FLOW.indexOf(job.status)

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Back + Header */}
      <div>
        <Link to="/jobs" className="text-sm text-orange-500 font-medium">← Jobs</Link>
        <div className="flex items-start justify-between mt-2 gap-2">
          <div>
            <h1 className="text-xl font-bold text-slate-800 brand-heading">{job.customer_name}</h1>
            <p className="text-slate-500 text-sm mt-0.5">{job.vehicle} · {job.plate}</p>
            <p className="text-xs text-slate-400 mt-0.5">{fmtDateFull(job.date)}{job.mileage_in ? ` · ${Number(job.mileage_in).toLocaleString()} mi` : ''}</p>
          </div>
          <Badge status={job.status} className="mt-1 shrink-0" />
        </div>
      </div>

      {/* Status stepper */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          {STATUS_FLOW.map((s, i) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i <= stepIdx ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {i < stepIdx ? '✓' : i + 1}
              </div>
              <span className={`text-[9px] font-medium mt-1 text-center leading-tight ${i === stepIdx ? 'text-orange-600' : 'text-slate-400'}`}>
                {STATUS_LABELS_FLOW[s]}
              </span>
            </div>
          ))}
        </div>

        {action && (
          <button onClick={() => advanceStatus(action.nextStatus)} disabled={saving}
            className={`w-full py-3 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50 ${action.color}`}>
            {saving ? 'Updating…' : action.label}
          </button>
        )}
        {job.status === 'paid' && (
          <div className="text-center text-teal-600 font-bold text-sm py-2">✓ Job Complete & Paid</div>
        )}
      </div>

      {/* Customer complaint */}
      {job.complaint && (
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">Customer Says</p>
          <p className="text-sm text-amber-800">{job.complaint}</p>
        </div>
      )}

      {/* Services */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-700">Services</h2>
          <button onClick={() => setShowSvcAdd(v => !v)} className="text-orange-500 text-sm font-medium">+ Add</button>
        </div>

        {showSvcAdd && (
          <div className="bg-slate-50 rounded-xl p-3 space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">From Catalog</p>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {SERVICE_CATALOG.flatMap(cat => cat.items.map(item => (
                <button key={item.name} onClick={() => addCatalogService(item, cat.category)}
                  disabled={services.some(s => s.name === item.name)}
                  className="w-full flex justify-between text-xs px-2 py-1.5 bg-white rounded-lg border border-slate-200 hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed">
                  <span>{item.name}</span>
                  <span className="font-semibold text-slate-700">{fmt(item.price)}</span>
                </button>
              )))}
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide pt-1">Custom Service</p>
            <div className="flex gap-2">
              <input value={addSvcName} onChange={e => setAddSvcName(e.target.value)} placeholder="Service name"
                className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-400" />
              <input value={addSvcPrice} onChange={e => setAddSvcPrice(e.target.value)} placeholder="Price" type="number"
                className="w-20 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-400" />
              <button onClick={addService} className="px-3 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-lg">Add</button>
            </div>
          </div>
        )}

        {services.length === 0 ? (
          <p className="text-slate-400 text-sm">No services added yet.</p>
        ) : (
          <div className="space-y-1.5">
            {services.map((svc, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                <span className="flex-1 text-sm text-slate-700">{svc.name}</span>
                <span className="text-sm font-semibold text-slate-800">{fmt(svc.price)}</span>
                <button onClick={() => removeService(i)} className="text-slate-300 hover:text-red-400 text-lg leading-none">×</button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <span className="text-sm font-semibold text-slate-600">Total</span>
          <span className="text-lg font-bold text-slate-800">{fmt(jobTotal)}</span>
        </div>
      </div>

      {/* Diagnosis */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-2">
        <h2 className="font-semibold text-slate-700">Diagnosis</h2>
        <textarea value={edits.diagnosis} onChange={e => setEdit('diagnosis', e.target.value)}
          placeholder="What did you find? (not shown to customer)"
          rows={3} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
      </div>

      {/* Work Performed */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-2">
        <h2 className="font-semibold text-slate-700">Work Performed</h2>
        <p className="text-xs text-slate-400">This appears on the invoice</p>
        <textarea value={edits.work_performed} onChange={e => setEdit('work_performed', e.target.value)}
          placeholder="Describe what was done..."
          rows={3} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
      </div>

      {/* Parts Used */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-700">Parts Used</h2>
          <button onClick={addPart} className="text-orange-500 text-sm font-medium">+ Add Part</button>
        </div>

        {parts.length === 0 ? (
          <p className="text-slate-400 text-sm">No parts logged yet.</p>
        ) : (
          <div className="space-y-3">
            {parts.map((pt, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-3 space-y-2 relative">
                <button onClick={() => removePart(i)} className="absolute top-2 right-2 text-slate-300 hover:text-red-400 text-xl leading-none">×</button>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Part Name</label>
                    <input value={pt.name} onChange={e => updatePart(i, 'name', e.target.value)}
                      placeholder="e.g. Brake Pads" className="w-full mt-0.5 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-400" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Part #</label>
                    <input value={pt.partNum} onChange={e => updatePart(i, 'partNum', e.target.value)}
                      placeholder="e.g. D1263" className="w-full mt-0.5 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-400" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Cost ($)</label>
                    <input value={pt.cost} onChange={e => updatePart(i, 'cost', e.target.value)}
                      type="number" placeholder="0" className="w-full mt-0.5 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-400" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Markup %</label>
                    <input value={pt.markup} onChange={e => updatePart(i, 'markup', e.target.value)}
                      type="number" placeholder="20" className="w-full mt-0.5 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-400" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Sell ($)</label>
                    <div className="w-full mt-0.5 border border-slate-200 rounded-lg px-2 py-1.5 text-xs bg-slate-100 text-slate-600 font-semibold">
                      {pt.sellPrice ? `$${pt.sellPrice}` : '—'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timer */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-700">Job Timer</h2>
            {timerSecs > 0 && (
              <p className="text-2xl font-bold text-orange-500 mt-1 font-mono">{fmtTimer(timerSecs)}</p>
            )}
            {!timerStart && timerSecs === 0 && (
              <p className="text-xs text-slate-400 mt-0.5">Track how long this job takes</p>
            )}
          </div>
          {!timerStart ? (
            <button onClick={startTimer}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold">
              ▶ Start
            </button>
          ) : (
            <button onClick={stopTimer}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-semibold">
              ■ Stop
            </button>
          )}
        </div>
      </div>

      {/* Tech Notes */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-2">
        <h2 className="font-semibold text-slate-700">Tech Notes</h2>
        <p className="text-xs text-slate-400">Private — never shown to customer</p>
        <textarea value={edits.tech_notes} onChange={e => setEdit('tech_notes', e.target.value)}
          placeholder="Anything to remember about this vehicle or job..."
          rows={3} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
      </div>

      {/* Save button */}
      <button onClick={save} disabled={saving}
        className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-xl font-bold text-base transition-colors">
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}
