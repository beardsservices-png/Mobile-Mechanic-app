import { useState, useEffect } from 'react'
import { api } from '../api'
import { Spinner } from '../lib/utils'

export default function Settings() {
  const [settings, setSettings] = useState(null)
  const [editing, setEditing]   = useState(false)
  const [form, setForm]         = useState({})
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState(null)

  useEffect(() => {
    api.get('/api/settings').then(s => {
      setSettings(s)
      setForm(s)
    }).catch(e => setError(e.message))
  }, [])

  async function save() {
    setSaving(true)
    setError(null)
    try {
      const updated = await api.put('/api/settings', form)
      setSettings(updated)
      setForm(updated)
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  function cancel() {
    setForm(settings)
    setEditing(false)
    setError(null)
  }

  function field(key) {
    return {
      value: form[key] || '',
      onChange: e => setForm(f => ({ ...f, [key]: e.target.value })),
    }
  }

  if (!settings) return <Spinner />

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 brand-heading tracking-wide">Settings</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)}
            className="text-sm font-medium text-orange-500 border border-orange-200 px-3 py-1.5 rounded-lg hover:bg-orange-50">
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={cancel}
              className="text-sm text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50">
              Cancel
            </button>
            <button onClick={save} disabled={saving}
              className="text-sm font-semibold text-white bg-orange-500 px-4 py-1.5 rounded-lg hover:bg-orange-600 disabled:opacity-60">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-100 text-green-700 text-sm px-4 py-2.5 rounded-xl">
          Settings saved.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2.5 rounded-xl">
          {error}
        </div>
      )}

      {/* Business Info */}
      <Section title="Business Info">
        <Field label="Business Name" editing={editing}>
          {editing
            ? <Input {...field('business_name')} />
            : <Val>{settings.business_name}</Val>}
        </Field>
        <Field label="Type" editing={editing}>
          {editing
            ? <Input {...field('business_type')} />
            : <Val>{settings.business_type}</Val>}
        </Field>
        <Field label="Phone" editing={editing}>
          {editing
            ? <Input {...field('phone')} type="tel" />
            : <Val>{settings.phone}</Val>}
        </Field>
        <Field label="Website" editing={editing}>
          {editing
            ? <Input {...field('website')} />
            : <Val>{settings.website}</Val>}
        </Field>
      </Section>

      {/* Rates */}
      <Section title="Rates & Defaults">
        <Field label="Default Labor Rate ($/hr)" editing={editing}>
          {editing
            ? <Input {...field('labor_rate')} type="number" min="0" step="5" />
            : <Val>${settings.labor_rate}/hr</Val>}
        </Field>
        <Field label="Default Parts Markup (%)" editing={editing}>
          {editing
            ? <Input {...field('markup')} type="number" min="0" max="200" />
            : <Val>{settings.markup}%</Val>}
        </Field>
        <Field label="Invoice Due Period (days)" editing={editing}>
          {editing
            ? <Input {...field('invoice_due_days')} type="number" min="0" />
            : <Val>{settings.invoice_due_days} days</Val>}
        </Field>
      </Section>

      {/* Tax */}
      <Section title="Tax Tracking">
        <Field label="Current Tax Year" editing={editing}>
          {editing
            ? <Input {...field('tax_year')} type="number" min="2020" max="2035" />
            : <Val>{settings.tax_year}</Val>}
        </Field>
        <Field label="IRS Mileage Rate ($/mile)" editing={editing}>
          {editing
            ? <Input {...field('mileage_rate')} type="number" min="0" step="0.01" />
            : <Val>${settings.mileage_rate}/mile</Val>}
        </Field>
        {!editing && (
          <p className="text-xs text-slate-400 pt-1">
            Mileage Log and Expenses auto-track deductions for the current tax year.
          </p>
        )}
      </Section>

      {/* Links */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-2">
        <h2 className="font-semibold text-slate-700">More</h2>
        <a href="/guide" className="flex items-center justify-between py-2 border-b border-slate-100 text-sm text-slate-700 hover:text-orange-500">
          <span>User Guide</span>
          <span className="text-slate-300">→</span>
        </a>
        <a href="/ai" className="flex items-center justify-between py-2 text-sm text-slate-700 hover:text-orange-500">
          <span>AI Mechanic Assistant</span>
          <span className="text-slate-300">→</span>
        </a>
      </div>

      {/* About */}
      <div className="rounded-xl p-4 text-center space-y-1" style={{ background: '#03080A' }}>
        <p className="text-xs font-bold tracking-widest uppercase brand-heading" style={{ color: '#D2AF41' }}>{settings.business_name}</p>
        <p className="text-slate-400 text-xs brand-sub">{settings.business_type}</p>
        <p className="text-slate-600 text-xs mt-2">Quality Repairs & Car Care. We Come to You.</p>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
      <h2 className="font-semibold text-slate-700">{title}</h2>
      <div className="space-y-2.5 text-sm">{children}</div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="flex justify-between items-center gap-3">
      <span className="text-slate-400 shrink-0 text-sm">{label}</span>
      <div className="flex-1 text-right">{children}</div>
    </div>
  )
}

function Val({ children }) {
  return <span className="text-slate-800 font-medium">{children}</span>
}

function Input({ value, onChange, type = 'text', ...rest }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      {...rest}
      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200 text-right"
    />
  )
}
