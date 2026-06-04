import { useState, useRef, useEffect, useCallback } from 'react'
import { api } from '../api'

const STARTERS = [
  { label: 'Diagnose an issue',    prompt: 'I have a customer with a ' },
  { label: 'Repair steps',         prompt: 'What are the steps to replace ' },
  { label: 'Parts & specs',        prompt: 'What are the specs for ' },
  { label: 'Labor estimate',       prompt: 'How long does it take to ' },
  { label: 'Should I take this?',  prompt: 'Is it practical to do a mobile repair for: ' },
  { label: 'What to charge?',      prompt: 'What should I charge to ' },
]

const AUDIO_ACCEPT = 'audio/wav,audio/mp3,audio/mpeg,audio/ogg,audio/m4a,audio/aac,.wav,.mp3,.ogg,.m4a,.aac'

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const b64 = reader.result.split(',')[1]
      resolve(b64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function MicIcon({ active }) {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {active ? (
        <>
          <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" stroke="none" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10a7 7 0 0014 0M12 19v3M9 22h6" />
        </>
      ) : (
        <>
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10a7 7 0 0014 0M12 19v3M9 22h6" />
        </>
      )}
    </svg>
  )
}

export default function AiAssistant() {
  const [messages, setMessages]       = useState([])
  const [input, setInput]             = useState('')
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)
  const [listening, setListening]     = useState(false)
  const [audioFile, setAudioFile]     = useState(null)
  const [audioContext, setAudioContext] = useState('')
  const [audioLoading, setAudioLoading] = useState(false)
  const bottomRef   = useRef(null)
  const inputRef    = useRef(null)
  const audioRef    = useRef(null)
  const recognizer  = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, audioLoading])

  // ── Voice input ──────────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setError('Voice input not supported in this browser. Try Chrome or Safari.')
      return
    }
    const rec = new SR()
    rec.lang = 'en-US'
    rec.continuous = false
    rec.interimResults = true
    rec.onstart = () => setListening(true)
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('')
      setInput(prev => (prev ? prev + ' ' : '') + transcript)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => { setListening(false); setError('Voice input failed. Try typing instead.') }
    recognizer.current = rec
    rec.start()
  }, [])

  function stopListening() {
    recognizer.current?.stop()
    setListening(false)
  }

  function toggleMic() {
    listening ? stopListening() : startListening()
  }

  // ── Text chat ────────────────────────────────────────────────────────────
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
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  // ── Audio upload ─────────────────────────────────────────────────────────
  function handleAudioSelect(e) {
    const file = e.target.files?.[0]
    if (file) setAudioFile(file)
    e.target.value = ''
  }

  async function analyzeAudio() {
    if (!audioFile || audioLoading) return
    setError(null)
    setAudioLoading(true)

    const userMsg = audioContext.trim()
      ? `[Audio: ${audioFile.name}] ${audioContext}`
      : `[Audio: ${audioFile.name}] Analyze this vehicle sound recording.`

    const newMessages = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setAudioFile(null)
    setAudioContext('')

    try {
      const b64 = await fileToBase64(audioFile)
      const data = await api.post('/api/ai/audio', {
        audioBase64: b64,
        mimeType: audioFile.type || 'audio/wav',
        context: audioContext.trim() || undefined,
      })
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
    } catch (err) {
      setError(err.message)
    } finally {
      setAudioLoading(false)
    }
  }

  function clear() {
    setMessages([])
    setError(null)
    setAudioFile(null)
    setAudioContext('')
    inputRef.current?.focus()
  }

  const busy = loading || audioLoading

  return (
    <div className="max-w-2xl mx-auto flex flex-col" style={{ minHeight: 'calc(100vh - 180px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 brand-heading tracking-wide">AI Assistant</h1>
          <p className="text-slate-500 text-xs mt-0.5">Diagnostics · Repairs · Parts · Pricing — Powered by Claude</p>
        </div>
        {messages.length > 0 && (
          <button onClick={clear} className="text-xs text-slate-400 hover:text-slate-600 px-3 py-1.5 border border-slate-200 rounded-lg">
            Clear
          </button>
        )}
      </div>

      {/* Starters */}
      {messages.length === 0 && (
        <div className="space-y-3 mb-4">
          <p className="text-sm text-slate-500">Quick starts:</p>
          <div className="grid grid-cols-2 gap-2">
            {STARTERS.map(s => (
              <button key={s.label} onClick={() => { setInput(s.prompt); inputRef.current?.focus() }}
                className="text-left text-xs bg-white border border-slate-200 rounded-xl p-3 text-slate-700 hover:border-orange-300 hover:bg-orange-50 active:bg-orange-100 transition-colors shadow-sm">
                {s.label}
              </button>
            ))}
          </div>

          {/* Audio upload card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔊</span>
              <div>
                <p className="text-sm font-semibold text-slate-700">Upload a Car Sound</p>
                <p className="text-xs text-slate-400">Record the noise, upload it here — Claude will try to diagnose it</p>
              </div>
            </div>
            <button onClick={() => audioRef.current?.click()}
              className="w-full py-2 text-sm font-medium text-orange-500 border border-orange-200 rounded-lg hover:bg-orange-50 active:bg-orange-100">
              Choose Audio File (WAV / MP3 / M4A)
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center space-y-1">
            <p className="text-2xl">🔧</p>
            <p className="text-sm font-medium text-slate-700">Ask me anything mechanical</p>
            <p className="text-xs text-slate-400">Type, speak with the mic, or upload a sound recording</p>
          </div>
        </div>
      )}

      {/* Audio file panel */}
      {audioFile && (
        <div className="mb-3 bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔊</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{audioFile.name}</p>
              <p className="text-xs text-slate-400">{(audioFile.size / 1024).toFixed(0)} KB · {audioFile.type || 'audio'}</p>
            </div>
            <button onClick={() => setAudioFile(null)} className="text-slate-400 hover:text-slate-600 text-lg leading-none">×</button>
          </div>
          <textarea
            value={audioContext}
            onChange={e => setAudioContext(e.target.value)}
            placeholder="Add context (optional): Vehicle year/make/model, when the noise happens, recent repairs…"
            rows={2}
            className="w-full text-sm text-slate-800 placeholder-slate-400 border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-orange-400"
          />
          <button onClick={analyzeAudio} disabled={audioLoading}
            className="w-full py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors">
            {audioLoading ? 'Analyzing…' : 'Analyze Sound'}
          </button>
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

        {busy && (
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

      {/* Input bar */}
      <div className="sticky bottom-20 md:bottom-4 bg-slate-50 pt-2">
        <div className="flex gap-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-1.5">
          {/* Mic button */}
          <button onClick={toggleMic}
            title={listening ? 'Stop listening' : 'Tap to speak'}
            className={`self-end p-2 rounded-xl transition-colors shrink-0 ${
              listening
                ? 'bg-red-500 text-white animate-pulse'
                : 'text-slate-400 hover:bg-slate-100 hover:text-orange-500'
            }`}>
            <MicIcon active={listening} />
          </button>

          {/* Audio upload button */}
          <button onClick={() => audioRef.current?.click()}
            title="Upload audio for sound diagnosis"
            className="self-end p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-orange-500 transition-colors shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 18.364V5.636M8.464 8.464a5 5 0 000 7.072" />
            </svg>
          </button>

          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={listening ? 'Listening…' : 'Describe the issue or ask a question…'}
            rows={2}
            className="flex-1 resize-none text-sm text-slate-800 placeholder-slate-400 border-0 outline-none px-2 py-1 bg-transparent"
          />

          <button onClick={() => send()} disabled={!input.trim() || busy}
            className="self-end px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors shrink-0">
            Send
          </button>
        </div>

        {listening && (
          <p className="text-center text-xs text-red-500 mt-1 font-medium">Listening… tap mic to stop</p>
        )}
        {!listening && (
          <p className="text-center text-[10px] text-slate-300 mt-1">Claude · For guidance only — verify specs before each job</p>
        )}
      </div>

      {/* Hidden file input */}
      <input ref={audioRef} type="file" accept={AUDIO_ACCEPT} className="hidden" onChange={handleAudioSelect} />
    </div>
  )
}
