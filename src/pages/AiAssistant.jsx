import { useState, useRef, useEffect } from 'react'
import { api } from '../api'

const STARTERS = [
  { label: 'Diagnose an issue', prompt: 'I have a customer with a ' },
  { label: 'Repair steps', prompt: 'What are the steps to replace ' },
  { label: 'Parts & specs', prompt: 'What are the specs for ' },
  { label: 'Labor estimate', prompt: 'How long does it take to ' },
  { label: 'Should I take this job?', prompt: 'Is it practical to do a mobile repair for: ' },
  { label: 'What to charge?', prompt: 'What should I charge to ' },
]

export default function AiAssistant() {
  const [messages, setMessages]   = useState([])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const bottomRef                 = useRef(null)
  const inputRef                  = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text) {
    const content = (text || input).trim()
    if (!content || loading) return
    setInput('')
    setError(null)
    const newMessages = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const data = await api.post('/api/ai/chat', { messages: newMessages })
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  function clear() {
    setMessages([])
    setError(null)
    inputRef.current?.focus()
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col" style={{ minHeight: 'calc(100vh - 180px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 brand-heading tracking-wide">AI Assistant</h1>
          <p className="text-slate-500 text-xs mt-0.5">Powered by Claude — diagnostics, repairs, parts, pricing</p>
        </div>
        {messages.length > 0 && (
          <button onClick={clear} className="text-xs text-slate-400 hover:text-slate-600 px-3 py-1.5 border border-slate-200 rounded-lg">
            Clear
          </button>
        )}
      </div>

      {/* Starter chips (shown when no messages) */}
      {messages.length === 0 && (
        <div className="space-y-3 mb-4">
          <p className="text-sm text-slate-500">Quick starts:</p>
          <div className="grid grid-cols-2 gap-2">
            {STARTERS.map(s => (
              <button key={s.label} onClick={() => setInput(s.prompt)}
                className="text-left text-xs bg-white border border-slate-200 rounded-xl p-3 text-slate-700 hover:border-orange-300 hover:bg-orange-50 active:bg-orange-100 transition-colors shadow-sm">
                {s.label}
              </button>
            ))}
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center space-y-1">
            <p className="text-2xl">🔧</p>
            <p className="text-sm font-medium text-slate-700">Ask me anything mechanical</p>
            <p className="text-xs text-slate-400">Diagnosis · Repair steps · Parts specs · What to charge</p>
          </div>
        </div>
      )}

      {/* Chat messages */}
      <div className="flex-1 space-y-3 mb-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full border flex items-center justify-center shrink-0 mr-2 mt-0.5" style={{ background: '#03080A', borderColor: '#D2AF41' }}>
                <span className="text-xs font-bold" style={{ color: '#D2AF41' }}>AI</span>
              </div>
            )}
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
              m.role === 'user'
                ? 'bg-orange-500 text-white rounded-br-md'
                : 'bg-white border border-slate-100 text-slate-800 rounded-bl-md shadow-sm'
            }`}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full border flex items-center justify-center shrink-0 mr-2 mt-0.5" style={{ background: '#03080A', borderColor: '#D2AF41' }}>
              <span className="text-xs font-bold" style={{ color: '#D2AF41' }}>AI</span>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-20 md:bottom-4 bg-slate-50 pt-2">
        <div className="flex gap-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-1.5">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Describe the issue or ask a question…"
            rows={2}
            className="flex-1 resize-none text-sm text-slate-800 placeholder-slate-400 border-0 outline-none px-2 py-1 bg-transparent"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="self-end px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors shrink-0">
            Send
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-300 mt-1">Claude · For guidance only — verify specs before each job</p>
      </div>
    </div>
  )
}
