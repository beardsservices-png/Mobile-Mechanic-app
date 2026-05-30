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

export function generateInvoicePDF(inv, stream) {
  const doc = new PDFDocument({ margin: 50, size: 'LETTER' })
  doc.pipe(stream)

  const W = doc.page.width - 100

  // ── HEADER ──
  doc.rect(0, 0, doc.page.width, 90).fill(BRAND.black)

  doc.font('Helvetica-Bold').fontSize(22).fillColor('white')
     .text(BRAND.name, 50, 20)

  doc.font('Helvetica').fontSize(11).fillColor('#C8A84B')
     .text(BRAND.subtitle, 50, 46)

  doc.font('Helvetica').fontSize(11).fillColor('#E8650A')
     .text(BRAND.phone, 0, 46, { align: 'right', width: doc.page.width - 50 })

  doc.rect(0, 90, doc.page.width, 3).fill(BRAND.gold)

  // ── DOC INFO ──
  doc.moveDown(2)
  const y1 = doc.y

  doc.font('Helvetica-Bold').fontSize(20).fillColor(BRAND.black)
     .text('INVOICE', 50, y1)

  doc.font('Helvetica').fontSize(10).fillColor('#666')
     .text(`# ${inv.invoice_num}`, 50, y1 + 26)
     .text(`Date: ${fmtDate(inv.created_at)}`, 50, y1 + 40)

  if (inv.due_date) {
    const dueColor = inv.status === 'unpaid' ? BRAND.orange : '#666'
    doc.fillColor(dueColor).text(`Due: ${fmtDate(inv.due_date)}`, 50, y1 + 54)
  }

  // Status badge
  const statusColors = { paid: '#16a34a', unpaid: BRAND.orange, partial: '#7c3aed' }
  const sc = statusColors[inv.status] || '#666'
  doc.rect(doc.page.width - 130, y1, 80, 26).fill(sc)
  doc.font('Helvetica-Bold').fontSize(10).fillColor('white')
     .text(inv.status.toUpperCase(), doc.page.width - 130, y1 + 7, { width: 80, align: 'center' })

  if (inv.payment_method && inv.status === 'paid') {
    doc.font('Helvetica').fontSize(9).fillColor('#16a34a')
       .text(`Paid via ${inv.payment_method}`, doc.page.width - 130, y1 + 32, { width: 80, align: 'center' })
  }

  // ── BILL TO / VEHICLE ──
  const y2 = y1 + 80
  doc.rect(50, y2, W, 1).fill('#e2e8f0')

  doc.font('Helvetica-Bold').fontSize(9).fillColor('#94a3b8')
     .text('BILL TO', 50, y2 + 8).text('VEHICLE', 300, y2 + 8)

  doc.font('Helvetica-Bold').fontSize(12).fillColor(BRAND.black)
     .text(inv.customer_name || '—', 50, y2 + 22)
  doc.font('Helvetica').fontSize(10).fillColor('#444')
     .text(inv.customer_phone || '', 50, y2 + 38)

  doc.font('Helvetica-Bold').fontSize(12).fillColor(BRAND.black)
     .text(inv.vehicle || '—', 300, y2 + 22)
  doc.font('Helvetica').fontSize(10).fillColor('#444')
     .text(inv.plate || '', 300, y2 + 38)

  // ── LINE ITEMS ──
  const y3 = y2 + 70
  doc.rect(50, y3, W, 22).fill('#1a1a1a')

  doc.font('Helvetica-Bold').fontSize(9).fillColor('white')
     .text('SERVICE', 58, y3 + 7)
     .text('QTY', 390, y3 + 7)
     .text('PRICE', 430, y3 + 7)
     .text('TOTAL', W - 10, y3 + 7, { align: 'right', width: 60 })

  let rowY = y3 + 22
  const services = inv.services || []
  for (let i = 0; i < services.length; i++) {
    const svc = services[i]
    if (i % 2 === 0) doc.rect(50, rowY, W, 20).fill('#f8fafc')
    const lineTotal = svc.price * (svc.qty || 1)
    doc.font('Helvetica').fontSize(10).fillColor(BRAND.black)
       .text(svc.name, 58, rowY + 5, { width: 320, ellipsis: true })
    doc.text(String(svc.qty || 1), 390, rowY + 5)
    doc.text(fmtMoney(svc.price), 430, rowY + 5)
    doc.text(fmtMoney(lineTotal), W - 10, rowY + 5, { align: 'right', width: 60 })
    rowY += 20
  }

  // Work performed note
  if (inv.work_performed) {
    rowY += 8
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#94a3b8').text('WORK PERFORMED', 50, rowY)
    rowY += 14
    doc.font('Helvetica').fontSize(10).fillColor('#444').text(inv.work_performed, 50, rowY, { width: W })
    rowY += doc.heightOfString(inv.work_performed, { width: W }) + 8
  }

  // ── TOTALS ──
  doc.rect(50, rowY, W, 1).fill('#e2e8f0')
  rowY += 12

  const labelX = W - 70
  const valueX = W - 10

  doc.font('Helvetica').fontSize(11).fillColor('#444')
     .text('Subtotal:', labelX, rowY)
  doc.font('Helvetica-Bold').fontSize(11).fillColor(BRAND.black)
     .text(fmtMoney(inv.subtotal), valueX, rowY, { align: 'right', width: 60 })
  rowY += 18

  doc.rect(labelX, rowY, 120, 24).fill(BRAND.orange)
  doc.font('Helvetica-Bold').fontSize(13).fillColor('white')
     .text('TOTAL:', labelX + 8, rowY + 5)
  doc.font('Helvetica-Bold').fontSize(13).fillColor('white')
     .text(fmtMoney(inv.total), valueX, rowY + 5, { align: 'right', width: 60 })
  rowY += 36

  if (inv.paid_amount > 0 && inv.status !== 'paid') {
    doc.font('Helvetica').fontSize(10).fillColor('#16a34a')
       .text(`Paid: ${fmtMoney(inv.paid_amount)}`, labelX, rowY)
    doc.text(`Balance due: ${fmtMoney(inv.total - inv.paid_amount)}`, labelX, rowY + 16)
    rowY += 36
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
