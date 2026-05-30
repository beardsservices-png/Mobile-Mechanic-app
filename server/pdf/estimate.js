import PDFDocument from 'pdfkit'

const BRAND = {
  name: 'DYMON IN THE ROUGH',
  subtitle: 'Mobile Mechanic',
  phone: '417-651-3040',
  black: '#121212',
  orange: '#E8650A',
  gold: '#C8A84B',
  footer: 'Quality repairs wherever you are. No upfront payment required.',
}

function fmtMoney(n) {
  const v = Math.round(n || 0)
  return `$${v.toLocaleString('en-US')}`
}

function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function generateEstimatePDF(est, stream) {
  const doc = new PDFDocument({ margin: 50, size: 'LETTER' })
  doc.pipe(stream)

  const W = doc.page.width - 100 // content width

  // ── HEADER ──
  doc.rect(0, 0, doc.page.width, 90).fill(BRAND.black)

  doc.font('Helvetica-Bold').fontSize(22).fillColor('white')
     .text(BRAND.name, 50, 20)

  doc.font('Helvetica').fontSize(11).fillColor('#C8A84B')
     .text(BRAND.subtitle, 50, 46)

  doc.font('Helvetica').fontSize(11).fillColor('#E8650A')
     .text(BRAND.phone, 0, 46, { align: 'right', width: doc.page.width - 50 })

  // Gold accent line
  doc.rect(0, 90, doc.page.width, 3).fill(BRAND.gold)

  // ── DOC INFO ──
  doc.moveDown(2)
  const y1 = doc.y

  doc.font('Helvetica-Bold').fontSize(20).fillColor(BRAND.black)
     .text('ESTIMATE', 50, y1)

  doc.font('Helvetica').fontSize(10).fillColor('#666')
     .text(`# ${est.estimate_num}`, 50, y1 + 26)
     .text(`Date: ${fmtDate(est.created_at)}`, 50, y1 + 40)

  if (est.valid_until) {
    doc.text(`Valid until: ${fmtDate(est.valid_until)}`, 50, y1 + 54)
  }

  // ── BILL TO / VEHICLE ──
  const y2 = y1 + 80
  doc.rect(50, y2, W, 1).fill('#e2e8f0')

  doc.font('Helvetica-Bold').fontSize(9).fillColor('#94a3b8')
     .text('BILL TO', 50, y2 + 8).text('VEHICLE', 300, y2 + 8)

  doc.font('Helvetica-Bold').fontSize(12).fillColor(BRAND.black)
     .text(est.customer_name || '—', 50, y2 + 22)
  doc.font('Helvetica').fontSize(10).fillColor('#444')
     .text(est.customer_phone || '', 50, y2 + 38)

  doc.font('Helvetica-Bold').fontSize(12).fillColor(BRAND.black)
     .text(est.vehicle || '—', 300, y2 + 22)
  doc.font('Helvetica').fontSize(10).fillColor('#444')
     .text(est.plate || '', 300, y2 + 38)

  // ── LINE ITEMS ──
  const y3 = y2 + 70
  doc.rect(50, y3, W, 22).fill('#1a1a1a')

  doc.font('Helvetica-Bold').fontSize(9).fillColor('white')
     .text('SERVICE', 58, y3 + 7)
     .text('QTY', 390, y3 + 7)
     .text('PRICE', 430, y3 + 7)
     .text('TOTAL', W - 10, y3 + 7, { align: 'right', width: 60 })

  let rowY = y3 + 22
  const items = est.items || []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (i % 2 === 0) {
      doc.rect(50, rowY, W, 20).fill('#f8fafc')
    }
    const lineTotal = item.price * (item.qty || 1)
    doc.font('Helvetica').fontSize(10).fillColor(BRAND.black)
       .text(item.name, 58, rowY + 5, { width: 320, ellipsis: true })
    doc.text(String(item.qty || 1), 390, rowY + 5)
    doc.text(fmtMoney(item.price), 430, rowY + 5)
    doc.text(fmtMoney(lineTotal), W - 10, rowY + 5, { align: 'right', width: 60 })
    rowY += 20
  }

  // ── TOTALS ──
  doc.rect(50, rowY, W, 1).fill('#e2e8f0')
  rowY += 12

  const labelX  = W - 70
  const valueX  = W - 10

  doc.font('Helvetica').fontSize(11).fillColor('#444')
     .text('Subtotal:', labelX, rowY)
  doc.font('Helvetica-Bold').fontSize(11).fillColor(BRAND.black)
     .text(fmtMoney(est.subtotal), valueX, rowY, { align: 'right', width: 60 })
  rowY += 18

  doc.rect(labelX, rowY, 120, 24).fill(BRAND.orange)
  doc.font('Helvetica-Bold').fontSize(13).fillColor('white')
     .text('TOTAL:', labelX + 8, rowY + 5)
  doc.font('Helvetica-Bold').fontSize(13).fillColor('white')
     .text(fmtMoney(est.total), valueX, rowY + 5, { align: 'right', width: 60 })
  rowY += 36

  // ── NOTES ──
  if (est.notes) {
    rowY += 10
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#94a3b8').text('NOTES', 50, rowY)
    rowY += 14
    doc.font('Helvetica').fontSize(10).fillColor('#444').text(est.notes, 50, rowY, { width: W })
  }

  // ── FOOTER ──
  const footerY = doc.page.height - 60
  doc.rect(0, footerY - 5, doc.page.width, 65).fill(BRAND.black)
  doc.rect(0, footerY - 5, doc.page.width, 2).fill(BRAND.gold)
  doc.font('Helvetica').fontSize(9).fillColor('#c8a84b')
     .text(BRAND.footer, 50, footerY + 5, { align: 'center', width: doc.page.width - 100 })
  doc.font('Helvetica-Bold').fontSize(9).fillColor(BRAND.orange)
     .text(BRAND.phone, 50, footerY + 20, { align: 'center', width: doc.page.width - 100 })

  doc.end()
}
