import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Customers from './pages/Customers'
import Estimate from './pages/Estimate'
import CheckIn from './pages/CheckIn'
import VehicleIntel from './pages/VehicleIntel'

// Diamond logo mark SVG
function DiamondMark({ size = 24 }) {
  const s = size
  const cx = s / 2, cy = s / 2
  const pts = [
    `${cx},${cy - cy * 0.85}`,
    `${cx + cx * 0.72 * 0.9},${cy - cy * 0.28 * 0.9}`,
    `${cx + cx * 0.95},${cy + cy * 0.08 * 0.9}`,
    `${cx + cx * 0.55 * 0.9},${cy + cy * 0.82}`,
    `${cx},${cy + cy * 0.85}`,
    `${cx - cx * 0.55 * 0.9},${cy + cy * 0.82}`,
    `${cx - cx * 0.95},${cy + cy * 0.08 * 0.9}`,
    `${cx - cx * 0.72 * 0.9},${cy - cy * 0.28 * 0.9}`,
  ].join(' ')
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
      <polygon points={pts} fill="#1a1a1a" stroke="#c8a84b" strokeWidth="1.5" />
      <line x1={cx} y1={cy - cy * 0.85} x2={cx} y2={cy + cy * 0.85} stroke="#e8650a" strokeWidth="0.8" opacity="0.6" />
      <line x1={cx - cx * 0.95} y1={cy + cy * 0.08 * 0.9} x2={cx + cx * 0.95} y2={cy + cy * 0.08 * 0.9} stroke="#c8a84b" strokeWidth="0.6" opacity="0.5" />
    </svg>
  )
}

function BottomNav() {
  const location = useLocation()
  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
  const tab = (path) =>
    `flex flex-col items-center gap-0.5 py-2 px-1 flex-1 text-xs font-medium transition-colors ${isActive(path) ? 'text-orange-600' : 'text-slate-400'}`

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#121212] border-t border-slate-700 flex md:hidden">
      <NavLink to="/" end className={tab('/')}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-[10px]">Dash</span>
      </NavLink>
      <NavLink to="/checkin" className={tab('/checkin')}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        <span className="text-[10px]">Check In</span>
      </NavLink>
      <NavLink to="/jobs" className={tab('/jobs')}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span className="text-[10px]">Jobs</span>
      </NavLink>
      <NavLink to="/intel" className={tab('/intel')}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span className="text-[10px]">Intel</span>
      </NavLink>
      <NavLink to="/customers" className={tab('/customers')}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-[10px]">Clients</span>
      </NavLink>
      <NavLink to="/estimate" className={tab('/estimate')}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span className="text-[10px]">Estimate</span>
      </NavLink>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        {/* TOP NAV */}
        <nav className="bg-[#121212] shadow-lg border-b border-slate-700 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-x-3 py-3 min-h-14">
              {/* Brand */}
              <div className="flex items-center gap-2.5 mr-6 shrink-0">
                <DiamondMark size={28} />
                <div className="leading-tight">
                  <div className="text-[11px] font-semibold tracking-[0.18em] text-amber-400 uppercase" style={{fontFamily:'Barlow Condensed,sans-serif'}}>Dymon in the Rough</div>
                  <div className="text-[9px] tracking-[0.22em] text-slate-400 uppercase" style={{fontFamily:'Barlow Condensed,sans-serif'}}>Mobile Mechanic</div>
                </div>
              </div>

              {/* Desktop links */}
              <div className="hidden md:flex items-center gap-1 flex-wrap">
                {[
                  { to: '/',          label: 'Dashboard', end: true },
                  { to: '/checkin',   label: '+ Check In' },
                  { to: '/jobs',      label: 'Jobs' },
                  { to: '/intel',     label: '🔍 Vehicle Intel' },
                  { to: '/customers', label: 'Customers' },
                  { to: '/estimate',  label: 'Estimate' },
                ].map(({ to, label, end }) => (
                  <NavLink key={to} to={to} end={end}
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-orange-500 text-white'
                          : to === '/checkin'
                            ? 'bg-amber-500 text-black hover:bg-amber-400'
                            : 'text-slate-300 hover:bg-slate-700'
                      }`
                    }>
                    {label}
                  </NavLink>
                ))}
              </div>

              {/* Phone pill */}
              <div className="ml-auto shrink-0 hidden md:block">
                <span className="text-xs font-mono text-orange-400 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-600">
                  417-651-3040
                </span>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 py-6 pb-28 md:pb-8">
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/checkin"   element={<CheckIn />} />
            <Route path="/jobs"      element={<Jobs />} />
            <Route path="/intel"     element={<VehicleIntel />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/estimate"  element={<Estimate />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
