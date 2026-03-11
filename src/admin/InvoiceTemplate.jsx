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
} from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

const InvoiceTemplate = ({ order, rank, onClose }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    const toastId = toast.loading('Generating PDF...');
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Brand Header
      doc.setFontSize(24);
      doc.setTextColor(220, 38, 38); // red-600
      doc.setFont(undefined, 'bold');
      doc.text('DHEERAN CRACKERS', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128); // gray-500
      doc.setFont(undefined, 'normal');
      doc.text(
        'High Quality Crackers & Fireworks for all your celebrations.',
        14,
        26
      );

      doc.text('+91 98765 43210', 14, 34);
      doc.text('contact@dheerancrackers.com', 14, 40);
      doc.text('Sivakasi, Tamil Nadu', 14, 46);

      // Invoice Details (Right Aligned)
      doc.setFontSize(24);
      doc.setTextColor(229, 231, 235); // gray-200
      doc.setFont(undefined, 'bold');
      doc.text('INVOICE', pageWidth - 14, 20, { align: 'right' });

      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99); // gray-600
      doc.setFont(undefined, 'bold');
      doc.text('Invoice No:', pageWidth - 50, 30);
      doc.setFont(undefined, 'normal');
      doc.text(`INV-${rank}`, pageWidth - 14, 30, { align: 'right' });

      doc.setFont(undefined, 'bold');
      doc.text('Date:', pageWidth - 50, 36);
      doc.setFont(undefined, 'normal');
      const dateStr = order.orderDate?.toDate
        ? format(order.orderDate.toDate(), 'dd MMM, yyyy')
        : 'N/A';
      doc.text(dateStr, pageWidth - 14, 36, { align: 'right' });

      doc.setFont(undefined, 'bold');
      doc.text('Amount Due:', pageWidth - 50, 46);
      doc.setTextColor(220, 38, 38); // red-600
      doc.text(`Rs. ${order.total?.toLocaleString()}`, pageWidth - 14, 46, {
        align: 'right',
      });

      // Line Separator
      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(0.5);
      doc.line(14, 52, pageWidth - 14, 52);

      // Bill To & Ship To
      doc.setFontSize(10);
      doc.setTextColor(156, 163, 175); // gray-400
      doc.setFont(undefined, 'bold');
      doc.text('BILL TO:', 14, 62);
      doc.text('SHIP TO:', pageWidth / 2, 62);

      doc.setTextColor(31, 41, 55); // gray-800
      doc.setFontSize(12);
      doc.text(order.customer?.name || 'N/A', 14, 68);

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(75, 85, 99); // gray-600
      doc.text(`Phone: ${order.customer?.phone || 'N/A'}`, 14, 74);

      doc.text(order.customer?.address || 'N/A', pageWidth / 2, 68);
      doc.text(
        `${order.customer?.city || ''} - ${order.customer?.pincode || ''}`,
        pageWidth / 2,
        74
      );

      // Table
      const tableColumn = ['#', 'Item Description', 'Price', 'Qty', 'Total'];
      const tableRows = (order.products || []).map((p, index) => [
        index + 1,
        p.name,
        `Rs. ${p.price?.toLocaleString()}`,
        p.qty,
        `Rs. ${(p.price * p.qty).toLocaleString()}`,
      ]);

      autoTable(doc, {
        startY: 85,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: {
          fillColor: [31, 41, 55], // gray-800
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        styles: {
          fontSize: 9,
          textColor: [55, 65, 81], // gray-700
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251], // gray-50
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          2: { cellWidth: 30, halign: 'center' },
          3: { cellWidth: 20, halign: 'center' },
          4: {
            cellWidth: 30,
            halign: 'right',
            fontStyle: 'bold',
            textColor: [31, 41, 55],
          },
        },
      });

      // Totals
      const finalY = doc.lastAutoTable.finalY + 10;

      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99);
      doc.text('Subtotal:', pageWidth - 60, finalY);
      doc.setTextColor(31, 41, 55);
      doc.text(`Rs. ${order.total?.toLocaleString()}`, pageWidth - 14, finalY, {
        align: 'right',
      });

      doc.setDrawColor(229, 231, 235);
      doc.line(pageWidth - 60, finalY + 4, pageWidth - 14, finalY + 4);

      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text('Grand Total:', pageWidth - 60, finalY + 12);

      doc.setTextColor(220, 38, 38);
      doc.text(
        `Rs. ${order.total?.toLocaleString()}`,
        pageWidth - 14,
        finalY + 12,
        { align: 'right' }
      );

      // Footer
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.setFont(undefined, 'bold');
      doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 20, {
        align: 'center',
      });

      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(156, 163, 175);
      doc.text(
        'If you have any questions about this invoice, please contact us.',
        pageWidth / 2,
        pageHeight - 15,
        { align: 'center' }
      );

      // Save PDF
      doc.save(`Invoice_${rank}_${order.id.slice(-6)}.pdf`);
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
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl flex flex-col max-h-full overflow-hidden">
        {/* Header Actions */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            Invoice Preview
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              <Download
                size={16}
                className={downloading ? 'animate-bounce' : ''}
              />
              {downloading ? 'Downloading...' : 'Download PDF'}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Printable Area (VISUAL PREVIEW ONLY) */}
        <div className="overflow-y-auto p-4 sm:p-8 custom-scrollbar bg-gray-100 flex-1">
          <div
            className="bg-white mx-auto shadow-sm"
            style={{
              width: '210mm',
              minHeight: '297mm',
              padding: '40px',
              boxSizing: 'border-box',
            }}
          >
            {/* Invoice Top */}
            <div className="flex justify-between items-start border-b-2 border-red-600 pb-8 mb-8">
              <div>
                <h1 className="text-4xl font-black text-red-600 tracking-tight uppercase">
                  Dheeran Crackers
                </h1>
                <p className="text-gray-500 mt-2 text-sm max-w-xs">
                  High Quality Crackers & Fireworks for all your celebrations.
                </p>
                <div className="mt-4 flex flex-col gap-1 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <Phone size={14} className="text-red-500" /> +91 98765 43210
                  </span>
                  <span className="flex items-center gap-2">
                    <Mail size={14} className="text-red-500" />{' '}
                    contact@dheerancrackers.com
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin size={14} className="text-red-500" /> Sivakasi,
                    Tamil Nadu
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-gray-200 uppercase mb-2">
                  Invoice
                </div>
                <div className="inline-block bg-gray-50 p-4 rounded-lg border border-gray-100 text-left min-w-[200px]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                      <Hash size={12} /> Invoice No:
                    </span>
                    <span className="font-bold text-gray-800">INV-{rank}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                      <Calendar size={12} /> Date:
                    </span>
                    <span className="text-gray-800 font-medium">
                      {order.orderDate?.toDate
                        ? format(order.orderDate.toDate(), 'dd MMM, yyyy')
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                    <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                      Amount Due:
                    </span>
                    <span className="font-bold text-red-600 text-lg">
                      ₹{order.total?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bill To & Ship To */}
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Bill To
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 h-full">
                  <h4 className="text-lg font-bold text-gray-800 mb-1">
                    {order.customer?.name}
                  </h4>
                  <div className="text-sm text-gray-600 flex flex-col gap-1 mt-3">
                    <span className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />{' '}
                      {order.customer?.phone || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Ship To
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 h-full">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <Truck size={16} className="text-gray-500" /> Shipping
                    Address
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {order.customer?.address}
                    <br />
                    {order.customer?.city}
                    {order.customer?.pincode
                      ? ` - ${order.customer?.pincode}`
                      : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8 rounded-lg overflow-hidden border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-800 text-white text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold w-12 text-center">
                      #
                    </th>
                    <th className="py-3 px-4 font-semibold">
                      Item Description
                    </th>
                    <th className="py-3 px-4 font-semibold text-center w-24">
                      Price
                    </th>
                    <th className="py-3 px-4 font-semibold text-center w-24">
                      Qty
                    </th>
                    <th className="py-3 px-4 font-semibold text-right w-32">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {order.products?.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-center text-gray-500 font-medium">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-800 block">
                          {item.name}
                        </span>
                        {item.category && (
                          <span className="text-xs text-gray-500">
                            {item.category}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600">
                        ₹{item.price?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                          {item.qty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-800">
                        ₹{(item.price * item.qty).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {(!order.products || order.products.length === 0) && (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-8 text-center text-gray-500 italic"
                      >
                        No items found for this order.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-12">
              <div className="w-1/2 md:w-1/3">
                <div className="flex justify-between py-2 text-sm text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-medium text-gray-800">
                    ₹{order.total?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-sm text-gray-600 border-b border-gray-200">
                  <span>Discount:</span>
                  <span className="font-medium text-gray-800">₹0</span>
                </div>
                <div className="flex justify-between py-4">
                  <span className="text-lg font-bold text-gray-800">
                    Grand Total:
                  </span>
                  <span className="text-xl font-bold text-red-600">
                    ₹{order.total?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-500 text-sm font-medium">
                Thank you for your business!
              </p>
              <p className="text-gray-400 text-xs mt-1">
                If you have any questions about this invoice, please contact us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
