import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { invoices as invoicesApi } from '../api'
import { useApi } from '../hooks/useApi'
import { Badge, fmt, fmtDateFull, Spinner, ErrorMsg } from '../lib/utils'

const PAYMENT_METHODS = ['Cash', 'Card', 'Venmo', 'Zelle', 'Check']

export default function Invoices() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const { data, loading, error, reload } = useApi(() => invoicesApi.list())
  const [payingId,   setPayingId]   = useState(null)
  const [payMethod,  setPayMethod]  = useState('Cash')
  const [marking,    setMarking]    = useState(false)

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg message={error} onRetry={reload} />

  const list = (data || []).filter(inv => {
    if (filter === 'unpaid') return inv.status === 'unpaid'
    if (filter === 'paid')   return inv.status === 'paid'
    return true
  })

  const totalUnpaid = (data || [])
    .filter(i => i.status === 'unpaid')
    .reduce((s, i) => s + (i.total - i.paid_amount), 0)

  async function markPaid(inv) {
    setMarking(true)
    try {
      await invoicesApi.update(inv.id, {
        status: 'paid',
        paid_amount: inv.total,
        payment_method: payMethod.toLowerCase(),
      })
      setPayingId(null)
      reload()
    } catch (err) {
      alert('Failed: ' + err.message)
    } finally {
      setMarking(false)
    }
  }

  const tabs = [
    { key: 'all',    label: 'All' },
    { key: 'unpaid', label: 'Unpaid' },
    { key: 'paid',   label: 'Paid' },
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800 brand-heading tracking-wide">Invoices</h1>

      {totalUnpaid > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-xs text-orange-600 font-semibold uppercase tracking-wide">Outstanding Balance</p>
          <p className="text-3xl font-bold text-orange-500 mt-1">{fmt(totalUnpaid)}</p>
        </div>
      )}

      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex-1 text-center ${filter === t.key ? 'bg-white text-orange-700 shadow-sm' : 'text-slate-500'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="text-center text-slate-400 text-sm py-10">No invoices found.</p>
      ) : (
        <div className="space-y-2">
          {list.map(inv => (
            <div key={inv.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800">{inv.customer_name}</span>
                    <Badge status={inv.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{inv.vehicle}</p>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">{inv.invoice_num}</p>
                  {inv.due_date && inv.status === 'unpaid' && (
                    <p className="text-xs text-orange-500 mt-0.5">Due {fmtDateFull(inv.due_date)}</p>
                  )}
                  {inv.status === 'paid' && inv.payment_method && (
                    <p className="text-xs text-teal-600 mt-0.5">Paid via {inv.payment_method} · {fmtDateFull(inv.paid_at)}</p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-lg font-bold text-slate-800">{fmt(inv.total)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <a href={invoicesApi.pdfUrl(inv.id)} target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium text-center transition-colors">
                  Download PDF
                </a>
                {inv.status === 'unpaid' && (
                  payingId === inv.id ? (
                    <div className="flex-[2] flex gap-1.5">
                      <select value={payMethod} onChange={e => setPayMethod(e.target.value)}
                        className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400 bg-white">
                        {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <button onClick={() => markPaid(inv)} disabled={marking}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50">
                        {marking ? '…' : '✓'}
                      </button>
                      <button onClick={() => setPayingId(null)}
                        className="px-3 py-1.5 bg-slate-200 rounded-lg text-sm">✕</button>
                    </div>
                  ) : (
                    <button onClick={() => setPayingId(inv.id)}
                      className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition-colors">
                      Mark Paid
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
