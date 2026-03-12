import React, { useState } from 'react';
import {
  X,
  Download,
  Truck,
  Calendar,
  Hash,
  Mail,
  Phone,
  MapPin,
  Printer,
} from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

const InvoiceTemplate = ({ order, rank, onClose }) => {
  const [downloading, setDownloading] = useState(false);

  const invoiceNo = `INV-${String(rank).padStart(4, '0')}`;
  const dateStr = order.orderDate?.toDate
    ? format(order.orderDate.toDate(), 'dd MMM, yyyy')
    : 'N/A';
  const subtotal = (order.products || []).reduce(
    (sum, p) => sum + p.price * p.qty,
    0
  );

  const handleDownload = async () => {
    setDownloading(true);
    const toastId = toast.loading('Generating PDF...');
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Top blue bar
      doc.setFillColor(0, 101, 179);
      doc.rect(0, 0, pageWidth, 4, 'F');

      // Company Header
      doc.setFontSize(20);
      doc.setTextColor(0, 101, 179);
      doc.setFont(undefined, 'bold');
      doc.text('DHEERAN CRACKERS', 14, 22);

      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.setFont(undefined, 'normal');
      doc.text('Sivakasi, Tamil Nadu', 14, 28);
      doc.text('Phone: +91 98765 43210', 14, 33);
      doc.text('Email: contact@dheerancrackers.com', 14, 38);

      // INVOICE title right
      doc.setFontSize(28);
      doc.setTextColor(0, 101, 179);
      doc.setFont(undefined, 'bold');
      doc.text('INVOICE', pageWidth - 14, 22, { align: 'right' });

      // Invoice meta right
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.setFont(undefined, 'normal');
      doc.text(`Invoice #: ${invoiceNo}`, pageWidth - 14, 30, {
        align: 'right',
      });
      doc.text(`Date: ${dateStr}`, pageWidth - 14, 35, { align: 'right' });
      doc.text(
        `Status: ${order.paymentStatus || 'Pending'}`,
        pageWidth - 14,
        40,
        { align: 'right' }
      );

      // Separator
      doc.setDrawColor(0, 101, 179);
      doc.setLineWidth(0.6);
      doc.line(14, 44, pageWidth - 14, 44);

      // Bill To & Ship To
      const leftX = 14;
      const rightX = pageWidth / 2 + 10;

      doc.setFontSize(8);
      doc.setTextColor(0, 101, 179);
      doc.setFont(undefined, 'bold');
      doc.text('BILL TO', leftX, 52);
      doc.text('SHIP TO', rightX, 52);

      doc.setFontSize(11);
      doc.setTextColor(33, 33, 33);
      doc.text(order.customer?.name || 'N/A', leftX, 58);

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.setFont(undefined, 'normal');
      doc.text(`Phone: ${order.customer?.phone || 'N/A'}`, leftX, 64);

      doc.setFontSize(9);
      doc.setTextColor(33, 33, 33);
      doc.setFont(undefined, 'normal');
      doc.text(order.customer?.address || 'N/A', rightX, 58);
      doc.text(
        `${order.customer?.city || ''} - ${order.customer?.pincode || ''}`,
        rightX,
        64
      );
      doc.text(`Phone: ${order.customer?.phone || 'N/A'}`, rightX, 70);

      // Items Table
      const tableColumn = ['#', 'Item & Description', 'Rate', 'Qty', 'Amount'];
      const tableRows = (order.products || []).map((p, index) => [
        index + 1,
        p.name,
        `Rs. ${p.price?.toLocaleString()}`,
        p.qty,
        `Rs. ${(p.price * p.qty).toLocaleString()}`,
      ]);

      autoTable(doc, {
        startY: 78,
        head: [tableColumn],
        body: tableRows,
        theme: 'plain',
        headStyles: {
          fillColor: [240, 246, 252],
          textColor: [0, 101, 179],
          fontStyle: 'bold',
          fontSize: 8.5,
          cellPadding: 4,
        },
        styles: {
          fontSize: 9,
          textColor: [55, 65, 81],
          cellPadding: 4,
          lineColor: [230, 230, 230],
          lineWidth: 0.3,
        },
        alternateRowStyles: {
          fillColor: [250, 251, 252],
        },
        columnStyles: {
          0: { cellWidth: 12, halign: 'center' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 30, halign: 'right' },
          3: { cellWidth: 18, halign: 'center' },
          4: {
            cellWidth: 34,
            halign: 'right',
            fontStyle: 'bold',
            textColor: [33, 33, 33],
          },
        },
      });

      // Totals
      const finalY = doc.lastAutoTable.finalY + 8;
      const totalsX = pageWidth - 80;

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.setFont(undefined, 'normal');
      doc.text('Sub Total', totalsX, finalY);
      doc.setTextColor(33, 33, 33);
      doc.text(`Rs. ${subtotal.toLocaleString()}`, pageWidth - 14, finalY, {
        align: 'right',
      });

      doc.setDrawColor(230, 230, 230);
      doc.line(totalsX, finalY + 3, pageWidth - 14, finalY + 3);

      doc.setTextColor(100, 100, 100);
      doc.text('Discount', totalsX, finalY + 9);
      doc.setTextColor(33, 33, 33);
      doc.text('Rs. 0', pageWidth - 14, finalY + 9, { align: 'right' });

      doc.line(totalsX, finalY + 12, pageWidth - 14, finalY + 12);

      // Total Due
      doc.setFillColor(0, 101, 179);
      doc.roundedRect(
        totalsX - 4,
        finalY + 15,
        pageWidth - totalsX + 4 - 10,
        12,
        1.5,
        1.5,
        'F'
      );
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.setFont(undefined, 'bold');
      doc.text('Total', totalsX, finalY + 23);
      doc.text(
        `Rs. ${order.total?.toLocaleString()}`,
        pageWidth - 14,
        finalY + 23,
        { align: 'right' }
      );

      // Notes & Terms
      const notesY = finalY + 40;
      doc.setFontSize(8);
      doc.setTextColor(0, 101, 179);
      doc.setFont(undefined, 'bold');
      doc.text('NOTES', 14, notesY);
      doc.setTextColor(120, 120, 120);
      doc.setFont(undefined, 'normal');
      doc.text('Thank you for choosing Dheeran Crackers!', 14, notesY + 5);

      doc.setTextColor(0, 101, 179);
      doc.setFont(undefined, 'bold');
      doc.text('TERMS & CONDITIONS', 14, notesY + 14);
      doc.setTextColor(120, 120, 120);
      doc.setFont(undefined, 'normal');
      doc.text(
        'All sales are final. Handle fireworks with care and follow safety guidelines.',
        14,
        notesY + 19
      );

      // Footer
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setDrawColor(0, 101, 179);
      doc.setLineWidth(0.4);
      doc.line(14, pageHeight - 18, pageWidth - 14, pageHeight - 18);

      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.setFont(undefined, 'normal');
      doc.text(
        'Dheeran Crackers | Sivakasi, Tamil Nadu | +91 98765 43210',
        pageWidth / 2,
        pageHeight - 12,
        { align: 'center' }
      );

      doc.save(`Invoice_${invoiceNo}_${order.id.slice(-6)}.pdf`);
      toast.success('Downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF', { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl flex flex-col max-h-full overflow-hidden">
        {/* Header Bar — Zoho Books style */}
        <div className="flex justify-between items-center px-6 py-3 border-b border-[#e4e7ec] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#0065b3] flex items-center justify-center">
              <Hash size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-[#1a1a2e]">
                {invoiceNo}
              </h2>
              <p className="text-[11px] text-[#7c8db5]">{dateStr}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-[#0065b3] text-white rounded text-[13px] font-medium hover:bg-[#005299] transition-colors disabled:opacity-70"
            >
              <Download
                size={14}
                className={downloading ? 'animate-bounce' : ''}
              />
              {downloading ? 'Generating...' : 'Download PDF'}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#7c8db5] hover:text-[#1a1a2e] hover:bg-[#f4f5f7] rounded transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="overflow-y-auto flex-1 bg-[#f0f3f8] p-6 sm:p-8">
          <div
            className="bg-white mx-auto rounded shadow-sm"
            style={{
              width: '210mm',
              minHeight: '297mm',
              padding: '48px',
              boxSizing: 'border-box',
            }}
          >
            {/* Top Blue Accent Bar */}
            <div className="w-full h-1 bg-[#0065b3] rounded-full mb-8" />

            {/* Header — Company + Invoice */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-[28px] font-bold text-[#0065b3] tracking-tight">
                  Dheeran Crackers
                </h1>
                <div className="mt-3 flex flex-col gap-1 text-[13px] text-[#6b7b94]">
                  <span className="flex items-center gap-2">
                    <MapPin size={13} className="text-[#0065b3]" />
                    Sivakasi, Tamil Nadu
                  </span>
                  <span className="flex items-center gap-2">
                    <Phone size={13} className="text-[#0065b3]" />
                    +91 98765 43210
                  </span>
                  <span className="flex items-center gap-2">
                    <Mail size={13} className="text-[#0065b3]" />
                    contact@dheerancrackers.com
                  </span>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-[32px] font-bold text-[#0065b3] tracking-tight">
                  INVOICE
                </h2>
                <div className="mt-3 space-y-1.5 text-[13px]">
                  <div className="flex justify-end gap-4">
                    <span className="text-[#6b7b94]">Invoice #</span>
                    <span className="font-semibold text-[#1a1a2e] min-w-[100px] text-right">
                      {invoiceNo}
                    </span>
                  </div>
                  <div className="flex justify-end gap-4">
                    <span className="text-[#6b7b94]">Date</span>
                    <span className="font-medium text-[#1a1a2e] min-w-[100px] text-right">
                      {dateStr}
                    </span>
                  </div>
                  <div className="flex justify-end gap-4">
                    <span className="text-[#6b7b94]">Status</span>
                    <span
                      className={`min-w-[100px] text-right font-semibold text-[13px] ${
                        order.paymentStatus === 'Paid'
                          ? 'text-[#14a364]'
                          : order.paymentStatus === 'Online Payment'
                            ? 'text-[#0065b3]'
                            : 'text-[#e8590c]'
                      }`}
                    >
                      {order.paymentStatus || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-b border-[#e4e7ec] mb-8" />

            {/* Bill To & Ship To */}
            <div className="grid grid-cols-2 gap-10 mb-10">
              <div>
                <h3 className="text-[11px] font-bold text-[#0065b3] uppercase tracking-widest mb-3">
                  Bill To
                </h3>
                <h4 className="text-[16px] font-semibold text-[#1a1a2e] mb-1">
                  {order.customer?.name}
                </h4>
                <div className="text-[13px] text-[#6b7b94] flex flex-col gap-0.5 mt-1">
                  <span>{order.customer?.phone || 'N/A'}</span>
                </div>
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-[#0065b3] uppercase tracking-widest mb-3">
                  Ship To
                </h3>
                <p className="text-[13px] text-[#1a1a2e] leading-relaxed">
                  {order.customer?.address}
                </p>
                <p className="text-[13px] text-[#6b7b94] mt-0.5">
                  {order.customer?.city}
                  {order.customer?.pincode && ` - ${order.customer?.pincode}`}
                </p>
                <p className="text-[13px] text-[#6b7b94] mt-0.5">
                  {order.customer?.phone}
                </p>
              </div>
            </div>

            {/* Items Table — Zoho Books style */}
            <div className="mb-8">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f0f5fa] border-b-2 border-[#0065b3]">
                    <th className="py-3 px-4 text-[11px] font-bold text-[#0065b3] uppercase tracking-wider w-12 text-center">
                      #
                    </th>
                    <th className="py-3 px-4 text-[11px] font-bold text-[#0065b3] uppercase tracking-wider">
                      Item & Description
                    </th>
                    <th className="py-3 px-4 text-[11px] font-bold text-[#0065b3] uppercase tracking-wider text-right w-28">
                      Rate
                    </th>
                    <th className="py-3 px-4 text-[11px] font-bold text-[#0065b3] uppercase tracking-wider text-center w-20">
                      Qty
                    </th>
                    <th className="py-3 px-4 text-[11px] font-bold text-[#0065b3] uppercase tracking-wider text-right w-32">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {order.products?.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-[#eef1f6] hover:bg-[#fafbfd] transition-colors"
                    >
                      <td className="py-3.5 px-4 text-center text-[#7c8db5]">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-[#1a1a2e]">
                          {item.name}
                        </span>
                        {item.category && (
                          <span className="block text-[11px] text-[#7c8db5] mt-0.5">
                            {item.category}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#3d4f6f]">
                        ₹{item.price?.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center text-[#3d4f6f] font-medium">
                        {item.qty}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-[#1a1a2e]">
                        ₹{(item.price * item.qty).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {(!order.products || order.products.length === 0) && (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-10 text-center text-[#7c8db5] italic"
                      >
                        No items in this invoice.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals — Zoho Books right-aligned box */}
            <div className="flex justify-end mb-10">
              <div className="w-[280px]">
                <div className="flex justify-between py-2 text-[13px]">
                  <span className="text-[#6b7b94]">Sub Total</span>
                  <span className="font-medium text-[#1a1a2e]">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-[13px] border-b border-[#eef1f6]">
                  <span className="text-[#6b7b94]">Discount</span>
                  <span className="font-medium text-[#1a1a2e]">₹0</span>
                </div>
                <div className="flex justify-between items-center py-3 mt-1 bg-[#0065b3] rounded-md px-4 -mx-4">
                  <span className="text-[15px] font-bold text-white">
                    Total
                  </span>
                  <span className="text-[18px] font-bold text-white">
                    ₹{order.total?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 mt-2 text-[13px]">
                  <span className="text-[#6b7b94]">Balance Due</span>
                  <span className="font-bold text-[#0065b3] text-[15px]">
                    ₹
                    {order.paymentStatus === 'Paid'
                      ? '0'
                      : order.total?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes & Terms */}
            <div className="grid grid-cols-2 gap-10 mt-8 pt-6 border-t border-[#eef1f6]">
              <div>
                <h3 className="text-[11px] font-bold text-[#0065b3] uppercase tracking-widest mb-2">
                  Notes
                </h3>
                <p className="text-[12px] text-[#6b7b94] leading-relaxed">
                  Thank you for choosing Dheeran Crackers! We hope you enjoy
                  your celebrations.
                </p>
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-[#0065b3] uppercase tracking-widest mb-2">
                  Terms & Conditions
                </h3>
                <p className="text-[12px] text-[#6b7b94] leading-relaxed">
                  All sales are final. Handle fireworks with care and follow all
                  safety guidelines.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-10 border-t border-[#eef1f6] text-center mt-12">
              <p className="text-[12px] text-[#7c8db5]">
                Dheeran Crackers &middot; Sivakasi, Tamil Nadu &middot; +91
                98765 43210
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
