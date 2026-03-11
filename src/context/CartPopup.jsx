import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  User,
  Phone,
  Mail,
  MapPin,
  Truck,
  Trash2,
  Building2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../admin/OrderContext';

/* ================= INPUT FIELD COMPONENT ================= */
const InputField = ({ icon: Icon, label, ...props }) => (
  <div className="space-y-1">
    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className="relative">
      <Icon
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        {...props}
        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white
        focus:ring-1 focus:ring-accent/20 focus:border-accent focus:outline-none text-sm text-gray-800 transition-all"
      />
    </div>
  </div>
);

const CartPopup = () => {
  const { cart, removeItem, updateItemQty, setOpenCart, clearCart } = useCart();
  const { addOrder } = useOrders();

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    pincode: '',
    city: '',
  });

  const handleCustomerChange = (e) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };

  /* ================= PRICE CALCULATION ================= */
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );
  const shipping = cart.length ? 40 : 0;
  const total = subtotal + shipping;

  /* ================= WHATSAPP MESSAGE LOGIC ================= */
  const whatsappNumber = '919500694734';

  const whatsappMessage = `
🧨 *DHEERAN CRACKERS ORDER* 🧨

👤 *Name:* ${customerDetails.name}
📞 *Phone:* ${customerDetails.phone}
📧 *Email:* ${customerDetails.email || 'N/A'}
📍 *Address:* ${customerDetails.address}
🌆 *City:* ${customerDetails.city}
📮 *Pincode:* ${customerDetails.pincode}

🛒 *Products:*
${cart
  .map(
    (item, i) =>
      `${i + 1}. ${item.name} × ${item.qty} = ₹${(
        item.price * item.qty
      ).toFixed(2)}`
  )
  .join('\n')}

💰 *Subtotal:* ₹${subtotal.toFixed(2)}
🚚 *Shipping:* ₹${shipping.toFixed(2)}
⭐ *Total Amount: ₹${total.toFixed(2)}*
`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const isFormValid =
    cart.length > 0 &&
    customerDetails.name &&
    customerDetails.phone &&
    customerDetails.address &&
    customerDetails.city;

  return (
    <div className="fixed inset-0 z-[1000] bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 font-sans">
      <div className="bg-white w-full max-w-6xl h-[95vh] md:h-[88vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200">
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-4 bg-gray-900 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-accent p-2 rounded-lg">
              <ShoppingBag size={18} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Your Order
              </p>
              <span className="font-bold text-base">
                {cart.length} Items • ₹{total.toLocaleString()}
              </span>
            </div>
          </div>
          <button
            onClick={() => setOpenCart(false)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-accent transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          {/* LEFT SECTION: CART ITEMS */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-white">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              Your Cart Items
            </h2>

            {cart.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                  <ShoppingBag size={32} />
                </div>
                <p className="text-gray-500 font-medium mb-4">
                  Your cart feels a bit light!
                </p>
                <button
                  onClick={() => setOpenCart(false)}
                  className="bg-accent text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-brand-dark transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover group-hover:scale-105 transition-transform"
                    />

                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm leading-tight">
                        {item.name}
                      </p>
                      <p className="text-sm text-accent font-bold mt-1">
                        ₹{item.price}
                      </p>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center bg-white rounded-lg border border-gray-200 p-0.5">
                          <button
                            disabled={item.qty === 1}
                            onClick={() => updateItemQty(item.id, item.qty - 1)}
                            className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-all"
                          >
                            −
                          </button>
                          <span className="font-bold w-7 text-center text-gray-800 text-sm">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateItemQty(item.id, item.qty + 1)}
                            className="w-7 h-7 rounded flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-all"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SECTION: CUSTOMER DETAILS */}
          <div className="w-full md:w-[400px] bg-gray-50 p-6 md:p-8 overflow-y-auto border-l border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Checkout Info
            </h2>

            <div className="space-y-4 mb-8">
              <InputField
                icon={User}
                label="Full Name *"
                name="name"
                placeholder="Enter your name"
                value={customerDetails.name}
                onChange={handleCustomerChange}
              />
              <InputField
                icon={Phone}
                label="Phone Number *"
                name="phone"
                placeholder="Enter phone number"
                value={customerDetails.phone}
                onChange={handleCustomerChange}
              />
              <InputField
                icon={Mail}
                label="Email Address"
                name="email"
                placeholder="Optional"
                value={customerDetails.email}
                onChange={handleCustomerChange}
              />

              <div className="grid grid-cols-2 gap-3">
                <InputField
                  icon={Building2}
                  label="City / Town *"
                  name="city"
                  placeholder="City"
                  value={customerDetails.city}
                  onChange={handleCustomerChange}
                />
                <InputField
                  icon={MapPin}
                  label="Pincode"
                  name="pincode"
                  placeholder="6xxxxx"
                  value={customerDetails.pincode}
                  onChange={handleCustomerChange}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider ml-1">
                  Delivery Address *
                </label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <textarea
                    name="address"
                    placeholder="Door No, Street Name, Area..."
                    value={customerDetails.address}
                    onChange={handleCustomerChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-1 focus:ring-accent/20 focus:border-accent outline-none text-sm text-gray-800"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* ORDER SUMMARY CARD */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center gap-2 mb-4 text-gray-400">
                <Truck size={16} />
                <h3 className="text-[11px] font-semibold uppercase tracking-wider">
                  Bill Summary
                </h3>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-800 font-semibold">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping Fee</span>
                  <span className="text-gray-800 font-semibold">
                    ₹{shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-2">
                  <span className="text-gray-900 font-bold">Grand Total</span>
                  <span className="text-xl font-bold text-accent">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* PLACE ORDER BUTTON */}
            <button
              disabled={!isFormValid}
              onClick={async () => {
                await addOrder({
                  customer: customerDetails,
                  products: cart,
                  subtotal,
                  shipping,
                  total,
                  createdAt: new Date(),
                });

                window.open(whatsappUrl, '_blank');
                clearCart();
                setOpenCart(false);
              }}
              className={`w-full py-3 rounded-lg font-semibold text-base transition-all
                ${
                  isFormValid
                    ? 'bg-green-600 hover:bg-green-700 text-white active:scale-[0.98]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              Order via WhatsApp
            </button>

            <p className="text-[11px] font-medium text-gray-400 text-center mt-4 uppercase tracking-wider">
              Instant Confirmation on WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;
