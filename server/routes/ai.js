import { Router } from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = Router()

const SYSTEM_PROMPT = `You are an expert automotive mechanic assistant helping a solo traveling mechanic named Dymon run his business (Pure Mechanic — Traveling Mechanic, Springfield MO area). You help with:

- Vehicle diagnostics and troubleshooting (ask year/make/model/symptoms if not given)
- Step-by-step repair procedures
- Parts recommendations, specifications, and OEM numbers when relevant
- Labor time estimates (flag if job is unusually complex for a solo mobile mechanic)
- Parts pricing ballpark (give ranges, not exact)
- Torque specs, fluid specs, and technical specs
- Tips for diagnosing intermittent issues
- Advice on what to charge (typical market rates)
- Whether a job is worth taking on as a mobile mechanic vs. recommending a shop

Be concise and practical. Format your responses clearly — use bullet points or numbered steps when listing procedures. When diagnosing, list the most likely causes first. Always flag safety-critical issues. If a repair is dangerous or impractical to do mobile (e.g., requires a lift for more than 30 min), say so.`

router.post('/chat', async (req, res) => {
  const { messages } = req.body
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array required' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(503).json({ error: 'AI assistant not configured. Add ANTHROPIC_API_KEY to Railway environment variables.' })
  }

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    })
    res.json({ content: response.content[0].text })
  } catch (err) {
    console.error('AI error:', err.message)
    res.status(500).json({ error: err.message || 'AI request failed' })
  }
})

router.post('/audio', async (req, res) => {
  const { audioBase64, mimeType, context } = req.body
  if (!audioBase64) return res.status(400).json({ error: 'audioBase64 required' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(503).json({ error: 'AI assistant not configured. Add ANTHROPIC_API_KEY to Railway environment variables.' })
  }

  const contextText = context?.trim() ||
    'Analyze this vehicle sound recording. List the top 3 most likely causes of this noise, what to inspect first, and flag any safety-critical concerns. Be concise.'

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: mimeType || 'audio/wav',
              data: audioBase64,
            },
          },
          { type: 'text', text: contextText },
        ],
      }],
    })
    res.json({ content: response.content[0].text })
  } catch (err) {
    console.error('AI audio error:', err.message)
    const isUnsupported = /unsupported|invalid.*media|audio/i.test(err.message)
    res.status(500).json({
      error: isUnsupported
        ? 'Direct audio analysis is not available for this file type. Try the chat instead — describe the sound, when it happens, and the vehicle. Claude diagnoses very accurately from descriptions.'
        : (err.message || 'Audio analysis failed'),
    })
  }
})

export default router
