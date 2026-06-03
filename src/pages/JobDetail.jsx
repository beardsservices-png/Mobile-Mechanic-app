import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { jobs as jobsApi } from '../api'
import { useApi } from '../hooks/useApi'
import { Badge, fmt, fmtDate, fmtDateFull, Spinner, ErrorMsg, STATUS_LABELS } from '../lib/utils'

const STATUSES = ['scheduled','in-progress','completed','invoiced','paid']

const STATUS_STEP = { scheduled:0,'in-progress':1,completed:2,invoiced:3,paid:4 }

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: job, loading, error, reload } = useApi(() => jobsApi.get(id), [id])

  const [saving, setSaving] = useState(false)
  const [editField, setEditField] = useState(null) // which field is being edited
  const [drafts, setDrafts] = useState({})

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg message={error} onRetry={reload} />
  if (!job)    return <ErrorMsg message="Job not found" />

  const step = STATUS_STEP[job.status] ?? 0

  const saveField = async (field, value) => {
    setSaving(true)
    try {
      await jobsApi.update(id, { [field]: value })
      await reload()
      setEditField(null)
      setDrafts(d => { const n = {...d}; delete n[field]; return n })
    } catch(e) {
      alert('Save failed: ' + e.message)
    } finally { setSaving(false) }
  }

  const updateStatus = async (status) => {
    setSaving(true)
    try { await jobsApi.update(id, { status }); await reload() }
    catch(e) { alert('Failed: ' + e.message) }
    finally { setSaving(false) }
  }

  const services = job.services || []
  const parts    = job.parts_used
    ? (typeof job.parts_used === 'string' ? JSON.parse(job.parts_used) : job.parts_used)
    : []

  return (
    <div className="space-y-4 max-w-2xl mx-auto">

      {/* Back */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/jobs')}
          className="text-slate-400 hover:text-slate-600 transition-colors text-sm flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          Jobs
        </button>
        <span className="text-slate-200">/</span>
        <span className="text-slate-600 text-sm font-medium">{job.customer_name}</span>
      </div>

      {/* Header card */}
      <div className="bg-[#121218] rounded-2xl p-5 border border-yellow-700/20">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-white brand-heading tracking-wide">{job.customer_name}</h1>
            <p className="text-sm text-slate-400 mt-0.5">{job.vehicle}</p>
            {job.plate && <p className="text-xs text-slate-500 mt-0.5">🔖 {job.plate}{job.mileage ? `  ·  ${Number(job.mileage).toLocaleString()} mi` : ''}</p>}
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold text-white">{fmt(job.total)}</div>
            <div className="text-xs text-slate-400 mt-0.5">{fmtDateFull(job.date)}</div>
            <Badge status={job.status} className="mt-1.5"/>
          </div>
        </div>

        {/* Status stepper */}
        <div className="mt-5 relative">
          <div className="flex items-center justify-between relative z-10">
            {STATUSES.map((s, i) => (
              <button key={s} onClick={() => updateStatus(s)} disabled={saving}
                className={`flex flex-col items-center gap-1 flex-1 group disabled:opacity-60`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2
                  ${i <= step
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'bg-slate-700 border-slate-600 text-slate-400 group-hover:border-orange-400'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-[9px] uppercase tracking-wide font-semibold hidden sm:block
                  ${i <= step ? 'text-orange-400' : 'text-slate-500'}`}>
                  {STATUS_LABELS[s]}
                </span>
              </button>
            ))}
          </div>
          {/* Progress line */}
          <div className="absolute top-3.5 left-[10%] right-[10%] h-0.5 bg-slate-700 -z-0">
            <div className="h-full bg-orange-500 transition-all"
              style={{width: `${(step / (STATUSES.length - 1)) * 100}%`}}/>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-700 brand-heading text-sm">Services</h2>
          <span className="text-sm font-bold text-slate-800">{fmt(job.total)}</span>
        </div>
        {services.length === 0
          ? <p className="px-5 py-4 text-sm text-slate-400">No services added yet.</p>
          : services.map((s, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-slate-50 last:border-0">
              <div>
                <div className="text-sm font-medium text-slate-800">{s.name}</div>
                {s.category && <div className="text-xs text-slate-400">{s.category}</div>}
              </div>
              <div className="text-sm font-semibold text-slate-700">{fmt(s.price * (s.qty || 1))}</div>
            </div>
          ))
        }
      </div>

      {/* Complaint */}
      <EditableCard
        title="Customer Complaint"
        icon="💬"
        field="complaint"
        value={job.complaint}
        editField={editField}
        setEditField={setEditField}
        drafts={drafts}
        setDrafts={setDrafts}
        onSave={saveField}
        saving={saving}
        placeholder="What the customer said is wrong..."
        multiline
      />

      {/* Diagnosis */}
      <EditableCard
        title="Your Diagnosis"
        icon="🔍"
        field="diagnosis"
        value={job.diagnosis}
        editField={editField}
        setEditField={setEditField}
        drafts={drafts}
        setDrafts={setDrafts}
        onSave={saveField}
        saving={saving}
        placeholder="What you actually found..."
        multiline
        highlight
      />

      {/* Work Performed */}
      <EditableCard
        title="Work Performed"
        icon="🔧"
        field="work_performed"
        value={job.work_performed}
        editField={editField}
        setEditField={setEditField}
        drafts={drafts}
        setDrafts={setDrafts}
        onSave={saveField}
        saving={saving}
        placeholder="What you did — goes on the invoice..."
        multiline
      />

      {/* Parts Used */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="px-5 py-3 border-b border-slate-100">
          <h2 className="font-bold text-slate-700 brand-heading text-sm flex items-center gap-2">
            <span>🏷️</span> Parts Used
          </h2>
        </div>
        {parts.length === 0
          ? <p className="px-5 py-4 text-sm text-slate-400">No parts logged yet.</p>
          : parts.map((p, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-slate-50 last:border-0">
              <div>
                <div className="text-sm font-medium text-slate-800">{p.name}</div>
                {p.partNum && <div className="text-xs text-slate-400 font-mono">#{p.partNum}</div>}
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-orange-600">{fmt(p.sellPrice || p.cost)}</div>
                {p.cost && p.sellPrice && p.cost !== p.sellPrice &&
                  <div className="text-xs text-slate-400">cost {fmt(p.cost)}</div>}
              </div>
            </div>
          ))
        }
      </div>

      {/* Tech Notes */}
      <EditableCard
        title="Tech Notes"
        icon="📝"
        field="tech_notes"
        value={job.tech_notes}
        editField={editField}
        setEditField={setEditField}
        drafts={drafts}
        setDrafts={setDrafts}
        onSave={saveField}
        saving={saving}
        placeholder="Internal notes — not shown to customer..."
        multiline
        muted
      />

      {/* Actions */}
      <div className="flex gap-3 pb-4">
        {job.status === 'completed' && (
          <Link to={`/invoices/new?jobId=${job.id}`}
            className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-center transition-colors brand-heading tracking-wider text-sm">
            Create Invoice →
          </Link>
        )}
        <button
          onClick={async () => {
            if (!confirm('Delete this job?')) return
            await jobsApi.delete(id)
            navigate('/jobs')
          }}
          className="py-3 px-5 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl font-semibold text-sm transition-colors">
          Delete
        </button>
      </div>

    </div>
  )
}

function EditableCard({ title, icon, field, value, editField, setEditField,
  drafts, setDrafts, onSave, saving, placeholder, multiline, highlight, muted }) {

  const isEditing = editField === field
  const draft = drafts[field] ?? value ?? ''

  return (
    <div className={`bg-white rounded-2xl shadow-sm border ${highlight ? 'border-orange-200' : 'border-slate-100'}`}>
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
        <h2 className={`font-bold brand-heading text-sm flex items-center gap-2 ${highlight ? 'text-orange-700' : muted ? 'text-slate-400' : 'text-slate-700'}`}>
          <span>{icon}</span> {title}
        </h2>
        {!isEditing && (
          <button onClick={() => { setEditField(field); setDrafts(d => ({...d, [field]: value || ''})) }}
            className="text-xs text-orange-500 font-semibold hover:text-orange-700 transition-colors">
            {value ? 'Edit' : '+ Add'}
          </button>
        )}
      </div>
      <div className="px-5 py-4">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              rows={4}
              value={draft}
              onChange={e => setDrafts(d => ({...d, [field]: e.target.value}))}
              placeholder={placeholder}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={() => { setEditField(null); setDrafts(d => { const n={...d}; delete n[field]; return n }) }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-semibold transition-colors">
                Cancel
              </button>
              <button onClick={() => onSave(field, draft)} disabled={saving}
                className="flex-[2] py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <p className={`text-sm leading-relaxed ${value ? 'text-slate-700' : 'text-slate-300 italic'}`}>
            {value || placeholder}
          </p>
        )}
      </div>
    </div>
  )
}
