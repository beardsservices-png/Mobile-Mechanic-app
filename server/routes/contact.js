import express from 'express'
import nodemailer from 'nodemailer'

const router = express.Router()

router.post('/', async (req, res) => {
  const { name, phone, vehicle, message } = req.body

  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required.' })
  }

  // Log to console always (visible in Railway logs)
  console.log(`\n📬 NEW CONTACT FORM SUBMISSION`)
  console.log(`Name:    ${name}`)
  console.log(`Phone:   ${phone || 'not provided'}`)
  console.log(`Vehicle: ${vehicle || 'not provided'}`)
  console.log(`Message: ${message}`)
  console.log(`Time:    ${new Date().toLocaleString()}`)

  // Send email if SMTP env vars are set
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT || '587'),
        secure: false,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      })

      await transporter.sendMail({
        from: `"PureMechanic Website" <${SMTP_USER}>`,
        to: CONTACT_TO || 'dymonvaneperen10@gmail.com',
        replyTo: SMTP_USER,
        subject: `New Website Inquiry — ${name}${vehicle ? ' · ' + vehicle : ''}`,
        text: [
          `New contact form submission from puremechanic.com`,
          ``,
          `Name:    ${name}`,
          `Phone:   ${phone || 'not provided'}`,
          `Vehicle: ${vehicle || 'not provided'}`,
          ``,
          `Message:`,
          message,
          ``,
          `Submitted: ${new Date().toLocaleString()}`,
        ].join('\n'),
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#121218;padding:24px;border-top:3px solid #e8650a;">
              <h1 style="color:#e8650a;font-size:1.4rem;margin:0;">PureMechanic</h1>
              <p style="color:#888;font-size:0.8rem;margin:4px 0 0;">New Website Inquiry</p>
            </div>
            <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;color:#6b7280;width:80px;font-size:0.9rem;">Name</td><td style="padding:8px 0;font-weight:600;font-size:0.9rem;">${name}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280;font-size:0.9rem;">Phone</td><td style="padding:8px 0;font-size:0.9rem;">${phone || '<em>not provided</em>'}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280;font-size:0.9rem;">Vehicle</td><td style="padding:8px 0;font-size:0.9rem;">${vehicle || '<em>not provided</em>'}</td></tr>
              </table>
              <div style="margin-top:20px;padding:16px;background:white;border-left:3px solid #e8650a;">
                <p style="color:#6b7280;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px;">Message</p>
                <p style="font-size:0.95rem;line-height:1.6;margin:0;">${message.replace(/\n/g, '<br>')}</p>
              </div>
              <p style="margin-top:20px;font-size:0.78rem;color:#9ca3af;">Submitted ${new Date().toLocaleString()} via puremechanicsite.pages.dev</p>
            </div>
          </div>
        `
      })
      console.log('✅ Email sent successfully')
    } catch (err) {
      console.error('❌ Email send failed:', err.message)
      // Still return success — submission was logged
    }
  } else {
    console.log('ℹ️  No SMTP config — submission logged only. Set SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_TO in Railway env vars to enable email.')
  }

  res.json({ success: true, message: 'Message received. Dymon will be in touch soon.' })
})

export default router
