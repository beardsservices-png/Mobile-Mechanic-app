import { Link } from 'react-router-dom'

const LINKS = [
  { to: '/estimate',  label: 'New Estimate',   icon: '🧾', desc: 'Build a quote for a customer' },
  { to: '/intel',     label: 'Vehicle Intel',  icon: '🔍', desc: 'Look up symptoms & parts' },
  { to: '/mileage',   label: 'Mileage Log',    icon: '📍', desc: 'Track business trips for taxes' },
  { to: '/expenses',  label: 'Expenses',       icon: '💰', desc: 'Log parts, supplies, tools' },
  { to: '/settings',  label: 'Settings',       icon: '⚙️', desc: 'Business info & preferences' },
  { to: '/guide',     label: 'User Guide',     icon: '📖', desc: 'How to use this app' },
]

export default function More() {
  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 brand-heading tracking-wide">More</h1>
      <div className="grid grid-cols-1 gap-2">
        {LINKS.map(link => (
          <Link key={link.to} to={link.to}
            className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-slate-100 active:bg-slate-50">
            <span className="text-2xl w-9 text-center shrink-0">{link.icon}</span>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800">{link.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{link.desc}</p>
            </div>
            <span className="text-slate-300 ml-auto shrink-0">→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
