import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Customers from './pages/Customers'
import Estimate from './pages/Estimate'
import CheckIn from './pages/CheckIn'
import VehicleIntel from './pages/VehicleIntel'
import JobDetail from './pages/JobDetail'

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
    `flex flex-col items-center gap-0.5 py-2 px-1 flex-1 text-xs font-medium transition-colors ${isActive(path) ? 'text-orange-500' : 'text-slate-400'}`
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f0f14] border-t border-yellow-700/20 flex md:hidden">
      <NavLink to="/" end className={tab('/')}><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg><span className="text-[10px]">Dash</span></NavLink>
      <NavLink to="/checkin" className={tab('/checkin')}><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg><span className="text-[10px]">Check In</span></NavLink>
      <NavLink to="/jobs" className={tab('/jobs')}><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg><span className="text-[10px]">Jobs</span></NavLink>
      <NavLink to="/intel" className={tab('/intel')}><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg><span className="text-[10px]">Intel</span></NavLink>
      <NavLink to="/customers" className={tab('/customers')}><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg><span className="text-[10px]">Clients</span></NavLink>
      <NavLink to="/estimate" className={tab('/estimate')}><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg><span className="text-[10px]">Estimate</span></NavLink>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <nav className="bg-[#0f0f14] shadow-lg border-b border-yellow-700/20 sticky top-0 z-50">
          <div className="h-[3px] w-full" style={{background:'linear-gradient(90deg,#e8650a,#d2af41,#e8650a)'}}/>
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-x-3 py-2.5 min-h-14">
              <div className="flex items-center gap-3 mr-6 shrink-0">
                <PureMechanicMark size={40} />
                <div className="leading-tight">
                  <div className="flex items-baseline gap-0">
                    <span className="text-[16px] font-black tracking-[0.05em] uppercase" style={{fontFamily:'Barlow Condensed,sans-serif',color:'#e8650a'}}>Pure</span>
                    <span className="text-[16px] font-black tracking-[0.05em] uppercase text-white" style={{fontFamily:'Barlow Condensed,sans-serif'}}>Mechanic</span>
                  </div>
                  <div className="text-[9px] tracking-[0.28em] uppercase" style={{fontFamily:'Barlow Condensed,sans-serif',color:'#d2af41',opacity:0.8}}>Traveling Mechanic</div>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-1 flex-wrap">
                {[
                  { to:'/',          label:'Dashboard',     end:true  },
                  { to:'/checkin',   label:'+ Check In',    cta:true  },
                  { to:'/jobs',      label:'Jobs'                     },
                  { to:'/intel',     label:'🔍 Vehicle Intel'         },
                  { to:'/customers', label:'Customers'                },
                  { to:'/estimate',  label:'Estimate'                 },
                ].map(({to,label,end,cta}) => (
                  <NavLink key={to} to={to} end={end}
                    className={({isActive}) =>
                      `px-3 py-1.5 rounded text-sm font-semibold transition-colors whitespace-nowrap ${
                        isActive ? 'bg-orange-500 text-white'
                        : cta ? 'bg-[#d2af41] text-black hover:bg-[#f5d764]'
                        : 'text-slate-300 hover:bg-slate-700/60'}`}>
                    {label}
                  </NavLink>
                ))}
              </div>
              <div className="ml-auto shrink-0 hidden md:flex items-center gap-2">
                <span className="text-[10px] font-mono text-yellow-600/60 tracking-widest uppercase">Call</span>
                <a href="tel:4176513040" className="text-xs font-mono text-orange-400 bg-slate-800/80 px-3 py-1.5 rounded border border-orange-500/30 hover:border-orange-400 transition-colors">
                  417-651-3040
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 py-6 pb-28 md:pb-8">
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/checkin"   element={<CheckIn />} />
            <Route path="/jobs"      element={<Jobs />} />
            <Route path="/jobs/:id"    element={<JobDetail />} />
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
