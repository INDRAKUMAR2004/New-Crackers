import {
  ShoppingBag,
  Users,
  AlertTriangle,
  CreditCard,
  Plus,
  ArrowRight,
  Clock,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useOrders } from './OrderContext';
import { useProducts } from './ProductContext';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { getOrderCode } from '../utils/orderCode';

export default function Dashboard() {
  const { orders, loading: ordersLoading } = useOrders();
  const { products, loading: productsLoading } = useProducts();

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (Number(order.total) || 0),
    0
  );
  const totalOrders = orders.length;
  const uniqueCustomers = new Set(
    orders.map((o) => o.customer?.phone).filter(Boolean)
  ).size;
  const lowStockItems = products.filter((p) => (Number(p.stock) || 0) < 20);
  const lowStockCount = lowStockItems.length;
  const recentOrders = orders.slice(0, 5);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-[#fff7e6] text-[#ff8b00] border-[#ffe4b5]';
      case 'Delivered':
        return 'bg-[#e3fcef] text-[#006644] border-[#abf5d1]';
      case 'Processing':
        return 'bg-[#deebff] text-[#0052cc] border-[#b3d4ff]';
      case 'Cancelled':
        return 'bg-[#ffebe6] text-[#de350b] border-[#ffbdad]';
      default:
        return 'bg-[#f4f5f7] text-[#42526e] border-[#dfe1e6]';
    }
  };

  if (ordersLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#0078d4] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-[#6b778c]">Loading...</p>
        </div>
      </div>
    );
  }

  const statsData = [
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: CreditCard,
      color: '#0078d4',
      bg: '#e9f2ff',
    },
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: ShoppingBag,
      color: '#6554c0',
      bg: '#eae6ff',
    },
    {
      label: 'Customers',
      value: uniqueCustomers,
      icon: Users,
      color: '#00875a',
      bg: '#e3fcef',
    },
    {
      label: 'Low Stock',
      value: lowStockCount,
      icon: AlertTriangle,
      color: '#ff8b00',
      bg: '#fff7e6',
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#172b4d]">Dashboard</h1>
          <p className="text-[13px] text-[#6b778c] mt-0.5 flex items-center gap-1.5">
            <Clock size={13} /> Last updated:{' '}
            {format(new Date(), 'dd MMM yyyy, HH:mm')}
          </p>
        </div>
        <Link
          to="/admin/add-product"
          className="flex items-center gap-1.5 bg-[#0078d4] text-white px-4 py-2 rounded text-[13px] font-medium hover:bg-[#106ebe] transition-colors"
        >
          <Plus size={16} /> New Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-[#dfe1e6] p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: item.bg }}
              >
                <item.icon size={18} style={{ color: item.color }} />
              </div>
            </div>
            <p className="text-[12px] font-medium text-[#6b778c] uppercase tracking-wide">
              {item.label}
            </p>
            <h3 className="text-2xl font-semibold text-[#172b4d] mt-1">
              {item.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-lg border border-[#dfe1e6] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#dfe1e6] flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-[#172b4d]">
                Recent Orders
              </h2>
              <p className="text-[12px] text-[#6b778c]">
                Latest {recentOrders.length} transactions
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="text-[13px] font-medium text-[#0078d4] hover:text-[#106ebe] transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#fafbfc] text-[11px] font-semibold text-[#6b778c] uppercase tracking-wide border-b border-[#dfe1e6]">
                <tr>
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f5f7]">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-8 text-center text-[13px] text-[#6b778c]"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-[#fafbfc] transition-colors"
                    >
                      <td className="px-5 py-3">
                        <span className="text-[12px] font-mono font-medium text-[#0078d4]">
                          {getOrderCode(order)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-[13px] font-medium text-[#172b4d]">
                          {order.customer?.name || 'Unknown'}
                        </div>
                        <div className="text-[11px] text-[#6b778c]">
                          {order.customer?.city}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[13px] font-semibold text-[#172b4d]">
                        ₹{order.total?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getStatusColor(order.paymentStatus)}`}
                        >
                          {order.paymentStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-[12px] text-[#6b778c]">
                        {order.orderDate?.toDate
                          ? format(order.orderDate.toDate(), 'dd MMM')
                          : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-lg border border-[#dfe1e6] overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-[#dfe1e6] flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-[#172b4d]">
              Inventory Alerts
            </h2>
            {lowStockCount > 0 && (
              <span className="bg-[#ffebe6] text-[#de350b] text-[11px] font-semibold px-2 py-0.5 rounded">
                {lowStockCount} low
              </span>
            )}
          </div>

          <div className="flex-1 p-4 space-y-2 overflow-y-auto max-h-[350px]">
            {lowStockItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-10 h-10 bg-[#e3fcef] rounded-full flex items-center justify-center text-[#00875a] mx-auto mb-2">
                  <Check size={18} />
                </div>
                <p className="text-[13px] font-medium text-[#172b4d]">
                  All stocked up!
                </p>
              </div>
            ) : (
              lowStockItems.slice(0, 5).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#fafbfc] border border-[#f4f5f7] hover:border-[#dfe1e6] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-[#172b4d] truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-[#6b778c]">
                      {item.productCode || 'No SKU'}
                    </p>
                  </div>
                  <span className="text-[15px] font-semibold text-[#de350b] ml-3">
                    {item.stock}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-[#dfe1e6]">
            <Link
              to="/admin/inventory"
              className="w-full py-2 bg-[#0078d4] text-white rounded text-[13px] font-medium flex items-center justify-center gap-1.5 hover:bg-[#106ebe] transition-colors"
            >
              View Inventory <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Check } from 'lucide-react';
