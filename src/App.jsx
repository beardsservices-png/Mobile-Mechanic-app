import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import Dashboard     from './pages/Dashboard'
import CheckIn       from './pages/CheckIn'
import Jobs          from './pages/Jobs'
import JobDetail     from './pages/JobDetail'
import Customers     from './pages/Customers'
import CustomerDetail from './pages/CustomerDetail'
import Estimate      from './pages/Estimate'
import Invoices      from './pages/Invoices'
import VehicleIntel  from './pages/VehicleIntel'
import MileageLog    from './pages/MileageLog'
import Expenses      from './pages/Expenses'
import Settings      from './pages/Settings'
import More          from './pages/More'
import Guide         from './pages/Guide'
import AiAssistant   from './pages/AiAssistant'
import Schedule      from './pages/Schedule'

function PureMechanicMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="38" fill="#e8650a" opacity="0.08"/>
      <circle cx="40" cy="40" r="34" fill="#18181e" stroke="#d2af41" strokeWidth="2"/>
      <circle cx="40" cy="40" r="27" fill="#101014" stroke="#6b5a1f" strokeWidth="1"/>
      <g fill="#e8650a">
        <rect x="37" y="4"  width="6" height="9"  rx="1"/>
        <rect x="37" y="67" width="6" height="9"  rx="1"/>
        <rect x="4"  y="37" width="9" height="6"  rx="1"/>
        <rect x="67" y="37" width="9" height="6"  rx="1"/>
        <rect x="14" y="10" width="6" height="6" rx="1" transform="rotate(45 17 13)"/>
        <rect x="60" y="10" width="6" height="6" rx="1" transform="rotate(45 63 13)"/>
        <rect x="14" y="64" width="6" height="6" rx="1" transform="rotate(45 17 67)"/>
        <rect x="60" y="64" width="6" height="6" rx="1" transform="rotate(45 63 67)"/>
      </g>
      <line x1="22" y1="26" x2="52" y2="58" stroke="#b9bec8" strokeWidth="4.5" strokeLinecap="round"/>
      <circle cx="22" cy="26" r="5.5" fill="#6a7080" stroke="#b9bec8" strokeWidth="1.5"/>
      <circle cx="52" cy="58" r="5.5" fill="#6a7080" stroke="#b9bec8" strokeWidth="1.5"/>
      <line x1="58" y1="26" x2="28" y2="58" stroke="#b9bec8" strokeWidth="4.5" strokeLinecap="round"/>
      <circle cx="58" cy="26" r="5.5" fill="#6a7080" stroke="#b9bec8" strokeWidth="1.5"/>
      <circle cx="28" cy="58" r="5.5" fill="#6a7080" stroke="#b9bec8" strokeWidth="1.5"/>
      <rect x="30" y="20" width="20" height="8"  rx="1" fill="#dde2ec"/>
      <rect x="30" y="20" width="20" height="2.5" rx="0.5" fill="white"/>
      <rect x="32" y="28" width="16" height="18" rx="0.5" fill="#b9bec8"/>
      <rect x="30" y="31" width="20" height="3"  rx="0.5" fill="#6a7080"/>
      <rect x="30" y="37" width="20" height="3"  rx="0.5" fill="#6a7080"/>
      <rect x="37" y="46" width="6" height="10" rx="1" fill="#6a7080"/>
      <ellipse cx="40" cy="57" rx="6" ry="4" fill="#505866"/>
      <ellipse cx="40" cy="57" rx="3" ry="2" fill="#303540"/>
      <line x1="8"  y1="37" x2="18" y2="37" stroke="#e8650a" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
      <line x1="8"  y1="41" x2="16" y2="41" stroke="#e8650a" strokeWidth="1.5" strokeLinecap="round" opacity="0.45"/>
      <line x1="62" y1="37" x2="72" y2="37" stroke="#e8650a" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
      <line x1="64" y1="41" x2="72" y2="41" stroke="#e8650a" strokeWidth="1.5" strokeLinecap="round" opacity="0.45"/>
    </svg>
  )
}

function BottomNav() {
  const location = useLocation()
  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
  const tab = (path) =>
    `flex flex-col items-center gap-0.5 py-2 px-1 flex-1 text-xs font-medium transition-colors ${isActive(path) ? 'text-[#E8650A]' : 'text-[#B9BEC8]'}`

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t flex md:hidden" style={{ background: '#0f0f14', borderColor: 'rgba(210,175,65,0.15)' }}>
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

      <NavLink to="/invoices" className={tab('/invoices')}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span className="text-[10px]">Invoices</span>
      </NavLink>

      <NavLink to="/customers" className={tab('/customers')}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-[10px]">Clients</span>
      </NavLink>

      <NavLink to="/more" className={tab('/more')}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="text-[10px]">More</span>
      </NavLink>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        {/* TOP NAV */}
        <nav className="shadow-lg sticky top-0 z-50 border-b" style={{ background: '#0f0f14', borderColor: 'rgba(210,175,65,0.15)' }}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-x-3 py-2 min-h-14">
              {/* Logo */}
              <div className="flex items-center gap-2.5 mr-4 shrink-0">
                <PureMechanicMark size={36} />
                <div className="leading-tight">
                  <div className="text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: '#D2AF41', fontFamily: "'Tektur', sans-serif" }}>Pure</div>
                  <div className="text-[13px] font-black tracking-[0.12em] uppercase" style={{ color: '#F5F2EE', fontFamily: "'Big Shoulders Display', sans-serif", lineHeight: 1 }}>Mechanic</div>
                </div>
              </div>

              {/* Desktop links */}
              <div className="hidden md:flex items-center gap-1 flex-wrap">
                {[
                  { to: '/',          label: 'Dashboard',    end: true },
                  { to: '/checkin',   label: '+ Check In',   highlight: true },
                  { to: '/jobs',      label: 'Jobs' },
                  { to: '/schedule',  label: 'Schedule' },
                  { to: '/invoices',  label: 'Invoices' },
                  { to: '/customers', label: 'Customers' },
                  { to: '/estimate',  label: 'Estimate' },
                  { to: '/intel',     label: 'Vehicle Intel' },
                  { to: '/ai',        label: '🤖 AI Assistant' },
                  { to: '/mileage',   label: 'Mileage' },
                  { to: '/expenses',  label: 'Expenses' },
                  { to: '/settings',  label: 'Settings' },
                  { to: '/guide',     label: 'Guide' },
                ].map(({ to, label, end, highlight }) => (
                  <NavLink key={to} to={to} end={end}
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                        isActive ? 'text-white' : ''
                      }`
                    }
                    style={({ isActive }) => ({
                      background: isActive ? '#E8650A' : highlight ? '#D2AF41' : 'transparent',
                      color: isActive ? '#fff' : highlight ? '#03080A' : '#B9BEC8',
                      fontFamily: "'Tektur', sans-serif",
                    })}>
                    {label}
                  </NavLink>
                ))}
              </div>

              <div className="ml-auto shrink-0 hidden md:block">
                <span className="text-xs px-3 py-1.5 rounded-full border mono" style={{ color: '#E8650A', background: '#0d1520', borderColor: '#1a2a3a' }}>
                  417-651-3040
                </span>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 py-6 pb-28 md:pb-8">
          <Routes>
            <Route path="/"              element={<Dashboard />} />
            <Route path="/checkin"       element={<CheckIn />} />
            <Route path="/jobs"          element={<Jobs />} />
            <Route path="/jobs/:id"      element={<JobDetail />} />
            <Route path="/customers"     element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            <Route path="/invoices"      element={<Invoices />} />
            <Route path="/estimate"      element={<Estimate />} />
            <Route path="/intel"         element={<VehicleIntel />} />
            <Route path="/mileage"       element={<MileageLog />} />
            <Route path="/expenses"      element={<Expenses />} />
            <Route path="/settings"      element={<Settings />} />
            <Route path="/more"          element={<More />} />
            <Route path="/guide"         element={<Guide />} />
            <Route path="/ai"            element={<AiAssistant />} />
            <Route path="/schedule"      element={<Schedule />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
