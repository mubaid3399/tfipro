import { jsPDF } from 'jspdf'

/**
 * Generates a clean, monochrome bank-statement/receipt style PDF with borders and zero heavy colors.
 * @param {Object} order - The completed order object
 */
export const generateReceiptPdf = (order) => {
  if (!order) return

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 12
  const contentWidth = pageWidth - margin * 2

  // Line drawing styles
  doc.setDrawColor(30, 41, 59) // Dark slate / near-black for crisp borders
  doc.setTextColor(15, 23, 42) // Slate-900 / black
  doc.setLineWidth(0.35)

  // 1. Outer Bounding Border (Like an official statement/certificate)
  doc.rect(margin, margin, contentWidth, pageHeight - margin * 2)

  let y = margin

  // 2. Header Section
  const headerHeight = 26
  doc.line(margin, y + headerHeight, margin + contentWidth, y + headerHeight)

  // Left: Company Info
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text('TFIPRO TECHNOLOGIES', margin + 6, y + 8)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(71, 85, 105)
  doc.text('Official Audio Gear & Tech Accessories Store', margin + 6, y + 13)
  doc.text('Support & WhatsApp: +92 321 3314635  |  Web: tfipro.pk', margin + 6, y + 18)
  doc.text('Lahore, Pakistan', margin + 6, y + 23)

  // Right: Document Title & Order ID in clean box
  doc.setLineWidth(0.25)
  doc.rect(margin + contentWidth - 62, y + 3, 58, 20)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10.5)
  doc.setTextColor(15, 23, 42)
  doc.text('PAYMENT RECEIPT', margin + contentWidth - 33, y + 8, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(71, 85, 105)
  doc.text('Order No:', margin + contentWidth - 58, y + 14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text(order.id, margin + contentWidth - 6, y + 14, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(71, 85, 105)
  doc.text('Date:', margin + contentWidth - 58, y + 19)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text(order.date || new Date().toLocaleDateString('en-PK'), margin + contentWidth - 6, y + 19, { align: 'right' })

  y += headerHeight

  // 3. Customer & Order Info Table (2-Column Grid with Center Dividing Line)
  const metaHeight = 36
  const colW = contentWidth / 2

  // Center vertical line
  doc.line(margin + colW, y, margin + colW, y + metaHeight)
  // Bottom horizontal line
  doc.line(margin, y + metaHeight, margin + contentWidth, y + metaHeight)

  // Column 1: Customer Details
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(15, 23, 42)
  doc.text('CUSTOMER & DELIVERY DETAILS', margin + 5, y + 6)
  doc.setLineWidth(0.15)
  doc.line(margin + 5, y + 7.5, margin + colW - 5, y + 7.5)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(71, 85, 105)

  const customerName = `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || 'Valued Customer'
  doc.text('Name:', margin + 5, y + 12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text(customerName, margin + 25, y + 12)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(71, 85, 105)
  doc.text('Phone:', margin + 5, y + 17)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text(order.customer?.phone || 'N/A', margin + 25, y + 17)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(71, 85, 105)
  doc.text('Email/Contact:', margin + 5, y + 22)
  doc.setTextColor(15, 23, 42)
  doc.text(order.customer?.emailOrPhone || 'N/A', margin + 25, y + 22)

  doc.setTextColor(71, 85, 105)
  doc.text('Address:', margin + 5, y + 27)
  doc.setTextColor(15, 23, 42)
  const fullAddress = `${order.customer?.address || ''}${order.customer?.apartment ? ', ' + order.customer.apartment : ''}, ${order.customer?.resolvedCity || order.customer?.customCity || order.customer?.city || 'Pakistan'}, ${order.customer?.province || ''}`
  const addressLines = doc.splitTextToSize(fullAddress, colW - 30)
  doc.text(addressLines, margin + 25, y + 27)

  // Column 2: Dispatch & Payment Details
  const col2X = margin + colW
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(15, 23, 42)
  doc.text('PAYMENT & LOGISTICS DETAILS', col2X + 5, y + 6)
  doc.setLineWidth(0.15)
  doc.line(col2X + 5, y + 7.5, margin + contentWidth - 5, y + 7.5)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(71, 85, 105)

  doc.text('Payment Mode:', col2X + 5, y + 12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text(order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Direct Bank Transfer / Raast', col2X + 32, y + 12)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(71, 85, 105)
  doc.text('Order Status:', col2X + 5, y + 17)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text(order.paymentMethod === 'cod' ? 'Cash Payable on Doorstep' : 'Payment Verified (Processing)', col2X + 32, y + 17)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(71, 85, 105)
  doc.text('Delivery Courier:', col2X + 5, y + 22)
  doc.setTextColor(15, 23, 42)
  doc.text('TCS / Trax Express Logistics', col2X + 32, y + 22)

  doc.setTextColor(71, 85, 105)
  doc.text('Est. Delivery:', col2X + 5, y + 27)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text(order.estimatedDelivery || '3 to 4 business days', col2X + 32, y + 27)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(71, 85, 105)
  doc.text('Tracking Status:', col2X + 5, y + 32)
  doc.setTextColor(15, 23, 42)
  doc.text('Dispatch in Progress', col2X + 32, y + 32)

  y += metaHeight

  // 4. Statement Items Table (Bank Ledger Grid Style)
  const colSr = 12
  const colQty = 18
  const colPrice = 28
  const colTotal = 32
  const colDesc = contentWidth - colSr - colQty - colPrice - colTotal // 92mm

  const xSr = margin
  const xDesc = xSr + colSr
  const xQty = xDesc + colDesc
  const xPrice = xQty + colQty
  const xTotal = xPrice + colPrice

  // Table Header Row
  const thH = 8
  doc.setLineWidth(0.35)
  doc.setFillColor(248, 250, 252) // Very light clean slate-50 (no bright colors)
  doc.rect(margin, y, contentWidth, thH, 'FD')

  // Header dividing lines
  doc.line(xDesc, y, xDesc, y + thH)
  doc.line(xQty, y, xQty, y + thH)
  doc.line(xPrice, y, xPrice, y + thH)
  doc.line(xTotal, y, xTotal, y + thH)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(15, 23, 42)

  doc.text('SR', xSr + colSr / 2, y + 5.5, { align: 'center' })
  doc.text('DESCRIPTION OF GOODS / ARTICLES', xDesc + 4, y + 5.5)
  doc.text('QTY', xQty + colQty / 2, y + 5.5, { align: 'center' })
  doc.text('RATE (RS.)', xPrice + colPrice - 4, y + 5.5, { align: 'right' })
  doc.text('AMOUNT (RS.)', xTotal + colTotal - 4, y + 5.5, { align: 'right' })

  y += thH

  // Items Rows
  const items = order.items || []
  items.forEach((item, index) => {
    const rowH = 9
    doc.setLineWidth(0.2)
    doc.rect(margin, y, contentWidth, rowH)

    // Vertical grid column separators
    doc.line(xDesc, y, xDesc, y + rowH)
    doc.line(xQty, y, xQty, y + rowH)
    doc.line(xPrice, y, xPrice, y + rowH)
    doc.line(xTotal, y, xTotal, y + rowH)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(71, 85, 105)
    doc.text(String(index + 1), xSr + colSr / 2, y + 6, { align: 'center' })

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(15, 23, 42)
    const baseTitle = item.product?.baseTitle || (item.product?.title || 'Product').replace(/\s*\[Color:.*?\]/, '').trim()
    const chosenColor = item.product?.selectedColor || item.selectedColor || item.color || null
    const colorText = chosenColor ? ` (${chosenColor})` : ''
    const titleText = doc.splitTextToSize(baseTitle + colorText, colDesc - 6)
    doc.text(titleText[0] || 'Product', xDesc + 4, y + 6)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(15, 23, 42)
    doc.text(String(item.quantity || 1), xQty + colQty / 2, y + 6, { align: 'center' })

    const price = item.product?.discountedPrice ?? item.product?.actualPrice ?? 0
    doc.text(price.toLocaleString(), xPrice + colPrice - 4, y + 6, { align: 'right' })

    doc.setFont('helvetica', 'bold')
    doc.text((price * (item.quantity || 1)).toLocaleString(), xTotal + colTotal - 4, y + 6, { align: 'right' })

    y += rowH
  })

  // 5. Financial Summary & Notes Section (Grid format)
  const summaryBoxH = 36
  const leftBoxW = contentWidth - colPrice - colTotal // Left notes box width
  const sumColW = colPrice + colTotal // Right summary box width (60mm)

  doc.setLineWidth(0.35)
  doc.rect(margin, y, contentWidth, summaryBoxH)
  doc.line(margin + leftBoxW, y, margin + leftBoxW, y + summaryBoxH)

  // Left side: Delivery notes and declaration
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(15, 23, 42)
  doc.text('DELIVERY INSTRUCTIONS / CUSTOMER NOTES:', margin + 5, y + 6)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(71, 85, 105)

  if (order.customer?.orderNotes) {
    const noteText = doc.splitTextToSize(`"${order.customer.orderNotes}"`, leftBoxW - 10)
    doc.text(noteText, margin + 5, y + 11)
  } else {
    doc.text('• Standard secure delivery. Please inspect parcel before receiving.', margin + 5, y + 11)
    doc.text('• For verification, keep the exact cash amount ready upon arrival.', margin + 5, y + 15)
  }

  doc.setLineWidth(0.15)
  doc.line(margin + 5, y + 21, margin + leftBoxW - 5, y + 21)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(15, 23, 42)
  doc.text('TERMS & WARRANTY:', margin + 5, y + 25)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(71, 85, 105)
  doc.text('Official 7-day checking warranty covers technical manufacturing defects.', margin + 5, y + 29)
  doc.text('Official WhatsApp Support: +92 321 3314635 | Mon-Sat 10 AM - 8 PM', margin + 5, y + 33)

  // Right side: Financial breakdown table
  const rightX = margin + leftBoxW
  let lineY = y + 7

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(71, 85, 105)
  doc.text('Subtotal:', rightX + 5, lineY)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text(`Rs. ${(order.subtotal || 0).toLocaleString()}`, margin + contentWidth - 5, lineY, { align: 'right' })

  if (order.discount > 0) {
    lineY += 6
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(71, 85, 105)
    doc.text(`Discount (${order.couponCode || 'Promo'}):`, rightX + 5, lineY)
    doc.setFont('helvetica', 'bold')
    doc.text(`-Rs. ${(order.discount || 0).toLocaleString()}`, margin + contentWidth - 5, lineY, { align: 'right' })
  }

  lineY += 6
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(71, 85, 105)
  doc.text('Shipping Charges:', rightX + 5, lineY)
  doc.setFont('helvetica', 'bold')
  doc.text(
    order.shippingFee === 0 ? 'FREE' : `Rs. ${(order.shippingFee || 0).toLocaleString()}`,
    margin + contentWidth - 5,
    lineY,
    { align: 'right' }
  )

  // Grand Total Divider
  lineY += 3
  doc.setLineWidth(0.3)
  doc.line(rightX, lineY, margin + contentWidth, lineY)

  lineY += 7
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(15, 23, 42)
  doc.text('TOTAL AMOUNT:', rightX + 5, lineY)
  doc.setFontSize(10.5)
  doc.text(`Rs. ${(order.total || 0).toLocaleString()}`, margin + contentWidth - 5, lineY, { align: 'right' })

  // Double underline below total like accountant statement
  doc.setLineWidth(0.2)
  doc.line(rightX + 5, lineY + 1.5, margin + contentWidth - 5, lineY + 1.5)
  doc.line(rightX + 5, lineY + 2.5, margin + contentWidth - 5, lineY + 2.5)

  y += summaryBoxH

  // 6. Signatures & Declaration Footer
  y += 12
  const sigBoxW = contentWidth / 2

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(100, 116, 139)
  doc.text('This is a computer-generated tax invoice and requires no physical signature.', margin + 5, y + 4)
  doc.text('All goods dispatched remain property of TFiPro until fully settled.', margin + 5, y + 8)

  // Signature line on right
  const sigX = margin + contentWidth - 65
  doc.setDrawColor(71, 85, 105)
  doc.setLineWidth(0.25)
  doc.line(sigX, y + 4, sigX + 60, y + 4)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(15, 23, 42)
  doc.text('Authorized Signature / Store Stamp', sigX + 30, y + 9, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(100, 116, 139)
  doc.text('TFiPro Technologies (PVT) Ltd.', sigX + 30, y + 13, { align: 'center' })

  // Trigger file download
  doc.save(`TFiPro-Receipt-${order.id}.pdf`)
}
