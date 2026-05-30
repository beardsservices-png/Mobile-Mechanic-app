export const STATUS_STYLES = {
  'scheduled':   'bg-blue-100 text-blue-700',
  'in-progress': 'bg-orange-100 text-orange-700',
  'completed':   'bg-green-100 text-green-700',
  'invoiced':    'bg-purple-100 text-purple-700',
  'paid':        'bg-teal-100 text-teal-700',
  'unpaid':      'bg-orange-100 text-orange-700',
  'partial':     'bg-violet-100 text-violet-700',
  'draft':       'bg-slate-100 text-slate-600',
  'sent':        'bg-blue-100 text-blue-700',
  'approved':    'bg-green-100 text-green-700',
  'declined':    'bg-red-100 text-red-700',
  'converted':   'bg-teal-100 text-teal-700',
}

export const STATUS_LABELS = {
  'scheduled':   'Scheduled',
  'in-progress': 'In Progress',
  'completed':   'Completed',
  'invoiced':    'Invoiced',
  'paid':        'Paid',
  'unpaid':      'Unpaid',
  'partial':     'Partial',
  'draft':       'Draft',
  'sent':        'Sent',
  'approved':    'Approved',
  'declined':    'Declined',
  'converted':   'Converted',
}

export function Badge({ status, className = '' }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-600'} ${className}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}

export const fmt = n => {
  const v = Math.round(n || 0)
  return v < 10 ? `$${v.toFixed(2)}` : `$${v.toLocaleString('en-US')}`
}

export const fmtDate = iso => {
  if (!iso) return ''
  return new Date(iso.slice(0,10) + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const fmtDateFull = iso => {
  if (!iso) return ''
  return new Date(iso.slice(0,10) + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const TODAY = new Date().toISOString().slice(0, 10)

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
    </div>
  )
}

export function ErrorMsg({ message, onRetry }) {
  return (
    <div className="text-center py-12 space-y-3">
      <p className="text-slate-400 text-sm">{message || 'Failed to load data'}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-orange-500 text-sm font-medium">Try again</button>
      )}
    </div>
  )
}
