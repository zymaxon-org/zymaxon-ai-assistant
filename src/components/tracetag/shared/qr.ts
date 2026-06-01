import QRCode from 'qrcode';
import jsPDF from 'jspdf';

export const itemPublicUrl = (assetId: string) =>
  `${window.location.origin}/tracetag/item/${assetId}`;

export async function generateQRDataUrl(assetId: string): Promise<string> {
  return QRCode.toDataURL(itemPublicUrl(assetId), {
    width: 512, margin: 1, color: { dark: '#1A3C6E', light: '#FFFFFF' },
  });
}

export async function downloadQR(assetId: string) {
  const dataUrl = await generateQRDataUrl(assetId);
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `${assetId}.png`;
  a.click();
}

export async function downloadCertificate(opts: {
  ownerName: string; assetId: string; itemName: string;
  brand?: string | null; model?: string | null;
  serial?: string | null; identifier?: string | null;
  registeredAt: string;
}) {
  const qrDataUrl = await generateQRDataUrl(opts.assetId);
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Navy border
  doc.setDrawColor(26, 60, 110);
  doc.setLineWidth(6);
  doc.rect(20, 20, w - 40, h - 40);
  doc.setLineWidth(1);
  doc.rect(32, 32, w - 64, h - 64);

  // Header
  doc.setFillColor(26, 60, 110);
  doc.rect(32, 32, w - 64, 70, 'F');
  doc.setTextColor(255);
  doc.setFont('helvetica','bold');
  doc.setFontSize(22);
  doc.text('TRACETAG NIGERIA', w/2, 70, { align: 'center' });
  doc.setFontSize(11);
  doc.setFont('helvetica','normal');
  doc.text('National Item Registry · tracetag.ng', w/2, 90, { align: 'center' });

  // Title
  doc.setTextColor(26, 60, 110);
  doc.setFont('helvetica','bold');
  doc.setFontSize(20);
  doc.text('CERTIFICATE OF REGISTRATION', w/2, 150, { align: 'center' });

  // Body
  doc.setTextColor(40);
  doc.setFont('helvetica','normal');
  doc.setFontSize(12);
  doc.text('This certifies that the following item is officially registered', w/2, 180, { align: 'center' });
  doc.text('in the TraceTag Nigeria National Item Registry.', w/2, 198, { align: 'center' });

  // Details
  let y = 250;
  const row = (label: string, value: string) => {
    doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(100);
    doc.text(label.toUpperCase(), 70, y);
    doc.setFont('helvetica','normal'); doc.setFontSize(13); doc.setTextColor(20);
    doc.text(value || '—', 70, y + 18);
    y += 50;
  };
  row('Owner', opts.ownerName);
  row('Item', `${opts.itemName}${opts.brand ? ` · ${opts.brand}` : ''}${opts.model ? ` ${opts.model}` : ''}`);
  row('TraceTag Asset ID', opts.assetId);
  row('Unique Identifier', opts.identifier || opts.serial || '—');
  row('Registration Date', new Date(opts.registeredAt).toLocaleDateString('en-NG', { dateStyle: 'long' }));

  // QR
  doc.addImage(qrDataUrl, 'PNG', w - 180, 240, 110, 110);
  doc.setFontSize(8); doc.setTextColor(100);
  doc.text('Scan to verify', w - 125, 360, { align: 'center' });

  // Footer
  doc.setDrawColor(26, 60, 110);
  doc.line(70, h - 110, w - 70, h - 110);
  doc.setFontSize(10); doc.setTextColor(80);
  doc.text('Issued by TraceTag Nigeria Platform', w/2, h - 90, { align: 'center' });
  doc.setFontSize(9); doc.setTextColor(120);
  doc.text(`Verify at ${itemPublicUrl(opts.assetId)}`, w/2, h - 72, { align: 'center' });

  doc.save(`tracetag-${opts.assetId}.pdf`);
}
