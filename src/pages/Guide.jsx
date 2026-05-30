import { useState } from 'react'

const SECTIONS = [
  {
    id: 'checkin',
    icon: '➕',
    title: 'Checking In a Customer',
    color: 'bg-orange-50 border-orange-200',
    headingColor: 'text-orange-700',
    steps: [
      { num: '1', text: 'Tap "Check In" at the top of the screen (or the + Check In button at the bottom on your phone).' },
      { num: '2', text: 'Is this a returning customer? Pick "Existing" and find their name. If it\'s someone new, pick "New Customer" and type their name and phone number.' },
      { num: '3', text: 'Fill in the vehicle info — year, make, model, and license plate at minimum.' },
      { num: '4', text: 'Pick what\'s wrong. Tap the button that best describes the problem (Grinding, Won\'t Start, etc.). Then type what the customer told you in their own words.' },
      { num: '5', text: 'Review everything and tap "Check In Customer." The app will create a Job for you and take you straight to it.' },
    ],
    tip: 'After checking in, you land on the Job Detail screen. That\'s where you do all the real work.',
  },
  {
    id: 'jobs',
    icon: '🔧',
    title: 'Working a Job',
    color: 'bg-blue-50 border-blue-200',
    headingColor: 'text-blue-700',
    steps: [
      { num: '1', text: 'Open the job from the Jobs tab or from the Dashboard if it\'s today\'s job.' },
      { num: '2', text: 'Tap "Start Job" to move it to In Progress. This lets you know — and the record shows — when you actually started.' },
      { num: '3', text: 'Use the timer at the bottom to track how long the job takes. Tap ▶ Start when you begin, ■ Stop when you\'re done.' },
      { num: '4', text: 'Under "Diagnosis" — write what you actually found. This is just for you, the customer never sees it.' },
      { num: '5', text: 'Under "Work Performed" — write what you did. This DOES show on the invoice, so write it clearly.' },
      { num: '6', text: 'Add any parts you used under "Parts Used." Type the part name, your cost, and your markup %. The sell price calculates automatically.' },
      { num: '7', text: 'Add or remove services in the Services section. The total updates automatically.' },
      { num: '8', text: 'Tap "Save Changes" before leaving the page!' },
      { num: '9', text: 'When the job is done, tap "Complete Job." Then tap "Create Invoice" to generate the invoice.' },
    ],
    tip: 'If you close the app by accident, your timer will still be running when you come back. The start time is saved.',
  },
  {
    id: 'invoices',
    icon: '🧾',
    title: 'Invoices & Getting Paid',
    color: 'bg-purple-50 border-purple-200',
    headingColor: 'text-purple-700',
    steps: [
      { num: '1', text: 'Tap "Invoices" in the bottom navigation.' },
      { num: '2', text: 'You\'ll see all your invoices. The big orange number at the top shows how much money you\'re owed total.' },
      { num: '3', text: 'Tap "Download PDF" to get a professional-looking PDF you can text or email to the customer.' },
      { num: '4', text: 'When the customer pays, tap "Mark Paid." Pick how they paid (Cash, Card, Venmo, Zelle, or Check) and tap the checkmark.' },
      { num: '5', text: 'The invoice status changes to "Paid" and the outstanding balance updates.' },
    ],
    tip: 'The PDF has your business name, phone number, all the work done, the total, and a footer that says "No upfront payment required."',
  },
  {
    id: 'estimates',
    icon: '📋',
    title: 'Writing an Estimate',
    color: 'bg-green-50 border-green-200',
    headingColor: 'text-green-700',
    steps: [
      { num: '1', text: 'Tap "More" at the bottom, then "New Estimate."' },
      { num: '2', text: 'Pick the customer from the dropdown.' },
      { num: '3', text: 'Tap each service you\'re planning to do. They\'ll get added to the total at the bottom.' },
      { num: '4', text: 'Tap "Save Estimate." You\'ll get an estimate number like EST-2605-01.' },
      { num: '5', text: 'Tap "Download PDF" to get a PDF estimate to share with the customer.' },
    ],
    tip: 'Estimates don\'t create a job automatically. When the customer approves it, you can start the job through Check In.',
  },
  {
    id: 'customers',
    icon: '👥',
    title: 'Customer List',
    color: 'bg-teal-50 border-teal-200',
    headingColor: 'text-teal-700',
    steps: [
      { num: '1', text: 'Tap "Clients" at the bottom to see all your customers.' },
      { num: '2', text: 'The dollar amount on the right shows how much that customer has spent with you total.' },
      { num: '3', text: 'Tap a customer to see their full profile — all their vehicles, every job you\'ve done for them, and their lifetime value.' },
      { num: '4', text: 'From the customer profile, you can tap "Call Customer" to call them directly from your phone, or "New Job" to start a check-in for them.' },
    ],
    tip: 'Use the search bar at the top of the Customers page to find someone fast by name or phone number.',
  },
  {
    id: 'mileage',
    icon: '📍',
    title: 'Mileage Log (For Taxes)',
    color: 'bg-yellow-50 border-yellow-200',
    headingColor: 'text-yellow-700',
    steps: [
      { num: '1', text: 'Tap "More" then "Mileage Log."' },
      { num: '2', text: 'Every time you drive for business, tap "+ Add" and log it: where you started, where you went, and how many miles.' },
      { num: '3', text: 'The app automatically calculates your IRS tax deduction at $0.67 per mile.' },
      { num: '4', text: 'At tax time, your total miles and the estimated deduction are right at the top of the page.' },
    ],
    tip: 'Log your trips the same day — it\'s easy to forget. Even driving to pick up parts counts as a business trip.',
  },
  {
    id: 'expenses',
    icon: '💰',
    title: 'Expenses (For Taxes)',
    color: 'bg-red-50 border-red-200',
    headingColor: 'text-red-700',
    steps: [
      { num: '1', text: 'Tap "More" then "Expenses."' },
      { num: '2', text: 'Tap "+ Add" and enter the date, how much you spent, the category (Parts, Tools, Fuel, etc.), and what you bought.' },
      { num: '3', text: 'The totals at the top break down your spending by category for the whole year.' },
    ],
    tip: 'Every dollar you spend on parts, tools, fuel, and insurance is a tax deduction. Log it all!',
  },
  {
    id: 'intel',
    icon: '🔍',
    title: 'Vehicle Intel',
    color: 'bg-slate-50 border-slate-200',
    headingColor: 'text-slate-700',
    steps: [
      { num: '1', text: 'Tap "Intel" at the bottom of the screen.' },
      { num: '2', text: 'Type the vehicle (like "Ford F-150" or "Honda Civic") and pick the symptom.' },
      { num: '3', text: 'The app shows you common problems for that vehicle, what to check, and what parts you likely need.' },
      { num: '4', text: 'This is a reference tool — it doesn\'t save anything. Use it to quickly look something up in the field.' },
    ],
    tip: 'Vehicle Intel works even when your internet is slow or spotty because it\'s built right into the app.',
  },
]

export default function Guide() {
  const [open, setOpen] = useState(null)

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-[#121212] rounded-2xl p-5 text-center space-y-2">
        <h1 className="text-2xl font-bold text-white brand-heading">User Guide</h1>
        <p className="text-amber-400 text-sm">How to use your Dymon in the Rough app</p>
        <p className="text-slate-400 text-xs mt-2 leading-relaxed">
          Tap any section below to see step-by-step instructions.
          If you ever get stuck, call your app developer.
        </p>
      </div>

      <div className="space-y-2">
        {SECTIONS.map(sec => (
          <div key={sec.id} className={`rounded-xl border ${sec.color} overflow-hidden`}>
            <button
              onClick={() => setOpen(open === sec.id ? null : sec.id)}
              className="w-full flex items-center gap-3 p-4 text-left">
              <span className="text-2xl w-8 text-center shrink-0">{sec.icon}</span>
              <span className={`flex-1 font-bold text-base ${sec.headingColor}`}>{sec.title}</span>
              <span className={`text-lg font-bold ${sec.headingColor} shrink-0`}>
                {open === sec.id ? '−' : '+'}
              </span>
            </button>

            {open === sec.id && (
              <div className="px-4 pb-4 space-y-3">
                <div className="space-y-3">
                  {sec.steps.map(step => (
                    <div key={step.num} className="flex gap-3 items-start">
                      <div className="w-7 h-7 rounded-full bg-white border-2 border-current flex items-center justify-center shrink-0 mt-0.5">
                        <span className={`text-xs font-bold ${sec.headingColor}`}>{step.num}</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed flex-1">{step.text}</p>
                    </div>
                  ))}
                </div>

                {sec.tip && (
                  <div className="bg-white rounded-xl p-3 border border-white/50">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Tip</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{sec.tip}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-100 text-center space-y-2">
        <p className="text-sm font-semibold text-slate-700">Need help?</p>
        <p className="text-xs text-slate-400">
          Your developer set this app up for you. If something isn't working right,
          just let them know and they'll fix it.
        </p>
      </div>
    </div>
  )
}
