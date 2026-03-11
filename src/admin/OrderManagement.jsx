import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { format } from 'date-fns';
import {
  X,
  Search,
  Trash2,
  Eye,
  Calendar,
  RefreshCcw,
  Download,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  Banknote,
  FileText,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';
import InvoiceTemplate from './InvoiceTemplate';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      let constraints = [];
      if (startDate) {
        const s = new Date(startDate);
        s.setHours(0, 0, 0, 0);
        constraints.push(where('orderDate', '>=', Timestamp.fromDate(s)));
      }
      if (endDate) {
        const e = new Date(endDate);
        e.setHours(23, 59, 59, 999);
        constraints.push(where('orderDate', '<=', Timestamp.fromDate(e)));
      }
      constraints.push(orderBy('orderDate', 'desc'));
      const q = query(collection(db, 'orders'), ...constraints);
      const snap = await getDocs(q);
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, [startDate, endDate]);

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdating(orderId);
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { paymentStatus: newStatus });
      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, paymentStatus: newStatus } : o
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status.');
    }
    setStatusUpdating(null);
  };

  const rankMap = {};
  orders.forEach((o, i) => (rankMap[o.id] = i + 1));

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customer?.name?.toLowerCase().includes(q) ||
      o.customer?.phone?.includes(q) ||
      o.customer?.city?.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id) => {
    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span className="text-sm">Delete this order?</span>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await deleteDoc(doc(db, 'orders', id));
              toast.success('Order deleted');
              loadOrders();
            }}
            className="px-3 py-1 bg-red-500 text-white rounded text-xs font-medium"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 rounded text-xs font-medium"
          >
            Cancel
          </button>
        </div>
      ),
      { duration: 10000 }
    );
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'bg-amber-500/10',
          text: 'text-amber-500',
          border: 'border-amber-500/20',
          icon: Clock,
          label: 'Pending',
        };
      case 'Paid':
        return {
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-500',
          border: 'border-emerald-500/20',
          icon: CheckCircle2,
          label: 'Paid',
        };
      case 'Online Payment':
        return {
          bg: 'bg-blue-500/10',
          text: 'text-blue-500',
          border: 'border-blue-500/20',
          icon: Banknote,
          label: 'Online',
        };
      case 'Cash Payment':
        return {
          bg: 'bg-purple-500/10',
          text: 'text-purple-500',
          border: 'border-purple-500/20',
          icon: Banknote,
          label: 'Cash',
        };
      default:
        return {
          bg: 'bg-slate-500/10',
          text: 'text-slate-500',
          border: 'border-slate-500/20',
          icon: Clock,
          label: status,
        };
    }
  };

  const handleDownloadPDF = (order) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(220, 38, 38);
      doc.text('DHEERAN CRACKERS', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Invoice: ORD-${rankMap[order.id]}`, 14, 30);
      const dateStr = order.orderDate?.toDate
        ? format(order.orderDate.toDate(), 'dd-MM-yyyy')
        : 'N/A';
      doc.text(`Date: ${dateStr}`, 14, 35);

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Bill To:', 14, 50);
      doc.setFontSize(10);
      doc.text(`${order.customer?.name || 'N/A'}`, 14, 58);
      doc.text(`${order.customer?.phone || ''}`, 14, 64);
      doc.text(
        `${order.customer?.address || ''}, ${order.customer?.city || ''}`,
        14,
        70
      );

      const tableColumn = ['Product', 'Price', 'Qty', 'Total'];
      const tableRows = (order.products || []).map((p) => [
        p.name,
        `Rs. ${p.price}`,
        p.qty,
        `Rs. ${p.price * p.qty}`,
      ]);

      autoTable(doc, {
        startY: 80,
        head: [tableColumn],
        body: tableRows,
        headStyles: { fillColor: [220, 38, 38] },
        theme: 'grid',
      });

      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(`Grand Total: Rs. ${order.total?.toLocaleString()}`, 14, finalY);

      doc.save(`Invoice_${rankMap[order.id]}.pdf`);
    } catch (error) {
      console.error('PDF Error:', error);
      toast.error('Error generating PDF');
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#172b4d]">Orders</h1>
          <p className="text-[13px] text-[#6b778c] mt-0.5">
            {orders.length} total orders
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#dfe1e6] rounded text-[13px] font-medium text-[#42526e] hover:bg-[#f4f5f7] transition-colors"
        >
          <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-[#dfe1e6] p-3 flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a5adba]"
          />
          <input
            placeholder="Search by Order ID, Name, City..."
            className="w-full pl-9 pr-3 py-2 text-[13px] bg-[#fafbfc] border border-[#dfe1e6] rounded text-[#172b4d] placeholder-[#a5adba] outline-none focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/20 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center bg-[#fafbfc] border border-[#dfe1e6] rounded px-3 gap-2">
            <Calendar size={14} className="text-[#a5adba] shrink-0" />
            <input
              type="date"
              className="bg-transparent py-2 outline-none text-[13px] text-[#42526e]"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex items-center bg-[#fafbfc] border border-[#dfe1e6] rounded px-3 gap-2">
            <Calendar size={14} className="text-[#a5adba] shrink-0" />
            <input
              type="date"
              className="bg-transparent py-2 outline-none text-[13px] text-[#42526e]"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setSearch('');
              setStartDate('');
              setEndDate('');
            }}
            className="px-4 py-2 bg-[#f4f5f7] border border-[#dfe1e6] rounded text-[13px] font-medium text-[#42526e] hover:bg-[#ebecf0] transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#0078d4] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[13px] text-[#6b778c]">Loading orders...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-lg border border-[#dfe1e6] flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 bg-[#f4f5f7] rounded-full flex items-center justify-center mb-3">
            <ShoppingBag size={24} className="text-[#a5adba]" />
          </div>
          <h3 className="text-[15px] font-semibold text-[#172b4d] mb-1">
            No orders found
          </h3>
          <p className="text-[13px] text-[#6b778c]">
            Try adjusting your filters
          </p>
        </div>
      )}

      {/* Orders Table */}
      {!loading && filtered.length > 0 && (
        <div className="bg-white rounded-lg border border-[#dfe1e6] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#fafbfc] text-[11px] font-semibold text-[#6b778c] uppercase tracking-wide border-b border-[#dfe1e6]">
                <tr>
                  <th className="px-5 py-3">#</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Items</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f5f7]">
                {filtered.map((o) => {
                  const status = getStatusConfig(o.paymentStatus);
                  return (
                    <tr
                      key={o.id}
                      className="hover:bg-[#fafbfc] transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(o)}
                    >
                      <td className="px-5 py-3">
                        <span className="text-[12px] font-mono text-[#6b778c]">
                          #{rankMap[o.id]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[13px] font-medium text-[#172b4d]">
                          {o.customer?.name}
                        </p>
                        <p className="text-[11px] text-[#a5adba] flex items-center gap-1 mt-0.5">
                          <Truck size={10} /> {o.customer?.city || 'Unknown'}
                        </p>
                      </td>
                      <td
                        className="px-4 py-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={o.paymentStatus || 'Pending'}
                          onChange={(e) =>
                            handleStatusChange(o.id, e.target.value)
                          }
                          disabled={statusUpdating === o.id}
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded border outline-none cursor-pointer appearance-none text-center ${
                            o.paymentStatus === 'Paid'
                              ? 'bg-[#e3fcef] text-[#006644] border-[#abf5d1]'
                              : o.paymentStatus === 'Online Payment'
                                ? 'bg-[#deebff] text-[#0052cc] border-[#b3d4ff]'
                                : o.paymentStatus === 'Cash Payment'
                                  ? 'bg-[#eae6ff] text-[#403294] border-[#c0b6f2]'
                                  : 'bg-[#fff0b3] text-[#974f0c] border-[#ffe380]'
                          } ${statusUpdating === o.id ? 'opacity-50' : ''}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Online Payment">Online</option>
                          <option value="Cash Payment">Cash</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-[12px] text-[#6b778c]">
                          {o.products?.length || 0} items
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-[13px] font-semibold text-[#172b4d]">
                          ₹{o.total?.toLocaleString()}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="p-1.5 rounded hover:bg-[#e9f2ff] text-[#6b778c] hover:text-[#0078d4] transition-colors"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setInvoiceOrder(o)}
                            className="p-1.5 rounded hover:bg-[#eae6ff] text-[#6b778c] hover:text-[#403294] transition-colors"
                            title="Invoice"
                          >
                            <FileText size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(o.id)}
                            className="p-1.5 rounded hover:bg-[#ffebe6] text-[#6b778c] hover:text-[#de350b] transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#fafbfc] px-6 py-4 border-b border-[#dfe1e6] flex justify-between items-start shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono text-[#6b778c] bg-[#f4f5f7] px-2 py-0.5 rounded border border-[#dfe1e6]">
                    ORDER #{rankMap[selectedOrder.id]}
                  </span>
                  <span className="text-[11px] text-[#a5adba]">
                    {selectedOrder.orderDate?.toDate
                      ? format(
                          selectedOrder.orderDate.toDate(),
                          'hh:mm a, dd MMM yyyy'
                        )
                      : ''}
                  </span>
                </div>
                <h2 className="text-[17px] font-semibold text-[#172b4d]">
                  {selectedOrder.customer?.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded hover:bg-[#dfe1e6] text-[#6b778c] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-5 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <h4 className="text-[11px] font-semibold text-[#6b778c] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Truck size={12} /> Shipping
                  </h4>
                  <div className="bg-[#fafbfc] rounded border border-[#dfe1e6] p-3">
                    <p className="text-[13px] text-[#172b4d]">
                      {selectedOrder.customer?.address}
                    </p>
                    <p className="text-[12px] text-[#6b778c] mt-1">
                      {selectedOrder.customer?.city} -{' '}
                      {selectedOrder.customer?.pincode}
                    </p>
                    <p className="text-[12px] text-[#42526e] mt-2 pt-2 border-t border-[#f4f5f7]">
                      Phone: {selectedOrder.customer?.phone}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-[11px] font-semibold text-[#6b778c] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Banknote size={12} /> Payment
                  </h4>
                  <div className="bg-[#fafbfc] rounded border border-[#dfe1e6] p-3">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                        selectedOrder.paymentStatus === 'Paid'
                          ? 'bg-[#e3fcef] text-[#006644] border-[#abf5d1]'
                          : selectedOrder.paymentStatus === 'Online Payment'
                            ? 'bg-[#deebff] text-[#0052cc] border-[#b3d4ff]'
                            : selectedOrder.paymentStatus === 'Cash Payment'
                              ? 'bg-[#eae6ff] text-[#403294] border-[#c0b6f2]'
                              : 'bg-[#fff0b3] text-[#974f0c] border-[#ffe380]'
                      }`}
                    >
                      {selectedOrder.paymentStatus || 'Pending'}
                    </span>
                    <p className="text-[11px] text-[#a5adba] mt-2">
                      Update status from list view.
                    </p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <h4 className="text-[11px] font-semibold text-[#6b778c] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <ShoppingBag size={12} /> Items (
                {selectedOrder.products?.length})
              </h4>
              <div className="bg-[#fafbfc] rounded border border-[#dfe1e6] divide-y divide-[#f4f5f7]">
                {selectedOrder.products?.map((p, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center px-3 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-[#6b778c] bg-[#f4f5f7] w-7 h-7 rounded flex items-center justify-center border border-[#dfe1e6]">
                        {p.qty}x
                      </span>
                      <div>
                        <p className="text-[13px] text-[#172b4d]">{p.name}</p>
                        <p className="text-[11px] text-[#a5adba]">
                          ₹{p.price} each
                        </p>
                      </div>
                    </div>
                    <span className="text-[13px] font-semibold text-[#172b4d]">
                      ₹{(p.price * p.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-4 pt-4 border-t border-[#dfe1e6] flex justify-between items-center">
                <span className="text-[13px] text-[#6b778c]">Total Amount</span>
                <span className="text-[17px] font-semibold text-[#172b4d]">
                  ₹{selectedOrder.total?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-[#fafbfc] border-t border-[#dfe1e6] flex gap-2 shrink-0">
              <button
                onClick={() => {
                  setInvoiceOrder(selectedOrder);
                  setSelectedOrder(null);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white border border-[#dfe1e6] rounded text-[13px] font-medium text-[#42526e] hover:bg-[#f4f5f7] transition-colors"
              >
                <FileText size={14} /> View Invoice
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedOrder.id);
                  setSelectedOrder(null);
                }}
                className="px-4 py-2 bg-white border border-[#ffbdad] rounded text-[#de350b] hover:bg-[#ffebe6] transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {invoiceOrder && (
        <InvoiceTemplate
          order={invoiceOrder}
          rank={rankMap[invoiceOrder.id]}
          onClose={() => setInvoiceOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderManagement;
