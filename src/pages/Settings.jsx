export default function Settings() {
  return (
    <div className="max-w-lg mx-auto space-y-5">
      <h1 className="text-2xl font-bold text-slate-800 brand-heading tracking-wide">Settings</h1>

      {/* Business Info */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
        <h2 className="font-semibold text-slate-700">Business Info</h2>
        <div className="space-y-2 text-sm">
          <Row label="Business Name" value="Dymon in the Rough" />
          <Row label="Type"          value="Mobile Mechanic" />
          <Row label="Phone"         value="417-651-3040" />
          <Row label="Website"       value="dymonintherough.com" />
        </div>
        <p className="text-xs text-slate-400">Contact your developer to update business info.</p>
      </div>

      {/* Rate Info */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
        <h2 className="font-semibold text-slate-700">Rates & Defaults</h2>
        <div className="space-y-2 text-sm">
          <Row label="Default Labor Rate" value="$85/hr" />
          <Row label="Default Markup"     value="20%" />
          <Row label="Invoice Due Period"  value="14 days" />
        </div>
        <p className="text-xs text-slate-400">Contact your developer to change defaults.</p>
      </div>

      {/* Tax Year */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
        <h2 className="font-semibold text-slate-700">Tax Tracking</h2>
        <div className="space-y-2 text-sm">
          <Row label="Current Tax Year"    value={new Date().getFullYear()} />
          <Row label="Mileage Rate (IRS)"  value="$0.67/mile" />
        </div>
        <p className="text-xs text-slate-400">
          The Mileage Log and Expenses pages automatically track deductions for your current tax year.
        </p>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-2">
        <h2 className="font-semibold text-slate-700">More</h2>
        <a href="/guide" className="flex items-center justify-between py-2 border-b border-slate-100 text-sm text-slate-700 hover:text-orange-500">
          <span>User Guide</span>
          <span className="text-slate-300">→</span>
        </a>
        <a href="tel:417-651-3040" className="flex items-center justify-between py-2 text-sm text-slate-700 hover:text-orange-500">
          <span>Call Dymon in the Rough</span>
          <span className="text-slate-300">→</span>
        </a>
      </div>

      {/* About */}
      <div className="bg-[#121212] rounded-xl p-4 text-center space-y-1">
        <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase">Dymon in the Rough</p>
        <p className="text-slate-400 text-xs">Mobile Mechanic Business App</p>
        <p className="text-slate-600 text-xs mt-2">No Tow. No Shop. No Compromise.</p>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-2">
      <span className="text-slate-400 shrink-0">{label}</span>
      <span className="text-slate-800 font-medium text-right">{value}</span>
    </div>
  )
}
