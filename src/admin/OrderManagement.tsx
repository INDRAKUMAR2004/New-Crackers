"use client";
import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';
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
  Banknote,
  FileText,
  MapPin,
  Phone,
} from 'lucide-react';
import InvoiceTemplate from './InvoiceTemplate';
import { useOrders } from './OrderContext';
import { getOrderCode } from '../utils/orderCode';

const OrderManagement = () => {
  const { orders, loading, fetchOrders, updateOrderStatus, deleteOrder } =
    useOrders();
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = order.orderDate?.toDate
        ? order.orderDate.toDate()
        : null;
      const matchesSearch = search
        ? [
            order.orderCode,
            order.id,
            order.customer?.name,
            order.customer?.phone,
            order.customer?.city,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value).toLowerCase().includes(search.toLowerCase())
            )
        : true;

      const matchesStartDate =
        startDate && orderDate
          ? orderDate >= new Date(`${startDate}T00:00:00`)
          : true;
      const matchesEndDate =
        endDate && orderDate
          ? orderDate <= new Date(`${endDate}T23:59:59`)
          : true;

      return matchesSearch && matchesStartDate && matchesEndDate;
    });
  }, [orders, search, startDate, endDate]);

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
          label: status || 'Pending',
        };
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdating(orderId);
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (!result?.success) {
        throw new Error(result?.error || 'Failed to update status.');
      }
      toast.success('Order status updated');
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error(err?.message || 'Failed to update status.');
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleDelete = async (id) => {
    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span className="text-sm">Delete this order?</span>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const result = await deleteOrder(id);
              if (result?.success) {
                toast.success('Order deleted');
                setSelectedOrder(null);
                setInvoiceOrder(null);
              } else {
                toast.error(result?.error || 'Failed to delete order');
              }
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

  const handleDownloadPDF = (order) => {
    try {
      const orderCode = getOrderCode(order);
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(220, 38, 38);
      doc.text('DHEERAN CRACKERS', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Invoice: ${orderCode}`, 14, 30);
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

      doc.save(`Invoice_${orderCode}.pdf`);
    } catch (error) {
      console.error('PDF Error:', error);
      toast.error('Error generating PDF');
    }
  };

  return (
    <div className="space-y-5 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-[18px] font-bold text-[#1a1a2e]">
              Sales Orders
            </h1>
            <p className="text-[12px] text-[#7c8db5] mt-0.5">
              {orders.length} total orders
            </p>
          </div>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-[#d6dce8] rounded-md text-[13px] font-medium text-[#3d4f6f] hover:bg-[#f0f5fa] transition-colors shadow-sm"
        >
          <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-lg border border-[#e4e7ec] p-3 flex flex-col lg:flex-row gap-3 shadow-sm">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7c8db5]"
          />
          <input
            placeholder="Search by name, city, order ID..."
            className="w-full pl-9 pr-3 py-2.5 text-[13px] bg-[#f7f9fc] border border-[#e4e7ec] rounded-md text-[#1a1a2e] placeholder-[#9ca8c0] outline-none focus:border-[#0065b3] focus:ring-2 focus:ring-[#0065b3]/15 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-col sm:flex-row">
          <div className="flex items-center bg-[#f7f9fc] border border-[#e4e7ec] rounded-md px-3 gap-2">
            <Calendar size={14} className="text-[#7c8db5] shrink-0" />
            <input
              type="date"
              className="bg-transparent py-2 outline-none text-[13px] text-[#3d4f6f]"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex items-center bg-[#f7f9fc] border border-[#e4e7ec] rounded-md px-3 gap-2">
            <Calendar size={14} className="text-[#7c8db5] shrink-0" />
            <input
              type="date"
              className="bg-transparent py-2 outline-none text-[13px] text-[#3d4f6f]"
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
            className="px-4 py-2 bg-[#f0f5fa] border border-[#e4e7ec] rounded-md text-[13px] font-medium text-[#3d4f6f] hover:bg-[#e4ecf5] transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-[3px] border-[#0065b3] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[13px] text-[#7c8db5]">Loading orders...</p>
          </div>
        </div>
      )}

      {!loading && filteredOrders.length === 0 && (
        <div className="bg-white rounded-lg border border-[#e4e7ec] flex flex-col items-center justify-center py-20 text-center shadow-sm">
          <div className="w-14 h-14 bg-[#f0f5fa] rounded-full flex items-center justify-center mb-4">
            <ShoppingBag size={26} className="text-[#0065b3]" />
          </div>
          <h3 className="text-[15px] font-semibold text-[#1a1a2e] mb-1">
            No orders found
          </h3>
          <p className="text-[13px] text-[#7c8db5]">
            Try adjusting your search or date filters
          </p>
        </div>
      )}

      {!loading && filteredOrders.length > 0 && (
        <div className="bg-white rounded-lg border border-[#e4e7ec] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f0f5fa] border-b-2 border-[#0065b3]">
                  <th className="px-5 py-3 text-[10px] font-bold text-[#0065b3] uppercase tracking-widest hidden md:table-cell">
                    #
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold text-[#0065b3] uppercase tracking-widest">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold text-[#0065b3] uppercase tracking-widest text-center hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold text-[#0065b3] uppercase tracking-widest text-center hidden sm:table-cell">
                    Items
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold text-[#0065b3] uppercase tracking-widest text-right">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold text-[#0065b3] uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef1f6]">
                {filteredOrders.map((order) => {
                  const status = getStatusConfig(order.paymentStatus);
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[#f7f9fc] transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className="text-[12px] font-mono font-semibold text-[#0065b3]">
                          {getOrderCode(order)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-[13px] font-semibold text-[#1a1a2e]">
                          {order.customer?.name}
                        </p>
                        <p className="text-[11px] text-[#7c8db5] flex items-center gap-1 mt-0.5">
                          <MapPin size={10} />{' '}
                          {order.customer?.city || 'Unknown'}
                        </p>
                      </td>
                      <td
                        className="px-4 py-3.5 text-center hidden sm:table-cell"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={order.paymentStatus || 'Pending'}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          disabled={statusUpdating === order.id}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border outline-none cursor-pointer appearance-none text-center ${
                            order.paymentStatus === 'Paid'
                              ? 'bg-[#e6f9f0] text-[#0d7a40] border-[#b8e8d0]'
                              : order.paymentStatus === 'Online Payment'
                                ? 'bg-[#e6f0ff] text-[#0052cc] border-[#b3d4ff]'
                                : order.paymentStatus === 'Cash Payment'
                                  ? 'bg-[#f0ecff] text-[#5243aa] border-[#c0b6f2]'
                                  : 'bg-[#fff8e1] text-[#b45309] border-[#fde68a]'
                          } ${statusUpdating === order.id ? 'opacity-50' : ''}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Online Payment">Online</option>
                          <option value="Cash Payment">Cash</option>
                        </select>
                      </td>
                      <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                        <span className="text-[12px] text-[#3d4f6f] font-medium bg-[#f0f5fa] px-2 py-0.5 rounded">
                          {order.products?.length || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="text-[13px] font-bold text-[#1a1a2e]">
                          ₹{order.total?.toLocaleString()}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-0.5">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-md hover:bg-[#e6f0ff] text-[#7c8db5] hover:text-[#0065b3] transition-colors"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setInvoiceOrder(order)}
                            className="p-1.5 rounded-md hover:bg-[#f0ecff] text-[#7c8db5] hover:text-[#5243aa] transition-colors"
                            title="Invoice"
                          >
                            <FileText size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-1.5 rounded-md hover:bg-[#fef2f2] text-[#7c8db5] hover:text-[#dc2626] transition-colors"
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

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="bg-[#0065b3] px-6 py-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                  <ShoppingBag size={18} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[16px] font-semibold text-white">
                      Order {getOrderCode(selectedOrder)}
                    </h2>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                        selectedOrder.paymentStatus === 'Paid'
                          ? 'bg-emerald-400/20 text-emerald-100'
                          : selectedOrder.paymentStatus === 'Online Payment'
                            ? 'bg-sky-400/20 text-sky-100'
                            : selectedOrder.paymentStatus === 'Cash Payment'
                              ? 'bg-violet-400/20 text-violet-100'
                              : 'bg-amber-400/20 text-amber-100'
                      }`}
                    >
                      {selectedOrder.paymentStatus || 'Pending'}
                    </span>
                  </div>
                  <p className="text-[12px] text-blue-100 mt-0.5">
                    {selectedOrder.orderDate?.toDate
                      ? format(
                          selectedOrder.orderDate.toDate(),
                          'hh:mm a, dd MMM yyyy'
                        )
                      : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-lg hover:bg-white/15 text-white/70 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              <div className="bg-[#f7f9fc] px-6 py-4 border-b border-[#e4e7ec]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <p className="text-[10px] font-bold text-[#0065b3] uppercase tracking-widest mb-1.5">
                      Customer
                    </p>
                    <p className="text-[14px] font-semibold text-[#1a1a2e]">
                      {selectedOrder.customer?.name}
                    </p>
                    <p className="text-[12px] text-[#6b7b94] mt-0.5 flex items-center gap-1.5">
                      <Phone size={11} />
                      {selectedOrder.customer?.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#0065b3] uppercase tracking-widest mb-1.5">
                      Shipping Address
                    </p>
                    <p className="text-[13px] text-[#1a1a2e]">
                      {selectedOrder.customer?.address}
                    </p>
                    <p className="text-[12px] text-[#6b7b94] mt-0.5">
                      {selectedOrder.customer?.city}
                      {selectedOrder.customer?.pincode
                        ? ` - ${selectedOrder.customer?.pincode}`
                        : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#0065b3] uppercase tracking-widest mb-1.5">
                      Payment
                    </p>
                    <span
                      className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-md ${
                        selectedOrder.paymentStatus === 'Paid'
                          ? 'bg-[#e6f9f0] text-[#0d7a40]'
                          : selectedOrder.paymentStatus === 'Online Payment'
                            ? 'bg-[#e6f0ff] text-[#0052cc]'
                            : selectedOrder.paymentStatus === 'Cash Payment'
                              ? 'bg-[#f0ecff] text-[#5243aa]'
                              : 'bg-[#fff8e1] text-[#b45309]'
                      }`}
                    >
                      {selectedOrder.paymentStatus === 'Paid' && (
                        <CheckCircle2 size={13} />
                      )}
                      {selectedOrder.paymentStatus === 'Pending' && (
                        <Clock size={13} />
                      )}
                      {(selectedOrder.paymentStatus === 'Online Payment' ||
                        selectedOrder.paymentStatus === 'Cash Payment') && (
                        <Banknote size={13} />
                      )}
                      {selectedOrder.paymentStatus || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[12px] font-bold text-[#0065b3] uppercase tracking-widest flex items-center gap-1.5">
                    <ShoppingBag size={13} />
                    Order Items ({selectedOrder.products?.length || 0})
                  </h4>
                </div>
                <div className="border border-[#e4e7ec] rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#f0f5fa] border-b border-[#d6dce8]">
                        <th className="px-4 py-2.5 text-[10px] font-bold text-[#0065b3] uppercase tracking-widest w-10 text-center hidden sm:table-cell">
                          #
                        </th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-[#0065b3] uppercase tracking-widest">
                          Item & Description
                        </th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-[#0065b3] uppercase tracking-widest text-right w-24 hidden sm:table-cell">
                          Rate
                        </th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-[#0065b3] uppercase tracking-widest text-center w-16">
                          Qty
                        </th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-[#0065b3] uppercase tracking-widest text-right w-28">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.products?.map((p, i) => (
                        <tr
                          key={i}
                          className="border-b border-[#f0f2f5] hover:bg-[#fafbfd] transition-colors"
                        >
                          <td className="px-4 py-3 text-center text-[12px] text-[#7c8db5] hidden sm:table-cell">
                            {i + 1}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-[13px] font-medium text-[#1a1a2e]">
                              {p.name}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-right text-[13px] text-[#3d4f6f] hidden sm:table-cell">
                            ₹{p.price?.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-[12px] font-semibold text-[#1a1a2e] bg-[#f0f5fa] px-2 py-0.5 rounded">
                              {p.qty}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-[13px] font-semibold text-[#1a1a2e]">
                            ₹{(p.price * p.qty).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="bg-[#fafbfd] px-4 py-3 border-t border-[#e4e7ec]">
                    <div className="flex justify-end">
                      <div className="w-[260px] space-y-1.5">
                        <div className="flex justify-between text-[12px]">
                          <span className="text-[#6b7b94]">Sub Total</span>
                          <span className="text-[#1a1a2e] font-medium">
                            ₹{selectedOrder.total?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-[12px] pb-2 border-b border-[#e4e7ec]">
                          <span className="text-[#6b7b94]">Discount</span>
                          <span className="text-[#1a1a2e] font-medium">₹0</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#0065b3] rounded-md px-3 py-2 -mx-1">
                          <span className="text-[13px] font-bold text-white">
                            Total
                          </span>
                          <span className="text-[16px] font-bold text-white">
                            ₹{selectedOrder.total?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-[#f7f9fc] border-t border-[#e4e7ec] flex gap-2 shrink-0">
              <button
                onClick={() => {
                  setInvoiceOrder(selectedOrder);
                  setSelectedOrder(null);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#0065b3] rounded-md text-[13px] font-medium text-white hover:bg-[#005299] transition-colors"
              >
                <FileText size={14} /> View Invoice
              </button>
              <button
                onClick={() => handleDownloadPDF(selectedOrder)}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-[#d6dce8] rounded-md text-[13px] font-medium text-[#3d4f6f] hover:bg-[#f0f5fa] transition-colors"
              >
                <Download size={14} /> PDF
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedOrder.id);
                  setSelectedOrder(null);
                }}
                className="px-3 py-2.5 bg-white border border-[#fecaca] rounded-md text-[#dc2626] hover:bg-[#fef2f2] transition-colors"
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
          onClose={() => setInvoiceOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderManagement;
